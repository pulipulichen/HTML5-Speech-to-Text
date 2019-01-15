/**
 * 主要程式
 * @param {type} filename
 * @param {type} data 關於data，請看data-example.json
 */
xlsx_helper_ods_download = function (filename, data) {
  //console.log(filename)
  console.log(data)
  xlsx_helper_create('ods', filename, data, true)
}

var xlsx_helper_create = function (type, filename, data, isDownload) {
    //console.log(filename);
    //var elt = document.getElementById('data-table');
    //var wb = XLSX.utils.table_to_book(elt, {sheet: "Sheet JS"});
    
    var wb = XLSX.utils.book_new();
    if (Array.isArray(data)) {
      // 檢查下兩層是不是物件
      for (var i = 0; i < data.length; i++) {
        for (var key in data[i]) {
          var value = data[i][key]
          if (typeof(value) === 'object') {
            data[i][key] = JSON.stringify(value)
          }
        }
      }
      
        var ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, "data");
    }
    else {
        for (var _sheet_name in data) {
            var _sheet_data = data[_sheet_name];
            if (Array.isArray(_sheet_data) === false) {
                var _tmp = [];
                for (var _field_name in _sheet_data) {
                    var _field_value = _sheet_data[_field_name];
                    if (typeof(_field_value) === "object") {
                      _field_value = JSON.stringify(_field_value)
                    }
                    _tmp.push({
                        'key': _field_name,
                        'value': _field_value
                    });
                }
                _sheet_data = _tmp;
            }
            var ws = XLSX.utils.json_to_sheet(_sheet_data);
            XLSX.utils.book_append_sheet(wb, ws, _sheet_name);
        }
    }
    
    // --------------------------------------
    
    if (filename.substr(filename.length-type.length-1, type.length+1) !== "." + type) {
        filename = filename + "." + type;
    }
    
    //XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'})
    /*
    if (typeof(ELECTRON_ENABLE) === 'undefined' || ELECTRON_ENABLE === false) {
        XLSX.writeFile(wb, filename || ('test.' + (type || 'xlsx')));
    }
    else {
        var _filters = [
            {
                name: "Open Document Spreadsheet",
                extensions: ["ods"]
            }
        ];
        ipcRenderer.send('save_file', filename, JSON.stringify(_filters), XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'}));
    }
    */
    if (isDownload === false) {
      return XLSX.write(wb, {bookType: type, bookSST: true, type: 'base64'});
    }
    else {
      XLSX.writeFile(wb, filename, {bookType: type, bookSST: true})
    }
};

var xlsx_helper_open = function (_callback) {
    $("#xlsx_helper_open_file").remove();
    var _input = $('<input type="file" name="xlfile" id="xlsx_helper_open_file" />').hide().appendTo('body');
    _input.change(function (e) {
         do_file(e.target.files, _callback);
    });
    _input.click();
};

var process_wb = (function() {
	var to_json = function to_json(workbook) {
		var result = {};
		workbook.SheetNames.forEach(function(sheetName) {
			var roa = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], {header:1});
			if(roa.length) result[sheetName] = roa;
		});
		//return JSON.stringify(result, 2, 2);
                var _result = {};
                for (var _sheet_name in result) {
                    var _sheet_data = result[_sheet_name];

                    var _data;
                    //console.log(_sheet_name);
                    if (_sheet_data[0][0] === 'key' && _sheet_data[0][1] === 'value' && _sheet_data[0].length === 2) {
                        // key-value模式
                        //console.log("key-value模式");
                        _data = {};
                        for (var _i = 1; _i < _sheet_data.length; _i++) {
                            var _row = _sheet_data[_i];
                            _data[_row[0]] = _row[1];
                        }
                    }
                    else {
                        // 陣列模式
                        //console.log("陣列模式");
                        _data = [];
                        var _key_dict = _sheet_data[0];
                        for (var _i = 1; _i < _sheet_data.length; _i++) {
                            var _row = _sheet_data[_i];
                            var _d = {};
                            for (var _j = 0; _j < _row.length; _j++) {
                                var _key = _key_dict[_j];
                                _d[_key] = _row[_j];
                            }
                            _data.push(_d);
                        }
                    }
                    _result[_sheet_name] = _data;
                }
                
                return _result;
	};
        
	return function process_wb(wb, _callback) {
		global_wb = wb;
		var output = "";
                output = to_json(wb);
                //console.log(output);
                
                _callback(output);
	};
})();

var XW = {
	/* worker message */
	msg: 'xlsx',
	/* worker scripts */
	worker: './lib/js-xlsx/xlsxworker.js'
};

var do_file = (function () {
    var rABS = true;
    //var use_worker = true;
    var xw = function xw(data, cb, _callback) {
        var worker = new Worker(XW.worker);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d), _callback);
                    break;
            }
        };
        worker.postMessage({d: data, b: rABS ? 'binary' : 'array'});
    };

    return function do_file(files, _callback) {
        var rABS = true;
        var use_worker = true;
        var f = files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            if (typeof console !== 'undefined') {
                //console.log("onload", new Date(), rABS, use_worker);
            }
            var data = e.target.result;
            if (!rABS) {
                data = new Uint8Array(data);
            }
            if (use_worker) {
                xw(data, process_wb, _callback);
            }
            else {
                //console.log(typeof(_callback));
                process_wb(XLSX.read(data, {type: rABS ? 'binary' : 'array'}), _callback);
            }
        };
        if (rABS) {
            reader.readAsBinaryString(f);
        }
        else {
            reader.readAsArrayBuffer(f);
        }
    };
})();

/**
 * 可以用了
 * @param {type} _base64_data
 * @param {type} _callback
 * @returns {undefined}
 */
xlsx_helper_open_file = function (_base64_data, _callback) {
    //var _mime = "application/vnd.oasis.opendocument.spreadsheet";
    //console.log(_base64_data);
    //var _blob_data = PULI_UTILS.b64toFile(_base64_data, _mime);
    //alert(JSON.stringify(_blob_data));
    /*
    var rABS = false;
    var xw = function xw(data, cb, _callback_xw) {
        var worker = new Worker(XW.worker);
        worker.onmessage = function (e) {
            switch (e.data.t) {
                case 'ready':
                    break;
                case 'e':
                    console.error(e.data.d);
                    break;
                case XW.msg:
                    cb(JSON.parse(e.data.d), _callback_xw);
                    break;
            }
        };
        worker.postMessage({d: data, b: rABS ? 'binary' : 'array'});
    };
    _blob_data = new Uint8Array(_blob_data);
    //xw(_blob_data, process_wb, _callback);
    */
    /*
    var rABS = false;
    console.log(1);
    
    console.log(2);
    */
    //var workbook = XLSX.read(_base64_data, {type:'base64'})
    //var workbook = XLSX.read(_base64_data.replace(/\//g, "_").replace(/\+/g, "-"), {type:'base64'})
    //var workbook = XLSX.read(_base64_data.replace(/\//g, "_").replace(/\+/g, "-").concat('=', (4 - ( _base64_data.length % 4 ))), {type:'base64'})
    var workbook = XLSX.read(_base64_data.replace(/_/g, "/").replace(/-/g, "+"), {type:'base64'})
    process_wb(workbook, _callback);
};

/*
setTimeout(function () {
    //var data = [{name:"Sheet", age: 12}, {name:"JS", age: 24}]
    var data = {
        "s0": {"a": 1, "b": 2},
        "s1": [{name:"Sheet", age: 12}, {name:"JS", age: 24}],
        "s2": [{name:"Sheet", age: 12}, {name:"JS", age: 24}]
    };
    
    xlsx_helper_download('ods', 'ok', data);
}, 10);
*/
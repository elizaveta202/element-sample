/**
 * @param {Array} collection
 * @params {Function[]} – Функции для запроса
 * @returns {Array}
 */

function  check_params(obj, sample){
    let valid_fields = [];
    sample.forEach(function(val){
        if (obj.hasOwnProperty(val)){
            valid_fields.push(val);
        }
    });
    return valid_fields;
}

const intersect2 = (xs,ys) => xs.filter(x => ys.some(y => y === x));
const intersect = (xs,ys,...rest) => ys === undefined ? xs : intersect(intersect2(xs,ys),...rest);

function query(collection) {
let result_collection = collection;
  if (arguments.length == 1){
    return result_collection;
  }


  let args = [].slice.call(arguments);
  let select_fields = [];
  let filter_fields = new Map();

  for (var i = 1; i < args.length; i++) {

        if (args[i][0] == 'select') {
            select_fields.push(check_params(collection[0], args[i][1]));
        }

        if (args[i][0] == 'filterIn') {
            let filter_field = args[i][1][0];
            let accepted_vals = args[i][1][1];
            if (collection[0].hasOwnProperty(filter_field)){
                if (filter_fields.has(filter_field)){
                    filter_fields.get(filter_field).push(accepted_vals);
                }
                else{
                    filter_fields.set(filter_field, [accepted_vals]);
                }
            }
        }
    }

    select_fields = intersect(...select_fields);
    console.log("select_fields", select_fields);
    // console.log("select_fields_after_intersection", intersect(...select_fields));

    // console.log("filter_fields", filter_fields);

    filter_fields.forEach(function(value, key) {
        // console.log(key + ' = ' + value);
        intersect_filter_fields = intersect(...value);
        filter_fields.set(key, intersect_filter_fields);
    });

    console.log("filter_fields", filter_fields);
}

/**
 * @params {String[]}
 */
function select() {
    let fields = [].slice.call(arguments);
    return ['select', fields];
}

/**
 * @param {String} property – Свойство для фильтрации
 * @param {Array} values – Массив разрешённых значений
 */
function filterIn(property, values) {
    let fields = [].slice.call(arguments);
    return ['filterIn', fields];
}

module.exports = {
    query: query,
    select: select,
    filterIn: filterIn
};

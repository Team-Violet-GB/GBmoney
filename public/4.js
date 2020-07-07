(window["webpackJsonp"] = window["webpackJsonp"] || []).push([[4],{

/***/ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/Feed.vue?vue&type=script&lang=js&":
/*!**********************************************************************************************************************************************************!*\
  !*** ./node_modules/babel-loader/lib??ref--4-0!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/Feed.vue?vue&type=script&lang=js& ***!
  \**********************************************************************************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var element_theme_dark__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! element-theme-dark */ "./node_modules/element-theme-dark/lib/index.css");
/* harmony import */ var element_theme_dark__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(element_theme_dark__WEBPACK_IMPORTED_MODULE_0__);
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//

/* harmony default export */ __webpack_exports__["default"] = ({
  name: "feed",
  data: function data() {
    return {
      tableData: [{
        date: '2015-07-29',
        type: 'Расход',
        source: 'Карта',
        receiver: 'Авто',
        amount: 2000,
        comment: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
      }, {
        date: '2011-11-12',
        type: 'Доход',
        source: 'Зарплата',
        receiver: 'Кошелек',
        amount: 20000,
        comment: 'Adipisci commodi deleniti earum ex laborum magni perferendis porro. Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
      }, {
        date: '2010-03-18',
        type: 'Перевод',
        source: 'Кошелек',
        receiver: 'Заначка',
        amount: 13000,
        comment: 'Aut corporis culpa cum debitis deserunt dicta dolor dolores doloribus eaque eius esse eveniet ex illo impedit iure laboriosam minus molestias natus, officia optio perferendis quisquam repellat reprehenderit saepe similique soluta suscipit tempora totam ut velit voluptas voluptates voluptatibus voluptatum. Aliquid consequuntur labore magni saepe unde? Consectetur cum dolor dolorum harum in incidunt inventore, ipsa iure nemo similique sint tempore ut voluptas! Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
      }, {
        date: '2001-05-03',
        type: 'Перевод',
        source: 'Карта',
        receiver: 'Кошелек',
        amount: 7500,
        comment: 'Culpa deserunt dolorum ea laboriosam, optio voluptatibus! Aliquid aut consequatur, consequuntur, itaque laudantium magni nostrum qui repellendus sint suscipit, voluptas voluptatem!'
      }]
    };
  },
  methods: {
    dateLocalizer: function dateLocalizer(row, column) {
      var localDate = new Date(row[column.property]);
      var options = {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        timezone: 'UTC',
        hour: 'numeric',
        minute: 'numeric'
      };
      return localDate.toLocaleString("ru", options);
    },
    amountLocalizer: function amountLocalizer(row, column) {
      return row[column.property] + ' ' + String.fromCharCode(8381);
    },
    tableHeaderColor: function tableHeaderColor(_ref) {
      var row = _ref.row,
          column = _ref.column,
          rowIndex = _ref.rowIndex,
          columnIndex = _ref.columnIndex;
      return 'background-color: #5f6068;color: #fff;font-weight: 700;';
    }
  }
});

/***/ }),

/***/ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true&":
/*!**************************************************************************************************************************************************************************************************************!*\
  !*** ./node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!./node_modules/vue-loader/lib??vue-loader-options!./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true& ***!
  \**************************************************************************************************************************************************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "render", function() { return render; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return staticRenderFns; });
var render = function() {
  var _vm = this
  var _h = _vm.$createElement
  var _c = _vm._self._c || _h
  return _c(
    "div",
    [
      _c(
        "el-table",
        {
          staticStyle: { width: "100%" },
          attrs: {
            data: _vm.tableData,
            "default-sort": { prop: "date", order: "descending" },
            "header-cell-style": _vm.tableHeaderColor
          }
        },
        [
          _c("el-table-column", {
            attrs: { type: "expand" },
            scopedSlots: _vm._u([
              {
                key: "default",
                fn: function(props) {
                  return [
                    _c("h2", [
                      _vm._v(
                        _vm._s(props.row.source) +
                          " -> " +
                          _vm._s(props.row.receiver)
                      )
                    ]),
                    _vm._v(" "),
                    _c("h4", [_vm._v(_vm._s(props.row.comment))])
                  ]
                }
              }
            ])
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: {
              prop: "date",
              label: "Дата",
              sortable: "",
              formatter: _vm.dateLocalizer
            }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: {
              prop: "amount",
              label: "Сумма",
              sortable: "",
              formatter: _vm.amountLocalizer
            }
          }),
          _vm._v(" "),
          _c("el-table-column", {
            attrs: { prop: "type", label: "Операция", sortable: "" }
          })
        ],
        1
      )
    ],
    1
  )
}
var staticRenderFns = []
render._withStripped = true



/***/ }),

/***/ "./resources/js/views/Feed.vue":
/*!*************************************!*\
  !*** ./resources/js/views/Feed.vue ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Feed.vue?vue&type=template&id=40b87386&scoped=true& */ "./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true&");
/* harmony import */ var _Feed_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./Feed.vue?vue&type=script&lang=js& */ "./resources/js/views/Feed.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport *//* harmony import */ var _node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../node_modules/vue-loader/lib/runtime/componentNormalizer.js */ "./node_modules/vue-loader/lib/runtime/componentNormalizer.js");





/* normalize component */

var component = Object(_node_modules_vue_loader_lib_runtime_componentNormalizer_js__WEBPACK_IMPORTED_MODULE_2__["default"])(
  _Feed_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_1__["default"],
  _Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"],
  _Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"],
  false,
  null,
  "40b87386",
  null

)

/* hot reload */
if (false) { var api; }
component.options.__file = "resources/js/views/Feed.vue"
/* harmony default export */ __webpack_exports__["default"] = (component.exports);

/***/ }),

/***/ "./resources/js/views/Feed.vue?vue&type=script&lang=js&":
/*!**************************************************************!*\
  !*** ./resources/js/views/Feed.vue?vue&type=script&lang=js& ***!
  \**************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Feed_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/babel-loader/lib??ref--4-0!../../../node_modules/vue-loader/lib??vue-loader-options!./Feed.vue?vue&type=script&lang=js& */ "./node_modules/babel-loader/lib/index.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/Feed.vue?vue&type=script&lang=js&");
/* empty/unused harmony star reexport */ /* harmony default export */ __webpack_exports__["default"] = (_node_modules_babel_loader_lib_index_js_ref_4_0_node_modules_vue_loader_lib_index_js_vue_loader_options_Feed_vue_vue_type_script_lang_js___WEBPACK_IMPORTED_MODULE_0__["default"]);

/***/ }),

/***/ "./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true&":
/*!********************************************************************************!*\
  !*** ./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true& ***!
  \********************************************************************************/
/*! exports provided: render, staticRenderFns */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! -!../../../node_modules/vue-loader/lib/loaders/templateLoader.js??vue-loader-options!../../../node_modules/vue-loader/lib??vue-loader-options!./Feed.vue?vue&type=template&id=40b87386&scoped=true& */ "./node_modules/vue-loader/lib/loaders/templateLoader.js?!./node_modules/vue-loader/lib/index.js?!./resources/js/views/Feed.vue?vue&type=template&id=40b87386&scoped=true&");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "render", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__["render"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "staticRenderFns", function() { return _node_modules_vue_loader_lib_loaders_templateLoader_js_vue_loader_options_node_modules_vue_loader_lib_index_js_vue_loader_options_Feed_vue_vue_type_template_id_40b87386_scoped_true___WEBPACK_IMPORTED_MODULE_0__["staticRenderFns"]; });



/***/ })

}]);

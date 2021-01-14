import _regeneratorRuntime from '@babel/runtime/regenerator';
import _asyncToGenerator from '@babel/runtime/helpers/asyncToGenerator';
import _classCallCheck from '@babel/runtime/helpers/classCallCheck';
import _createClass from '@babel/runtime/helpers/createClass';
import _assertThisInitialized from '@babel/runtime/helpers/assertThisInitialized';
import _inherits from '@babel/runtime/helpers/inherits';
import _possibleConstructorReturn from '@babel/runtime/helpers/possibleConstructorReturn';
import _getPrototypeOf from '@babel/runtime/helpers/getPrototypeOf';
import _defineProperty from '@babel/runtime/helpers/defineProperty';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { readEndpoint } from 'redux-json-api';
import { createSelector } from 'reselect';

var selectApiScope = function selectApiScope(state) {
  return state.api;
};

var selectResourceIds = function selectResourceIds(state, props) {
  return props.resourceIds;
};

var selectResources = createSelector([selectApiScope, selectResourceIds], function (api, resourceIds) {
  return resourceIds.map(function (resourceId) {
    return api[resourceId.type].data.find(function (resource) {
      return resource.id === resourceId.id;
    });
  });
});

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var DataSet = /*#__PURE__*/function (_PureComponent) {
  _inherits(DataSet, _PureComponent);

  var _super = _createSuper(DataSet);

  function DataSet() {
    _classCallCheck(this, DataSet);

    return _super.apply(this, arguments);
  }

  _createClass(DataSet, [{
    key: "render",
    value: function render() {
      var _this$props = this.props,
          children = _this$props.children,
          resources = _this$props.resources;
      return children({
        resources: resources
      });
    }
  }]);

  return DataSet;
}(PureComponent);

var mapStateToProps = function mapStateToProps(state, props) {
  return {
    resources: selectResources(state, props)
  };
};

var DataSet$1 = connect(mapStateToProps)(DataSet);

var QueryCache = /*#__PURE__*/function () {
  function QueryCache() {
    _classCallCheck(this, QueryCache);
  }

  _createClass(QueryCache, null, [{
    key: "cacheEndpoint",
    value: function cacheEndpoint(endpoint, response) {
      QueryCache.cachedEndpoints.set(endpoint, response);
    }
  }, {
    key: "getEndpointCache",
    value: function getEndpointCache(endpoint) {
      if (QueryCache.cachedEndpoints.has(endpoint)) {
        return QueryCache.cachedEndpoints.get(endpoint);
      }

      throw new Error('Endpoint not cached');
    }
  }]);

  return QueryCache;
}();

_defineProperty(QueryCache, "cachedEndpoints", new Map());

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _createSuper$1(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct$1(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _isNativeReflectConstruct$1() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }
var Query = /*#__PURE__*/function (_PureComponent) {
  _inherits(Query, _PureComponent);

  var _super = _createSuper$1(Query);

  function Query() {
    var _this;

    _classCallCheck(this, Query);

    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    _this = _super.call.apply(_super, [this].concat(args));

    _defineProperty(_assertThisInitialized(_this), "state", {
      error: undefined,
      loading: false,
      links: {},
      resourceIds: []
    });

    _defineProperty(_assertThisInitialized(_this), "setResponse", function (_ref) {
      var resourceIds = _ref.resourceIds,
          links = _ref.links;

      _this.setState({
        resourceIds: resourceIds,
        links: links
      });
    });

    _defineProperty(_assertThisInitialized(_this), "createLinksObject", function (links) {
      return Object.keys(links).filter(function (link) {
        return link !== 'self';
      }).reduce(function (carry, link) {
        return Object.assign(_defineProperty({}, link, {
          load: function load() {
            return _this.loadEndpoint(links[link]);
          }
        }), carry);
      }, {});
    });

    _defineProperty(_assertThisInitialized(_this), "loadEndpoint", function (endpoint) {
      var enableCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.enableCache;

      if (!enableCache) {
        _this.fetchData(endpoint, enableCache);

        return;
      }

      try {
        var cachedResponse = QueryCache.getEndpointCache(endpoint); // This condition should never be falsy, because QueryCache throws if no
        // data is stored for given endpoint. But Flow is not able to detect this

        if (cachedResponse) {
          _this.setResponse(cachedResponse);
        }
      } catch (_) {
        _this.fetchData(endpoint, enableCache);
      }
    });

    _defineProperty(_assertThisInitialized(_this), "fetchData", /*#__PURE__*/function () {
      var _ref2 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(endpoint) {
        var enableCache,
            dispatch,
            _yield$dispatch,
            _yield$dispatch$body,
            data,
            links,
            resources,
            resourceIds,
            response,
            cacheEndpoint,
            _args = arguments;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                enableCache = _args.length > 1 && _args[1] !== undefined ? _args[1] : _this.props.enableCache;
                dispatch = _this.props.dispatch;

                _this.setState({
                  loading: true
                });

                _context.prev = 3;
                _context.next = 6;
                return dispatch(readEndpoint(endpoint));

              case 6:
                _yield$dispatch = _context.sent;
                _yield$dispatch$body = _yield$dispatch.body;
                data = _yield$dispatch$body.data;
                links = _yield$dispatch$body.links;
                resources = Array.isArray(data) ? data : [data];
                resourceIds = resources.map(function (_ref3) {
                  var id = _ref3.id,
                      type = _ref3.type;
                  return {
                    id: id,
                    type: type
                  };
                });

                _this.setState({
                  loading: false
                });

                response = {
                  resourceIds: resourceIds,
                  links: links ? _this.createLinksObject(links) : {}
                };

                _this.setResponse(response);

                if (enableCache) {
                  cacheEndpoint = links && links.hasOwnProperty('self') && links.self || endpoint;
                  QueryCache.cacheEndpoint(cacheEndpoint, response);
                }

                _context.next = 21;
                break;

              case 18:
                _context.prev = 18;
                _context.t0 = _context["catch"](3);

                _this.setState({
                  error: _context.t0,
                  loading: false
                });

              case 21:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, null, [[3, 18]]);
      }));

      return function (_x) {
        return _ref2.apply(this, arguments);
      };
    }());

    return _this;
  }

  _createClass(Query, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.loadEndpoint(this.props.endpoint);
    }
  }, {
    key: "render",
    value: function render() {
      var _this2 = this;

      var _this$state = this.state,
          error = _this$state.error,
          loading = _this$state.loading,
          links = _this$state.links,
          resourceIds = _this$state.resourceIds;
      return /*#__PURE__*/React.createElement(DataSet$1, {
        resourceIds: resourceIds
      }, function (_ref4) {
        var resources = _ref4.resources;
        return _this2.props.children(_objectSpread(_objectSpread({}, _this2.actions), {}, {
          error: error,
          loading: loading,
          links: links,
          resources: resources
        }));
      });
    }
  }, {
    key: "actions",
    get: function get() {
      var _this3 = this;

      return {
        refetch: function refetch() {
          _this3.fetchData(_this3.props.endpoint);
        }
      };
    }
  }]);

  return Query;
}(PureComponent);

_defineProperty(Query, "defaultProps", {
  enableCache: false
});

var Query$1 = connect()(Query);

export default Query$1;

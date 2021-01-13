import { createSelector } from 'reselect';
import _Object$getPrototypeOf from 'babel-runtime/core-js/object/get-prototype-of';
import _classCallCheck from 'babel-runtime/helpers/classCallCheck';
import _createClass from 'babel-runtime/helpers/createClass';
import _possibleConstructorReturn from 'babel-runtime/helpers/possibleConstructorReturn';
import _inherits from 'babel-runtime/helpers/inherits';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _Map from 'babel-runtime/core-js/map';
import _extends from 'babel-runtime/helpers/extends';
import _regeneratorRuntime from 'babel-runtime/regenerator';
import _asyncToGenerator from 'babel-runtime/helpers/asyncToGenerator';
import _defineProperty from 'babel-runtime/helpers/defineProperty';
import _Object$assign from 'babel-runtime/core-js/object/assign';
import _Object$keys from 'babel-runtime/core-js/object/keys';
import { readEndpoint } from 'redux-json-api';

/*  strict */


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

var DataSet = function (_PureComponent) {
  _inherits(DataSet, _PureComponent);

  function DataSet() {
    _classCallCheck(this, DataSet);

    return _possibleConstructorReturn(this, (DataSet.__proto__ || _Object$getPrototypeOf(DataSet)).apply(this, arguments));
  }

  _createClass(DataSet, [{
    key: 'render',
    value: function render() {
      var _props = this.props,
          children = _props.children,
          resources = _props.resources;


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

var QueryCache = function () {
  function QueryCache() {
    _classCallCheck(this, QueryCache);
  }

  _createClass(QueryCache, null, [{
    key: 'cacheEndpoint',
    value: function cacheEndpoint(endpoint, response) {
      QueryCache.cachedEndpoints.set(endpoint, response);
    }
  }, {
    key: 'getEndpointCache',
    value: function getEndpointCache(endpoint) {
      if (QueryCache.cachedEndpoints.has(endpoint)) {
        return QueryCache.cachedEndpoints.get(endpoint);
      }

      throw new Error('Endpoint not cached');
    }
  }]);

  return QueryCache;
}(); /*  strict-local */

QueryCache.cachedEndpoints = new _Map();

var Query = function (_PureComponent) {
  _inherits(Query, _PureComponent);

  function Query() {
    var _ref,
        _this2 = this;

    var _temp, _this, _ret;

    _classCallCheck(this, Query);

    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }

    return _ret = (_temp = (_this = _possibleConstructorReturn(this, (_ref = Query.__proto__ || _Object$getPrototypeOf(Query)).call.apply(_ref, [this].concat(args))), _this), _this.state = {
      error: undefined,
      loading: false,
      links: {},
      resourceIds: []
    }, _this.setResponse = function (_ref2) {
      var resourceIds = _ref2.resourceIds,
          links = _ref2.links;

      _this.setState({
        resourceIds: resourceIds,
        links: links
      });
    }, _this.createLinksObject = function (links) {
      return _Object$keys(links).filter(function (link) {
        return link !== 'self';
      }).reduce(function (carry, link) {
        return _Object$assign(_defineProperty({}, link, {
          load: function load() {
            return _this.loadEndpoint(links[link]);
          }
        }), carry);
      }, {});
    }, _this.loadEndpoint = function (endpoint) {
      var enableCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.enableCache;

      if (!enableCache) {
        _this.fetchData(endpoint, enableCache);
        return;
      }

      try {
        var cachedResponse = QueryCache.getEndpointCache(endpoint);
        // This condition should never be falsy, because QueryCache throws if no
        // data is stored for given endpoint. But Flow is not able to detect this
        if (cachedResponse) {
          _this.setResponse(cachedResponse);
        }
      } catch (_) {
        _this.fetchData(endpoint, enableCache);
      }
    }, _this.fetchData = function () {
      var _ref3 = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime.mark(function _callee(endpoint) {
        var enableCache = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : _this.props.enableCache;

        var dispatch, _ref4, _ref4$body, data, _links, _resources, resourceIds, response, cacheEndpoint;

        return _regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                dispatch = _this.props.dispatch;

                _this.setState({ loading: true });
                _context.prev = 2;
                _context.next = 5;
                return dispatch(readEndpoint(endpoint));

              case 5:
                _ref4 = _context.sent;
                _ref4$body = _ref4.body;
                data = _ref4$body.data;
                _links = _ref4$body.links;
                _resources = Array.isArray(data) ? data : [data];
                resourceIds = _resources.map(function (_ref5) {
                  var id = _ref5.id,
                      type = _ref5.type;
                  return { id: id, type: type };
                });


                _this.setState({
                  loading: false
                });

                response = {
                  resourceIds: resourceIds,
                  links: _links ? _this.createLinksObject(_links) : {}
                };


                _this.setResponse(response);

                if (enableCache) {
                  cacheEndpoint = _links && _links.hasOwnProperty('self') && _links.self || endpoint;

                  QueryCache.cacheEndpoint(cacheEndpoint, response);
                }
                _context.next = 20;
                break;

              case 17:
                _context.prev = 17;
                _context.t0 = _context['catch'](2);

                _this.setState({ error: _context.t0, loading: false });

              case 20:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, _this2, [[2, 17]]);
      }));

      return function (_x3) {
        return _ref3.apply(this, arguments);
      };
    }(), _temp), _possibleConstructorReturn(_this, _ret);
  }

  _createClass(Query, [{
    key: 'componentDidMount',
    value: function componentDidMount() {
      this.loadEndpoint(this.props.endpoint);
    }
  }, {
    key: 'render',
    value: function render() {
      var _this3 = this;

      var _state = this.state,
          error = _state.error,
          loading = _state.loading,
          links = _state.links,
          resourceIds = _state.resourceIds;


      return React.createElement(
        DataSet$1,
        { resourceIds: resourceIds },
        function (_ref6) {
          var resources = _ref6.resources;
          return _this3.props.children(_extends({}, _this3.actions, {
            error: error,
            loading: loading,
            links: links,
            resources: resources
          }));
        }
      );
    }
  }, {
    key: 'actions',
    get: function get() {
      var _this4 = this;

      return {
        refetch: function refetch() {
          _this4.fetchData(_this4.props.endpoint);
        }
      };
    }
  }]);

  return Query;
}(PureComponent);

Query.defaultProps = {
  enableCache: false
};
var Query$1 = connect()(Query);

/*  strict-local */

export default Query$1;

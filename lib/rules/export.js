'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _ExportMap = require('../ExportMap');

var _ExportMap2 = _interopRequireDefault(_ExportMap);

var _docsUrl = require('../docsUrl');

var _docsUrl2 = _interopRequireDefault(_docsUrl);

var _arrayIncludes = require('array-includes');

var _arrayIncludes2 = _interopRequireDefault(_arrayIncludes);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

module.exports = {
  meta: {
    type: 'problem',
    docs: {
      url: (0, _docsUrl2.default)('export')
    }
  },

  create: function (context) {
    const named = new Map();

    function addNamed(name, node, type) {
      const key = type ? `${type}:${name}` : name;
      let nodes = named.get(key);

      if (nodes == null) {
        nodes = new Set();
        named.set(key, nodes);
      }

      nodes.add(node);
    }

    return {
      'ExportDefaultDeclaration': node => addNamed('default', node),

      'ExportSpecifier': function (node) {
        addNamed(node.exported.name, node.exported);
      },

      'ExportNamedDeclaration': function (node) {
        if (node.declaration == null) return;

        if (node.declaration.id != null) {
          if ((0, _arrayIncludes2.default)(['TSTypeAliasDeclaration', 'TSInterfaceDeclaration'], node.declaration.type)) {
            addNamed(node.declaration.id.name, node.declaration.id, 'type');
          } else {
            addNamed(node.declaration.id.name, node.declaration.id);
          }
        }

        if (node.declaration.declarations != null) {
          for (let declaration of node.declaration.declarations) {
            (0, _ExportMap.recursivePatternCapture)(declaration.id, v => addNamed(v.name, v));
          }
        }
      },

      'ExportAllDeclaration': function (node) {
        if (node.source == null) return; // not sure if this is ever true

        const remoteExports = _ExportMap2.default.get(node.source.value, context);
        if (remoteExports == null) return;

        if (remoteExports.errors.length) {
          remoteExports.reportErrors(context, node);
          return;
        }
        let any = false;
        remoteExports.forEach((v, name) => name !== 'default' && (any = true) && // poor man's filter
        addNamed(name, node));

        if (!any) {
          context.report(node.source, `No named exports found in module '${node.source.value}'.`);
        }
      },

      'Program:exit': function () {
        for (let _ref of named) {
          var _ref2 = _slicedToArray(_ref, 2);

          let name = _ref2[0];
          let nodes = _ref2[1];

          if (nodes.size <= 1) continue;

          for (let node of nodes) {
            if (name === 'default') {
              context.report(node, 'Multiple default exports.');
            } else context.report(node, `Multiple exports of name '${name}'.`);
          }
        }
      }
    };
  }
};
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInJ1bGVzL2V4cG9ydC5qcyJdLCJuYW1lcyI6WyJtb2R1bGUiLCJleHBvcnRzIiwibWV0YSIsInR5cGUiLCJkb2NzIiwidXJsIiwiY3JlYXRlIiwiY29udGV4dCIsIm5hbWVkIiwiTWFwIiwiYWRkTmFtZWQiLCJuYW1lIiwibm9kZSIsImtleSIsIm5vZGVzIiwiZ2V0IiwiU2V0Iiwic2V0IiwiYWRkIiwiZXhwb3J0ZWQiLCJkZWNsYXJhdGlvbiIsImlkIiwiZGVjbGFyYXRpb25zIiwidiIsInNvdXJjZSIsInJlbW90ZUV4cG9ydHMiLCJFeHBvcnRNYXAiLCJ2YWx1ZSIsImVycm9ycyIsImxlbmd0aCIsInJlcG9ydEVycm9ycyIsImFueSIsImZvckVhY2giLCJyZXBvcnQiLCJzaXplIl0sIm1hcHBpbmdzIjoiOzs7O0FBQUE7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFFQUEsT0FBT0MsT0FBUCxHQUFpQjtBQUNmQyxRQUFNO0FBQ0pDLFVBQU0sU0FERjtBQUVKQyxVQUFNO0FBQ0pDLFdBQUssdUJBQVEsUUFBUjtBQUREO0FBRkYsR0FEUzs7QUFRZkMsVUFBUSxVQUFVQyxPQUFWLEVBQW1CO0FBQ3pCLFVBQU1DLFFBQVEsSUFBSUMsR0FBSixFQUFkOztBQUVBLGFBQVNDLFFBQVQsQ0FBa0JDLElBQWxCLEVBQXdCQyxJQUF4QixFQUE4QlQsSUFBOUIsRUFBb0M7QUFDbEMsWUFBTVUsTUFBTVYsT0FBUSxHQUFFQSxJQUFLLElBQUdRLElBQUssRUFBdkIsR0FBMkJBLElBQXZDO0FBQ0EsVUFBSUcsUUFBUU4sTUFBTU8sR0FBTixDQUFVRixHQUFWLENBQVo7O0FBRUEsVUFBSUMsU0FBUyxJQUFiLEVBQW1CO0FBQ2pCQSxnQkFBUSxJQUFJRSxHQUFKLEVBQVI7QUFDQVIsY0FBTVMsR0FBTixDQUFVSixHQUFWLEVBQWVDLEtBQWY7QUFDRDs7QUFFREEsWUFBTUksR0FBTixDQUFVTixJQUFWO0FBQ0Q7O0FBRUQsV0FBTztBQUNMLGtDQUE2QkEsSUFBRCxJQUFVRixTQUFTLFNBQVQsRUFBb0JFLElBQXBCLENBRGpDOztBQUdMLHlCQUFtQixVQUFVQSxJQUFWLEVBQWdCO0FBQ2pDRixpQkFBU0UsS0FBS08sUUFBTCxDQUFjUixJQUF2QixFQUE2QkMsS0FBS08sUUFBbEM7QUFDRCxPQUxJOztBQU9MLGdDQUEwQixVQUFVUCxJQUFWLEVBQWdCO0FBQ3hDLFlBQUlBLEtBQUtRLFdBQUwsSUFBb0IsSUFBeEIsRUFBOEI7O0FBRTlCLFlBQUlSLEtBQUtRLFdBQUwsQ0FBaUJDLEVBQWpCLElBQXVCLElBQTNCLEVBQWlDO0FBQy9CLGNBQUksNkJBQVMsQ0FDWCx3QkFEVyxFQUVYLHdCQUZXLENBQVQsRUFHRFQsS0FBS1EsV0FBTCxDQUFpQmpCLElBSGhCLENBQUosRUFHMkI7QUFDekJPLHFCQUFTRSxLQUFLUSxXQUFMLENBQWlCQyxFQUFqQixDQUFvQlYsSUFBN0IsRUFBbUNDLEtBQUtRLFdBQUwsQ0FBaUJDLEVBQXBELEVBQXdELE1BQXhEO0FBQ0QsV0FMRCxNQUtPO0FBQ0xYLHFCQUFTRSxLQUFLUSxXQUFMLENBQWlCQyxFQUFqQixDQUFvQlYsSUFBN0IsRUFBbUNDLEtBQUtRLFdBQUwsQ0FBaUJDLEVBQXBEO0FBQ0Q7QUFDRjs7QUFFRCxZQUFJVCxLQUFLUSxXQUFMLENBQWlCRSxZQUFqQixJQUFpQyxJQUFyQyxFQUEyQztBQUN6QyxlQUFLLElBQUlGLFdBQVQsSUFBd0JSLEtBQUtRLFdBQUwsQ0FBaUJFLFlBQXpDLEVBQXVEO0FBQ3JELG9EQUF3QkYsWUFBWUMsRUFBcEMsRUFBd0NFLEtBQUtiLFNBQVNhLEVBQUVaLElBQVgsRUFBaUJZLENBQWpCLENBQTdDO0FBQ0Q7QUFDRjtBQUNGLE9BMUJJOztBQTRCTCw4QkFBd0IsVUFBVVgsSUFBVixFQUFnQjtBQUN0QyxZQUFJQSxLQUFLWSxNQUFMLElBQWUsSUFBbkIsRUFBeUIsT0FEYSxDQUNOOztBQUVoQyxjQUFNQyxnQkFBZ0JDLG9CQUFVWCxHQUFWLENBQWNILEtBQUtZLE1BQUwsQ0FBWUcsS0FBMUIsRUFBaUNwQixPQUFqQyxDQUF0QjtBQUNBLFlBQUlrQixpQkFBaUIsSUFBckIsRUFBMkI7O0FBRTNCLFlBQUlBLGNBQWNHLE1BQWQsQ0FBcUJDLE1BQXpCLEVBQWlDO0FBQy9CSix3QkFBY0ssWUFBZCxDQUEyQnZCLE9BQTNCLEVBQW9DSyxJQUFwQztBQUNBO0FBQ0Q7QUFDRCxZQUFJbUIsTUFBTSxLQUFWO0FBQ0FOLHNCQUFjTyxPQUFkLENBQXNCLENBQUNULENBQUQsRUFBSVosSUFBSixLQUNwQkEsU0FBUyxTQUFULEtBQ0NvQixNQUFNLElBRFAsS0FDZ0I7QUFDaEJyQixpQkFBU0MsSUFBVCxFQUFlQyxJQUFmLENBSEY7O0FBS0EsWUFBSSxDQUFDbUIsR0FBTCxFQUFVO0FBQ1J4QixrQkFBUTBCLE1BQVIsQ0FBZXJCLEtBQUtZLE1BQXBCLEVBQ0cscUNBQW9DWixLQUFLWSxNQUFMLENBQVlHLEtBQU0sSUFEekQ7QUFFRDtBQUNGLE9BaERJOztBQWtETCxzQkFBZ0IsWUFBWTtBQUMxQix5QkFBMEJuQixLQUExQixFQUFpQztBQUFBOztBQUFBLGNBQXZCRyxJQUF1QjtBQUFBLGNBQWpCRyxLQUFpQjs7QUFDL0IsY0FBSUEsTUFBTW9CLElBQU4sSUFBYyxDQUFsQixFQUFxQjs7QUFFckIsZUFBSyxJQUFJdEIsSUFBVCxJQUFpQkUsS0FBakIsRUFBd0I7QUFDdEIsZ0JBQUlILFNBQVMsU0FBYixFQUF3QjtBQUN0Qkosc0JBQVEwQixNQUFSLENBQWVyQixJQUFmLEVBQXFCLDJCQUFyQjtBQUNELGFBRkQsTUFFT0wsUUFBUTBCLE1BQVIsQ0FBZXJCLElBQWYsRUFBc0IsNkJBQTRCRCxJQUFLLElBQXZEO0FBQ1I7QUFDRjtBQUNGO0FBNURJLEtBQVA7QUE4REQ7QUFyRmMsQ0FBakIiLCJmaWxlIjoicnVsZXMvZXhwb3J0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEV4cG9ydE1hcCwgeyByZWN1cnNpdmVQYXR0ZXJuQ2FwdHVyZSB9IGZyb20gJy4uL0V4cG9ydE1hcCdcbmltcG9ydCBkb2NzVXJsIGZyb20gJy4uL2RvY3NVcmwnXG5pbXBvcnQgaW5jbHVkZXMgZnJvbSAnYXJyYXktaW5jbHVkZXMnXG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBtZXRhOiB7XG4gICAgdHlwZTogJ3Byb2JsZW0nLFxuICAgIGRvY3M6IHtcbiAgICAgIHVybDogZG9jc1VybCgnZXhwb3J0JyksXG4gICAgfSxcbiAgfSxcblxuICBjcmVhdGU6IGZ1bmN0aW9uIChjb250ZXh0KSB7XG4gICAgY29uc3QgbmFtZWQgPSBuZXcgTWFwKClcblxuICAgIGZ1bmN0aW9uIGFkZE5hbWVkKG5hbWUsIG5vZGUsIHR5cGUpIHtcbiAgICAgIGNvbnN0IGtleSA9IHR5cGUgPyBgJHt0eXBlfToke25hbWV9YCA6IG5hbWVcbiAgICAgIGxldCBub2RlcyA9IG5hbWVkLmdldChrZXkpXG5cbiAgICAgIGlmIChub2RlcyA9PSBudWxsKSB7XG4gICAgICAgIG5vZGVzID0gbmV3IFNldCgpXG4gICAgICAgIG5hbWVkLnNldChrZXksIG5vZGVzKVxuICAgICAgfVxuXG4gICAgICBub2Rlcy5hZGQobm9kZSlcbiAgICB9XG5cbiAgICByZXR1cm4ge1xuICAgICAgJ0V4cG9ydERlZmF1bHREZWNsYXJhdGlvbic6IChub2RlKSA9PiBhZGROYW1lZCgnZGVmYXVsdCcsIG5vZGUpLFxuXG4gICAgICAnRXhwb3J0U3BlY2lmaWVyJzogZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgYWRkTmFtZWQobm9kZS5leHBvcnRlZC5uYW1lLCBub2RlLmV4cG9ydGVkKVxuICAgICAgfSxcblxuICAgICAgJ0V4cG9ydE5hbWVkRGVjbGFyYXRpb24nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbiA9PSBudWxsKSByZXR1cm5cblxuICAgICAgICBpZiAobm9kZS5kZWNsYXJhdGlvbi5pZCAhPSBudWxsKSB7XG4gICAgICAgICAgaWYgKGluY2x1ZGVzKFtcbiAgICAgICAgICAgICdUU1R5cGVBbGlhc0RlY2xhcmF0aW9uJyxcbiAgICAgICAgICAgICdUU0ludGVyZmFjZURlY2xhcmF0aW9uJyxcbiAgICAgICAgICBdLCBub2RlLmRlY2xhcmF0aW9uLnR5cGUpKSB7XG4gICAgICAgICAgICBhZGROYW1lZChub2RlLmRlY2xhcmF0aW9uLmlkLm5hbWUsIG5vZGUuZGVjbGFyYXRpb24uaWQsICd0eXBlJylcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgYWRkTmFtZWQobm9kZS5kZWNsYXJhdGlvbi5pZC5uYW1lLCBub2RlLmRlY2xhcmF0aW9uLmlkKVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChub2RlLmRlY2xhcmF0aW9uLmRlY2xhcmF0aW9ucyAhPSBudWxsKSB7XG4gICAgICAgICAgZm9yIChsZXQgZGVjbGFyYXRpb24gb2Ygbm9kZS5kZWNsYXJhdGlvbi5kZWNsYXJhdGlvbnMpIHtcbiAgICAgICAgICAgIHJlY3Vyc2l2ZVBhdHRlcm5DYXB0dXJlKGRlY2xhcmF0aW9uLmlkLCB2ID0+IGFkZE5hbWVkKHYubmFtZSwgdikpXG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9LFxuXG4gICAgICAnRXhwb3J0QWxsRGVjbGFyYXRpb24nOiBmdW5jdGlvbiAobm9kZSkge1xuICAgICAgICBpZiAobm9kZS5zb3VyY2UgPT0gbnVsbCkgcmV0dXJuIC8vIG5vdCBzdXJlIGlmIHRoaXMgaXMgZXZlciB0cnVlXG5cbiAgICAgICAgY29uc3QgcmVtb3RlRXhwb3J0cyA9IEV4cG9ydE1hcC5nZXQobm9kZS5zb3VyY2UudmFsdWUsIGNvbnRleHQpXG4gICAgICAgIGlmIChyZW1vdGVFeHBvcnRzID09IG51bGwpIHJldHVyblxuXG4gICAgICAgIGlmIChyZW1vdGVFeHBvcnRzLmVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICByZW1vdGVFeHBvcnRzLnJlcG9ydEVycm9ycyhjb250ZXh0LCBub2RlKVxuICAgICAgICAgIHJldHVyblxuICAgICAgICB9XG4gICAgICAgIGxldCBhbnkgPSBmYWxzZVxuICAgICAgICByZW1vdGVFeHBvcnRzLmZvckVhY2goKHYsIG5hbWUpID0+XG4gICAgICAgICAgbmFtZSAhPT0gJ2RlZmF1bHQnICYmXG4gICAgICAgICAgKGFueSA9IHRydWUpICYmIC8vIHBvb3IgbWFuJ3MgZmlsdGVyXG4gICAgICAgICAgYWRkTmFtZWQobmFtZSwgbm9kZSkpXG5cbiAgICAgICAgaWYgKCFhbnkpIHtcbiAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLnNvdXJjZSxcbiAgICAgICAgICAgIGBObyBuYW1lZCBleHBvcnRzIGZvdW5kIGluIG1vZHVsZSAnJHtub2RlLnNvdXJjZS52YWx1ZX0nLmApXG4gICAgICAgIH1cbiAgICAgIH0sXG5cbiAgICAgICdQcm9ncmFtOmV4aXQnOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIGZvciAobGV0IFtuYW1lLCBub2Rlc10gb2YgbmFtZWQpIHtcbiAgICAgICAgICBpZiAobm9kZXMuc2l6ZSA8PSAxKSBjb250aW51ZVxuXG4gICAgICAgICAgZm9yIChsZXQgbm9kZSBvZiBub2Rlcykge1xuICAgICAgICAgICAgaWYgKG5hbWUgPT09ICdkZWZhdWx0Jykge1xuICAgICAgICAgICAgICBjb250ZXh0LnJlcG9ydChub2RlLCAnTXVsdGlwbGUgZGVmYXVsdCBleHBvcnRzLicpXG4gICAgICAgICAgICB9IGVsc2UgY29udGV4dC5yZXBvcnQobm9kZSwgYE11bHRpcGxlIGV4cG9ydHMgb2YgbmFtZSAnJHtuYW1lfScuYClcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0sXG4gICAgfVxuICB9LFxufVxuIl19
webpackJsonp([0],[
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	// user require with a reference to bundle the file and use it in this file
	// var example = require('./example');

	// load manifests
	// scripts

	__webpack_require__(1);

	// styles
	__webpack_require__(34);

	// attach jQuery globally
	__webpack_require__(44);
	__webpack_require__(45);

	// attach getFormFields globally

	__webpack_require__(46);

	// attach Paper.js globally
	__webpack_require__(47);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var paper = __webpack_require__(3);
	var paperEvents = __webpack_require__(6);
	var authEvents = __webpack_require__(31);

	$(function () {
	  paper.install(window);
	  paperEvents.addHandlers();
	  authEvents.addHandlers();
	});
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 2 */,
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function($) {/*!
	 * Paper.js v0.10.2 - The Swiss Army Knife of Vector Graphics Scripting.
	 * http://paperjs.org/
	 *
	 * Copyright (c) 2011 - 2016, Juerg Lehni & Jonathan Puckey
	 * http://scratchdisk.com/ & http://jonathanpuckey.com/
	 *
	 * Distributed under the MIT license. See LICENSE file for details.
	 *
	 * All rights reserved.
	 *
	 * Date: Sat Jul 9 20:14:37 2016 +0200
	 *
	 ***
	 *
	 * Straps.js - Class inheritance library with support for bean-style accessors
	 *
	 * Copyright (c) 2006 - 2016 Juerg Lehni
	 * http://scratchdisk.com/
	 *
	 * Distributed under the MIT license.
	 *
	 ***
	 *
	 * Acorn.js
	 * http://marijnhaverbeke.nl/acorn/
	 *
	 * Acorn is a tiny, fast JavaScript parser written in JavaScript,
	 * created by Marijn Haverbeke and released under an MIT license.
	 *
	 */

	var paper = function(self, undefined) {

	var window = self ? self.window : __webpack_require__(4),
		document = window && window.document;

	self = self || window;

	var Base = new function() {
		var hidden = /^(statics|enumerable|beans|preserve)$/,

			forEach = [].forEach || function(iter, bind) {
				for (var i = 0, l = this.length; i < l; i++)
					iter.call(bind, this[i], i, this);
			},

			forIn = function(iter, bind) {
				for (var i in this)
					if (this.hasOwnProperty(i))
						iter.call(bind, this[i], i, this);
			},

			create = Object.create || function(proto) {
				return { __proto__: proto };
			},

			describe = Object.getOwnPropertyDescriptor || function(obj, name) {
				var get = obj.__lookupGetter__ && obj.__lookupGetter__(name);
				return get
						? { get: get, set: obj.__lookupSetter__(name),
							enumerable: true, configurable: true }
						: obj.hasOwnProperty(name)
							? { value: obj[name], enumerable: true,
								configurable: true, writable: true }
							: null;
			},

			_define = Object.defineProperty || function(obj, name, desc) {
				if ((desc.get || desc.set) && obj.__defineGetter__) {
					if (desc.get)
						obj.__defineGetter__(name, desc.get);
					if (desc.set)
						obj.__defineSetter__(name, desc.set);
				} else {
					obj[name] = desc.value;
				}
				return obj;
			},

			define = function(obj, name, desc) {
				delete obj[name];
				return _define(obj, name, desc);
			};

		function inject(dest, src, enumerable, beans, preserve) {
			var beansNames = {};

			function field(name, val) {
				val = val || (val = describe(src, name))
						&& (val.get ? val : val.value);
				if (typeof val === 'string' && val[0] === '#')
					val = dest[val.substring(1)] || val;
				var isFunc = typeof val === 'function',
					res = val,
					prev = preserve || isFunc && !val.base
							? (val && val.get ? name in dest : dest[name])
							: null,
					bean;
				if (!preserve || !prev) {
					if (isFunc && prev)
						val.base = prev;
					if (isFunc && beans !== false
							&& (bean = name.match(/^([gs]et|is)(([A-Z])(.*))$/)))
						beansNames[bean[3].toLowerCase() + bean[4]] = bean[2];
					if (!res || isFunc || !res.get || typeof res.get !== 'function'
							|| !Base.isPlainObject(res))
						res = { value: res, writable: true };
					if ((describe(dest, name)
							|| { configurable: true }).configurable) {
						res.configurable = true;
						res.enumerable = enumerable;
					}
					define(dest, name, res);
				}
			}
			if (src) {
				for (var name in src) {
					if (src.hasOwnProperty(name) && !hidden.test(name))
						field(name);
				}
				for (var name in beansNames) {
					var part = beansNames[name],
						set = dest['set' + part],
						get = dest['get' + part] || set && dest['is' + part];
					if (get && (beans === true || get.length === 0))
						field(name, { get: get, set: set });
				}
			}
			return dest;
		}

		function each(obj, iter, bind) {
			if (obj)
				('length' in obj && !obj.getLength
						&& typeof obj.length === 'number'
					? forEach
					: forIn).call(obj, iter, bind = bind || obj);
			return bind;
		}

		function set(obj, args, start) {
			for (var i = start, l = args.length; i < l; i++) {
				var props = args[i];
				for (var key in props)
					if (props.hasOwnProperty(key))
						obj[key] = props[key];
			}
			return obj;
		}

		return inject(function Base() {
			set(this, arguments, 0);
		}, {
			inject: function(src) {
				if (src) {
					var statics = src.statics === true ? src : src.statics,
						beans = src.beans,
						preserve = src.preserve;
					if (statics !== src)
						inject(this.prototype, src, src.enumerable, beans, preserve);
					inject(this, statics, true, beans, preserve);
				}
				for (var i = 1, l = arguments.length; i < l; i++)
					this.inject(arguments[i]);
				return this;
			},

			extend: function() {
				var base = this,
					ctor,
					proto;
				for (var i = 0, obj, l = arguments.length;
						i < l && !(ctor && proto); i++) {
					obj = arguments[i];
					ctor = ctor || obj.initialize;
					proto = proto || obj.prototype;
				}
				ctor = ctor || function() {
					base.apply(this, arguments);
				};
				proto = ctor.prototype = proto || create(this.prototype);
				define(proto, 'constructor',
						{ value: ctor, writable: true, configurable: true });
				inject(ctor, this, true);
				if (arguments.length)
					this.inject.apply(ctor, arguments);
				ctor.base = base;
				return ctor;
			}
		}, true).inject({
			inject: function() {
				for (var i = 0, l = arguments.length; i < l; i++) {
					var src = arguments[i];
					if (src)
						inject(this, src, src.enumerable, src.beans, src.preserve);
				}
				return this;
			},

			extend: function() {
				var res = create(this);
				return res.inject.apply(res, arguments);
			},

			each: function(iter, bind) {
				return each(this, iter, bind);
			},

			set: function() {
				return set(this, arguments, 0);
			},

			clone: function() {
				return new this.constructor(this);
			},

			statics: {
				each: each,
				create: create,
				define: define,
				describe: describe,

				set: function(obj) {
					return set(obj, arguments, 1);
				},

				clone: function(obj) {
					return set(new obj.constructor(), arguments, 0);
				},

				isPlainObject: function(obj) {
					var ctor = obj != null && obj.constructor;
					return ctor && (ctor === Object || ctor === Base
							|| ctor.name === 'Object');
				},

				pick: function(a, b) {
					return a !== undefined ? a : b;
				}
			}
		});
	};

	if (true)
		module.exports = Base;

	Base.inject({
		toString: function() {
			return this._id != null
				?  (this._class || 'Object') + (this._name
					? " '" + this._name + "'"
					: ' @' + this._id)
				: '{ ' + Base.each(this, function(value, key) {
					if (!/^_/.test(key)) {
						var type = typeof value;
						this.push(key + ': ' + (type === 'number'
								? Formatter.instance.number(value)
								: type === 'string' ? "'" + value + "'" : value));
					}
				}, []).join(', ') + ' }';
		},

		getClassName: function() {
			return this._class || '';
		},

		importJSON: function(json) {
			return Base.importJSON(json, this);
		},

		exportJSON: function(options) {
			return Base.exportJSON(this, options);
		},

		toJSON: function() {
			return Base.serialize(this);
		},

		_set: function(props) {
			if (props && Base.isPlainObject(props))
				return Base.filter(this, props);
		},

		statics: {

			exports: {
				enumerable: true
			},

			extend: function extend() {
				var res = extend.base.apply(this, arguments),
					name = res.prototype._class;
				if (name && !Base.exports[name])
					Base.exports[name] = res;
				return res;
			},

			equals: function(obj1, obj2) {
				if (obj1 === obj2)
					return true;
				if (obj1 && obj1.equals)
					return obj1.equals(obj2);
				if (obj2 && obj2.equals)
					return obj2.equals(obj1);
				if (obj1 && obj2
						&& typeof obj1 === 'object' && typeof obj2 === 'object') {
					if (Array.isArray(obj1) && Array.isArray(obj2)) {
						var length = obj1.length;
						if (length !== obj2.length)
							return false;
						while (length--) {
							if (!Base.equals(obj1[length], obj2[length]))
								return false;
						}
					} else {
						var keys = Object.keys(obj1),
							length = keys.length;
						if (length !== Object.keys(obj2).length)
							return false;
						while (length--) {
							var key = keys[length];
							if (!(obj2.hasOwnProperty(key)
									&& Base.equals(obj1[key], obj2[key])))
								return false;
						}
					}
					return true;
				}
				return false;
			},

			read: function(list, start, options, length) {
				if (this === Base) {
					var value = this.peek(list, start);
					list.__index++;
					return value;
				}
				var proto = this.prototype,
					readIndex = proto._readIndex,
					index = start || readIndex && list.__index || 0;
				if (!length)
					length = list.length - index;
				var obj = list[index];
				if (obj instanceof this
					|| options && options.readNull && obj == null && length <= 1) {
					if (readIndex)
						list.__index = index + 1;
					return obj && options && options.clone ? obj.clone() : obj;
				}
				obj = Base.create(this.prototype);
				if (readIndex)
					obj.__read = true;
				obj = obj.initialize.apply(obj, index > 0 || length < list.length
					? Array.prototype.slice.call(list, index, index + length)
					: list) || obj;
				if (readIndex) {
					list.__index = index + obj.__read;
					obj.__read = undefined;
				}
				return obj;
			},

			peek: function(list, start) {
				return list[list.__index = start || list.__index || 0];
			},

			remain: function(list) {
				return list.length - (list.__index || 0);
			},

			readAll: function(list, start, options) {
				var res = [],
					entry;
				for (var i = start || 0, l = list.length; i < l; i++) {
					res.push(Array.isArray(entry = list[i])
							? this.read(entry, 0, options)
							: this.read(list, i, options, 1));
				}
				return res;
			},

			readNamed: function(list, name, start, options, length) {
				var value = this.getNamed(list, name),
					hasObject = value !== undefined;
				if (hasObject) {
					var filtered = list._filtered;
					if (!filtered) {
						filtered = list._filtered = Base.create(list[0]);
						filtered._filtering = list[0];
					}
					filtered[name] = undefined;
				}
				return this.read(hasObject ? [value] : list, start, options, length);
			},

			getNamed: function(list, name) {
				var arg = list[0];
				if (list._hasObject === undefined)
					list._hasObject = list.length === 1 && Base.isPlainObject(arg);
				if (list._hasObject)
					return name ? arg[name] : list._filtered || arg;
			},

			hasNamed: function(list, name) {
				return !!this.getNamed(list, name);
			},

			filter: function(dest, source, exclude) {
				var keys = Object.keys(source._filtering || source);
				for (var i = 0, l = keys.length; i < l; i++) {
					var key = keys[i];
					if (!(exclude && exclude[key])) {
						var value = source[key];
						if (value !== undefined)
							dest[key] = value;
					}
				}
				return dest;
			},

			isPlainValue: function(obj, asString) {
				return this.isPlainObject(obj) || Array.isArray(obj)
						|| asString && typeof obj === 'string';
			},

			serialize: function(obj, options, compact, dictionary) {
				options = options || {};

				var isRoot = !dictionary,
					res;
				if (isRoot) {
					options.formatter = new Formatter(options.precision);
					dictionary = {
						length: 0,
						definitions: {},
						references: {},
						add: function(item, create) {
							var id = '#' + item._id,
								ref = this.references[id];
							if (!ref) {
								this.length++;
								var res = create.call(item),
									name = item._class;
								if (name && res[0] !== name)
									res.unshift(name);
								this.definitions[id] = res;
								ref = this.references[id] = [id];
							}
							return ref;
						}
					};
				}
				if (obj && obj._serialize) {
					res = obj._serialize(options, dictionary);
					var name = obj._class;
					if (name && !obj._compactSerialize && (isRoot || !compact)
							&& res[0] !== name) {
						res.unshift(name);
					}
				} else if (Array.isArray(obj)) {
					res = [];
					for (var i = 0, l = obj.length; i < l; i++)
						res[i] = Base.serialize(obj[i], options, compact,
								dictionary);
				} else if (Base.isPlainObject(obj)) {
					res = {};
					var keys = Object.keys(obj);
					for (var i = 0, l = keys.length; i < l; i++) {
						var key = keys[i];
						res[key] = Base.serialize(obj[key], options, compact,
								dictionary);
					}
				} else if (typeof obj === 'number') {
					res = options.formatter.number(obj, options.precision);
				} else {
					res = obj;
				}
				return isRoot && dictionary.length > 0
						? [['dictionary', dictionary.definitions], res]
						: res;
			},

			deserialize: function(json, create, _data, _setDictionary, _isRoot) {
				var res = json,
					isFirst = !_data,
					hasDictionary = isFirst && json && json.length
						&& json[0][0] === 'dictionary';
				_data = _data || {};
				if (Array.isArray(json)) {
					var type = json[0],
						isDictionary = type === 'dictionary';
					if (json.length == 1 && /^#/.test(type)) {
						return _data.dictionary[type];
					}
					type = Base.exports[type];
					res = [];
					for (var i = type ? 1 : 0, l = json.length; i < l; i++) {
						res.push(Base.deserialize(json[i], create, _data,
								isDictionary, hasDictionary));
					}
					if (type) {
						var args = res;
						if (create) {
							res = create(type, args, isFirst || _isRoot);
						} else {
							res = Base.create(type.prototype);
							type.apply(res, args);
						}
					}
				} else if (Base.isPlainObject(json)) {
					res = {};
					if (_setDictionary)
						_data.dictionary = res;
					for (var key in json)
						res[key] = Base.deserialize(json[key], create, _data);
				}
				return hasDictionary ? res[1] : res;
			},

			exportJSON: function(obj, options) {
				var json = Base.serialize(obj, options);
				return options && options.asString === false
						? json
						: JSON.stringify(json);
			},

			importJSON: function(json, target) {
				return Base.deserialize(
						typeof json === 'string' ? JSON.parse(json) : json,
						function(ctor, args, isRoot) {
							var useTarget = isRoot && target
									&& target.constructor === ctor,
								obj = useTarget ? target
									: Base.create(ctor.prototype);
							if (args.length === 1 && obj instanceof Item
									&& (useTarget || !(obj instanceof Layer))) {
								var arg = args[0];
								if (Base.isPlainObject(arg))
									arg.insert = false;
							}
							(useTarget ? obj._set : ctor).apply(obj, args);
							if (useTarget)
								target = null;
							return obj;
						});
			},

			splice: function(list, items, index, remove) {
				var amount = items && items.length,
					append = index === undefined;
				index = append ? list.length : index;
				if (index > list.length)
					index = list.length;
				for (var i = 0; i < amount; i++)
					items[i]._index = index + i;
				if (append) {
					list.push.apply(list, items);
					return [];
				} else {
					var args = [index, remove];
					if (items)
						args.push.apply(args, items);
					var removed = list.splice.apply(list, args);
					for (var i = 0, l = removed.length; i < l; i++)
						removed[i]._index = undefined;
					for (var i = index + amount, l = list.length; i < l; i++)
						list[i]._index = i;
					return removed;
				}
			},

			capitalize: function(str) {
				return str.replace(/\b[a-z]/g, function(match) {
					return match.toUpperCase();
				});
			},

			camelize: function(str) {
				return str.replace(/-(.)/g, function(all, chr) {
					return chr.toUpperCase();
				});
			},

			hyphenate: function(str) {
				return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
			}
		}
	});

	var Emitter = {
		on: function(type, func) {
			if (typeof type !== 'string') {
				Base.each(type, function(value, key) {
					this.on(key, value);
				}, this);
			} else {
				var types = this._eventTypes,
					entry = types && types[type],
					handlers = this._callbacks = this._callbacks || {};
				handlers = handlers[type] = handlers[type] || [];
				if (handlers.indexOf(func) === -1) {
					handlers.push(func);
					if (entry && entry.install && handlers.length === 1)
						entry.install.call(this, type);
				}
			}
			return this;
		},

		off: function(type, func) {
			if (typeof type !== 'string') {
				Base.each(type, function(value, key) {
					this.off(key, value);
				}, this);
				return;
			}
			var types = this._eventTypes,
				entry = types && types[type],
				handlers = this._callbacks && this._callbacks[type],
				index;
			if (handlers) {
				if (!func || (index = handlers.indexOf(func)) !== -1
						&& handlers.length === 1) {
					if (entry && entry.uninstall)
						entry.uninstall.call(this, type);
					delete this._callbacks[type];
				} else if (index !== -1) {
					handlers.splice(index, 1);
				}
			}
			return this;
		},

		once: function(type, func) {
			return this.on(type, function() {
				func.apply(this, arguments);
				this.off(type, func);
			});
		},

		emit: function(type, event) {
			var handlers = this._callbacks && this._callbacks[type];
			if (!handlers)
				return false;
			var args = [].slice.call(arguments, 1),
				setTarget = event && event.target && !event.currentTarget;
			handlers = handlers.slice();
			if (setTarget)
				event.currentTarget = this;
			for (var i = 0, l = handlers.length; i < l; i++) {
				if (handlers[i].apply(this, args) === false) {
					if (event && event.stop)
						event.stop();
					break;
			   }
			}
			if (setTarget)
				delete event.currentTarget;
			return true;
		},

		responds: function(type) {
			return !!(this._callbacks && this._callbacks[type]);
		},

		attach: '#on',
		detach: '#off',
		fire: '#emit',

		_installEvents: function(install) {
			var types = this._eventTypes,
				handlers = this._callbacks,
				key = install ? 'install' : 'uninstall';
			if (types) {
				for (var type in handlers) {
					if (handlers[type].length > 0) {
						var entry = types[type],
							func = entry && entry[key];
						if (func)
							func.call(this, type);
					}
			}
			}
		},

		statics: {
			inject: function inject(src) {
				var events = src._events;
				if (events) {
					var types = {};
					Base.each(events, function(entry, key) {
						var isString = typeof entry === 'string',
							name = isString ? entry : key,
							part = Base.capitalize(name),
							type = name.substring(2).toLowerCase();
						types[type] = isString ? {} : entry;
						name = '_' + name;
						src['get' + part] = function() {
							return this[name];
						};
						src['set' + part] = function(func) {
							var prev = this[name];
							if (prev)
								this.off(type, prev);
							if (func)
								this.on(type, func);
							this[name] = func;
						};
					});
					src._eventTypes = types;
				}
				return inject.base.apply(this, arguments);
			}
		}
	};

	var PaperScope = Base.extend({
		_class: 'PaperScope',

		initialize: function PaperScope() {
			paper = this;
			this.settings = new Base({
				applyMatrix: true,
				insertItems: true,
				handleSize: 4,
				hitTolerance: 0
			});
			this.project = null;
			this.projects = [];
			this.tools = [];
			this.palettes = [];
			this._id = PaperScope._id++;
			PaperScope._scopes[this._id] = this;
			var proto = PaperScope.prototype;
			if (!this.support) {
				var ctx = CanvasProvider.getContext(1, 1) || {};
				proto.support = {
					nativeDash: 'setLineDash' in ctx || 'mozDash' in ctx,
					nativeBlendModes: BlendMode.nativeModes
				};
				CanvasProvider.release(ctx);
			}
			if (!this.agent) {
				var user = self.navigator.userAgent.toLowerCase(),
					os = (/(darwin|win|mac|linux|freebsd|sunos)/.exec(user)||[])[0],
					platform = os === 'darwin' ? 'mac' : os,
					agent = proto.agent = proto.browser = { platform: platform };
				if (platform)
					agent[platform] = true;
				user.replace(
					/(opera|chrome|safari|webkit|firefox|msie|trident|atom|node)\/?\s*([.\d]+)(?:.*version\/([.\d]+))?(?:.*rv\:v?([.\d]+))?/g,
					function(all, n, v1, v2, rv) {
						if (!agent.chrome) {
							var v = n === 'opera' ? v2 :
									/^(node|trident)$/.test(n) ? rv : v1;
							agent.version = v;
							agent.versionNumber = parseFloat(v);
							n = n === 'trident' ? 'msie' : n;
							agent.name = n;
							agent[n] = true;
						}
					}
				);
				if (agent.chrome)
					delete agent.webkit;
				if (agent.atom)
					delete agent.chrome;
			}
		},

		version: "0.10.2",

		getView: function() {
			var project = this.project;
			return project && project._view;
		},

		getPaper: function() {
			return this;
		},

		execute: function(code, options) {
			paper.PaperScript.execute(code, this, options);
			View.updateFocus();
		},

		install: function(scope) {
			var that = this;
			Base.each(['project', 'view', 'tool'], function(key) {
				Base.define(scope, key, {
					configurable: true,
					get: function() {
						return that[key];
					}
				});
			});
			for (var key in this)
				if (!/^_/.test(key) && this[key])
					scope[key] = this[key];
		},

		setup: function(element) {
			paper = this;
			this.project = new Project(element);
			return this;
		},

		createCanvas: function(width, height) {
			return CanvasProvider.getCanvas(width, height);
		},

		activate: function() {
			paper = this;
		},

		clear: function() {
			var projects = this.projects,
				tools = this.tools,
				palettes = this.palettes;
			for (var i = projects.length - 1; i >= 0; i--)
				projects[i].remove();
			for (var i = tools.length - 1; i >= 0; i--)
				tools[i].remove();
			for (var i = palettes.length - 1; i >= 0; i--)
				palettes[i].remove();
		},

		remove: function() {
			this.clear();
			delete PaperScope._scopes[this._id];
		},

		statics: new function() {
			function handleAttribute(name) {
				name += 'Attribute';
				return function(el, attr) {
					return el[name](attr) || el[name]('data-paper-' + attr);
				};
			}

			return {
				_scopes: {},
				_id: 0,

				get: function(id) {
					return this._scopes[id] || null;
				},

				getAttribute: handleAttribute('get'),
				hasAttribute: handleAttribute('has')
			};
		}
	});

	var PaperScopeItem = Base.extend(Emitter, {

		initialize: function(activate) {
			this._scope = paper;
			this._index = this._scope[this._list].push(this) - 1;
			if (activate || !this._scope[this._reference])
				this.activate();
		},

		activate: function() {
			if (!this._scope)
				return false;
			var prev = this._scope[this._reference];
			if (prev && prev !== this)
				prev.emit('deactivate');
			this._scope[this._reference] = this;
			this.emit('activate', prev);
			return true;
		},

		isActive: function() {
			return this._scope[this._reference] === this;
		},

		remove: function() {
			if (this._index == null)
				return false;
			Base.splice(this._scope[this._list], null, this._index, 1);
			if (this._scope[this._reference] == this)
				this._scope[this._reference] = null;
			this._scope = null;
			return true;
		},

		getView: function() {
			return this._scope.getView();
		}
	});

	var Formatter = Base.extend({
		initialize: function(precision) {
			this.precision = Base.pick(precision, 5);
			this.multiplier = Math.pow(10, this.precision);
		},

		number: function(val) {
			return this.precision < 16
					? Math.round(val * this.multiplier) / this.multiplier : val;
		},

		pair: function(val1, val2, separator) {
			return this.number(val1) + (separator || ',') + this.number(val2);
		},

		point: function(val, separator) {
			return this.number(val.x) + (separator || ',') + this.number(val.y);
		},

		size: function(val, separator) {
			return this.number(val.width) + (separator || ',')
					+ this.number(val.height);
		},

		rectangle: function(val, separator) {
			return this.point(val, separator) + (separator || ',')
					+ this.size(val, separator);
		}
	});

	Formatter.instance = new Formatter();

	var Numerical = new function() {

		var abscissas = [
			[  0.5773502691896257645091488],
			[0,0.7745966692414833770358531],
			[  0.3399810435848562648026658,0.8611363115940525752239465],
			[0,0.5384693101056830910363144,0.9061798459386639927976269],
			[  0.2386191860831969086305017,0.6612093864662645136613996,0.9324695142031520278123016],
			[0,0.4058451513773971669066064,0.7415311855993944398638648,0.9491079123427585245261897],
			[  0.1834346424956498049394761,0.5255324099163289858177390,0.7966664774136267395915539,0.9602898564975362316835609],
			[0,0.3242534234038089290385380,0.6133714327005903973087020,0.8360311073266357942994298,0.9681602395076260898355762],
			[  0.1488743389816312108848260,0.4333953941292471907992659,0.6794095682990244062343274,0.8650633666889845107320967,0.9739065285171717200779640],
			[0,0.2695431559523449723315320,0.5190961292068118159257257,0.7301520055740493240934163,0.8870625997680952990751578,0.9782286581460569928039380],
			[  0.1252334085114689154724414,0.3678314989981801937526915,0.5873179542866174472967024,0.7699026741943046870368938,0.9041172563704748566784659,0.9815606342467192506905491],
			[0,0.2304583159551347940655281,0.4484927510364468528779129,0.6423493394403402206439846,0.8015780907333099127942065,0.9175983992229779652065478,0.9841830547185881494728294],
			[  0.1080549487073436620662447,0.3191123689278897604356718,0.5152486363581540919652907,0.6872929048116854701480198,0.8272013150697649931897947,0.9284348836635735173363911,0.9862838086968123388415973],
			[0,0.2011940939974345223006283,0.3941513470775633698972074,0.5709721726085388475372267,0.7244177313601700474161861,0.8482065834104272162006483,0.9372733924007059043077589,0.9879925180204854284895657],
			[  0.0950125098376374401853193,0.2816035507792589132304605,0.4580167776572273863424194,0.6178762444026437484466718,0.7554044083550030338951012,0.8656312023878317438804679,0.9445750230732325760779884,0.9894009349916499325961542]
		];

		var weights = [
			[1],
			[0.8888888888888888888888889,0.5555555555555555555555556],
			[0.6521451548625461426269361,0.3478548451374538573730639],
			[0.5688888888888888888888889,0.4786286704993664680412915,0.2369268850561890875142640],
			[0.4679139345726910473898703,0.3607615730481386075698335,0.1713244923791703450402961],
			[0.4179591836734693877551020,0.3818300505051189449503698,0.2797053914892766679014678,0.1294849661688696932706114],
			[0.3626837833783619829651504,0.3137066458778872873379622,0.2223810344533744705443560,0.1012285362903762591525314],
			[0.3302393550012597631645251,0.3123470770400028400686304,0.2606106964029354623187429,0.1806481606948574040584720,0.0812743883615744119718922],
			[0.2955242247147528701738930,0.2692667193099963550912269,0.2190863625159820439955349,0.1494513491505805931457763,0.0666713443086881375935688],
			[0.2729250867779006307144835,0.2628045445102466621806889,0.2331937645919904799185237,0.1862902109277342514260976,0.1255803694649046246346943,0.0556685671161736664827537],
			[0.2491470458134027850005624,0.2334925365383548087608499,0.2031674267230659217490645,0.1600783285433462263346525,0.1069393259953184309602547,0.0471753363865118271946160],
			[0.2325515532308739101945895,0.2262831802628972384120902,0.2078160475368885023125232,0.1781459807619457382800467,0.1388735102197872384636018,0.0921214998377284479144218,0.0404840047653158795200216],
			[0.2152638534631577901958764,0.2051984637212956039659241,0.1855383974779378137417166,0.1572031671581935345696019,0.1215185706879031846894148,0.0801580871597602098056333,0.0351194603317518630318329],
			[0.2025782419255612728806202,0.1984314853271115764561183,0.1861610000155622110268006,0.1662692058169939335532009,0.1395706779261543144478048,0.1071592204671719350118695,0.0703660474881081247092674,0.0307532419961172683546284],
			[0.1894506104550684962853967,0.1826034150449235888667637,0.1691565193950025381893121,0.1495959888165767320815017,0.1246289712555338720524763,0.0951585116824927848099251,0.0622535239386478928628438,0.0271524594117540948517806]
		];

		var abs = Math.abs,
			sqrt = Math.sqrt,
			pow = Math.pow,
			log2 = Math.log2 || function(x) {
				return Math.log(x) * Math.LOG2E;
			},
			EPSILON = 1e-12,
			MACHINE_EPSILON = 1.12e-16;

		function clamp(value, min, max) {
			return value < min ? min : value > max ? max : value;
		}

		function getDiscriminant(a, b, c) {
			function split(v) {
				var x = v * 134217729,
					y = v - x,
					hi = y + x,
					lo = v - hi;
				return [hi, lo];
			}

			var D = b * b - a * c,
				E = b * b + a * c;
			if (abs(D) * 3 < E) {
				var ad = split(a),
					bd = split(b),
					cd = split(c),
					p = b * b,
					dp = (bd[0] * bd[0] - p + 2 * bd[0] * bd[1]) + bd[1] * bd[1],
					q = a * c,
					dq = (ad[0] * cd[0] - q + ad[0] * cd[1] + ad[1] * cd[0])
							+ ad[1] * cd[1];
				D = (p - q) + (dp - dq);
			}
			return D;
		}

		function getNormalizationFactor() {
			var norm = Math.max.apply(Math, arguments);
			return norm && (norm < 1e-8 || norm > 1e8)
					? pow(2, -Math.round(log2(norm)))
					: 0;
		}

		return {
			TOLERANCE: 1e-6,
			EPSILON: EPSILON,
			MACHINE_EPSILON: MACHINE_EPSILON,
			CURVETIME_EPSILON: 4e-7,
			GEOMETRIC_EPSILON: 2e-7,
			WINDING_EPSILON: 2e-7,
			TRIGONOMETRIC_EPSILON: 1e-7,
			CLIPPING_EPSILON: 1e-9,
			KAPPA: 4 * (sqrt(2) - 1) / 3,

			isZero: function(val) {
				return val >= -EPSILON && val <= EPSILON;
			},

			clamp: clamp,

			integrate: function(f, a, b, n) {
				var x = abscissas[n - 2],
					w = weights[n - 2],
					A = (b - a) * 0.5,
					B = A + a,
					i = 0,
					m = (n + 1) >> 1,
					sum = n & 1 ? w[i++] * f(B) : 0;
				while (i < m) {
					var Ax = A * x[i];
					sum += w[i++] * (f(B + Ax) + f(B - Ax));
				}
				return A * sum;
			},

			findRoot: function(f, df, x, a, b, n, tolerance) {
				for (var i = 0; i < n; i++) {
					var fx = f(x),
						dx = fx / df(x),
						nx = x - dx;
					if (abs(dx) < tolerance)
						return nx;
					if (fx > 0) {
						b = x;
						x = nx <= a ? (a + b) * 0.5 : nx;
					} else {
						a = x;
						x = nx >= b ? (a + b) * 0.5 : nx;
					}
				}
				return x;
			},

			solveQuadratic: function(a, b, c, roots, min, max) {
				var x1, x2 = Infinity;
				if (abs(a) < EPSILON) {
					if (abs(b) < EPSILON)
						return abs(c) < EPSILON ? -1 : 0;
					x1 = -c / b;
				} else {
					b *= -0.5;
					var D = getDiscriminant(a, b, c);
					if (D && abs(D) < MACHINE_EPSILON) {
						var f = getNormalizationFactor(abs(a), abs(b), abs(c));
						if (f) {
							a *= f;
							b *= f;
							c *= f;
							D = getDiscriminant(a, b, c);
						}
					}
					if (D >= -MACHINE_EPSILON) {
						var Q = D < 0 ? 0 : sqrt(D),
							R = b + (b < 0 ? -Q : Q);
						if (R === 0) {
							x1 = c / a;
							x2 = -x1;
						} else {
							x1 = R / a;
							x2 = c / R;
						}
					}
				}
				var count = 0,
					boundless = min == null,
					minB = min - EPSILON,
					maxB = max + EPSILON;
				if (isFinite(x1) && (boundless || x1 > minB && x1 < maxB))
					roots[count++] = boundless ? x1 : clamp(x1, min, max);
				if (x2 !== x1
						&& isFinite(x2) && (boundless || x2 > minB && x2 < maxB))
					roots[count++] = boundless ? x2 : clamp(x2, min, max);
				return count;
			},

			solveCubic: function(a, b, c, d, roots, min, max) {
				var f = getNormalizationFactor(abs(a), abs(b), abs(c), abs(d)),
					x, b1, c2, qd, q;
				if (f) {
					a *= f;
					b *= f;
					c *= f;
					d *= f;
				}

				function evaluate(x0) {
					x = x0;
					var tmp = a * x;
					b1 = tmp + b;
					c2 = b1 * x + c;
					qd = (tmp + b1) * x + c2;
					q = c2 * x + d;
				}

				if (abs(a) < EPSILON) {
					a = b;
					b1 = c;
					c2 = d;
					x = Infinity;
				} else if (abs(d) < EPSILON) {
					b1 = b;
					c2 = c;
					x = 0;
				} else {
					evaluate(-(b / a) / 3);
					var t = q / a,
						r = pow(abs(t), 1/3),
						s = t < 0 ? -1 : 1,
						td = -qd / a,
						rd = td > 0 ? 1.324717957244746 * Math.max(r, sqrt(td)) : r,
						x0 = x - s * rd;
					if (x0 !== x) {
						do {
							evaluate(x0);
							x0 = qd === 0 ? x : x - q / qd / (1 + MACHINE_EPSILON);
						} while (s * x0 > s * x);
						if (abs(a) * x * x > abs(d / x)) {
							c2 = -d / x;
							b1 = (c2 - c) / x;
						}
					}
				}
				var count = Numerical.solveQuadratic(a, b1, c2, roots, min, max),
					boundless = min == null;
				if (isFinite(x) && (count === 0
						|| count > 0 && x !== roots[0] && x !== roots[1])
						&& (boundless || x > min - EPSILON && x < max + EPSILON))
					roots[count++] = boundless ? x : clamp(x, min, max);
				return count;
			}
		};
	};

	var UID = {
		_id: 1,
		_pools: {},

		get: function(name) {
			if (name) {
				var pool = this._pools[name];
				if (!pool)
					pool = this._pools[name] = { _id: 1 };
				return pool._id++;
			} else {
				return this._id++;
			}
		}
	};

	var Point = Base.extend({
		_class: 'Point',
		_readIndex: true,

		initialize: function Point(arg0, arg1) {
			var type = typeof arg0;
			if (type === 'number') {
				var hasY = typeof arg1 === 'number';
				this.x = arg0;
				this.y = hasY ? arg1 : arg0;
				if (this.__read)
					this.__read = hasY ? 2 : 1;
			} else if (type === 'undefined' || arg0 === null) {
				this.x = this.y = 0;
				if (this.__read)
					this.__read = arg0 === null ? 1 : 0;
			} else {
				var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
				if (Array.isArray(obj)) {
					this.x = obj[0];
					this.y = obj.length > 1 ? obj[1] : obj[0];
				} else if ('x' in obj) {
					this.x = obj.x;
					this.y = obj.y;
				} else if ('width' in obj) {
					this.x = obj.width;
					this.y = obj.height;
				} else if ('angle' in obj) {
					this.x = obj.length;
					this.y = 0;
					this.setAngle(obj.angle);
				} else {
					this.x = this.y = 0;
					if (this.__read)
						this.__read = 0;
				}
				if (this.__read)
					this.__read = 1;
			}
		},

		set: function(x, y) {
			this.x = x;
			this.y = y;
			return this;
		},

		equals: function(point) {
			return this === point || point
					&& (this.x === point.x && this.y === point.y
						|| Array.isArray(point)
							&& this.x === point[0] && this.y === point[1])
					|| false;
		},

		clone: function() {
			return new Point(this.x, this.y);
		},

		toString: function() {
			var f = Formatter.instance;
			return '{ x: ' + f.number(this.x) + ', y: ' + f.number(this.y) + ' }';
		},

		_serialize: function(options) {
			var f = options.formatter;
			return [f.number(this.x), f.number(this.y)];
		},

		getLength: function() {
			return Math.sqrt(this.x * this.x + this.y * this.y);
		},

		setLength: function(length) {
			if (this.isZero()) {
				var angle = this._angle || 0;
				this.set(
					Math.cos(angle) * length,
					Math.sin(angle) * length
				);
			} else {
				var scale = length / this.getLength();
				if (Numerical.isZero(scale))
					this.getAngle();
				this.set(
					this.x * scale,
					this.y * scale
				);
			}
		},
		getAngle: function() {
			return this.getAngleInRadians.apply(this, arguments) * 180 / Math.PI;
		},

		setAngle: function(angle) {
			this.setAngleInRadians.call(this, angle * Math.PI / 180);
		},

		getAngleInDegrees: '#getAngle',
		setAngleInDegrees: '#setAngle',

		getAngleInRadians: function() {
			if (!arguments.length) {
				return this.isZero()
						? this._angle || 0
						: this._angle = Math.atan2(this.y, this.x);
			} else {
				var point = Point.read(arguments),
					div = this.getLength() * point.getLength();
				if (Numerical.isZero(div)) {
					return NaN;
				} else {
					var a = this.dot(point) / div;
					return Math.acos(a < -1 ? -1 : a > 1 ? 1 : a);
				}
			}
		},

		setAngleInRadians: function(angle) {
			this._angle = angle;
			if (!this.isZero()) {
				var length = this.getLength();
				this.set(
					Math.cos(angle) * length,
					Math.sin(angle) * length
				);
			}
		},

		getQuadrant: function() {
			return this.x >= 0 ? this.y >= 0 ? 1 : 4 : this.y >= 0 ? 2 : 3;
		}
	}, {
		beans: false,

		getDirectedAngle: function() {
			var point = Point.read(arguments);
			return Math.atan2(this.cross(point), this.dot(point)) * 180 / Math.PI;
		},

		getDistance: function() {
			var point = Point.read(arguments),
				x = point.x - this.x,
				y = point.y - this.y,
				d = x * x + y * y,
				squared = Base.read(arguments);
			return squared ? d : Math.sqrt(d);
		},

		normalize: function(length) {
			if (length === undefined)
				length = 1;
			var current = this.getLength(),
				scale = current !== 0 ? length / current : 0,
				point = new Point(this.x * scale, this.y * scale);
			if (scale >= 0)
				point._angle = this._angle;
			return point;
		},

		rotate: function(angle, center) {
			if (angle === 0)
				return this.clone();
			angle = angle * Math.PI / 180;
			var point = center ? this.subtract(center) : this,
				sin = Math.sin(angle),
				cos = Math.cos(angle);
			point = new Point(
				point.x * cos - point.y * sin,
				point.x * sin + point.y * cos
			);
			return center ? point.add(center) : point;
		},

		transform: function(matrix) {
			return matrix ? matrix._transformPoint(this) : this;
		},

		add: function() {
			var point = Point.read(arguments);
			return new Point(this.x + point.x, this.y + point.y);
		},

		subtract: function() {
			var point = Point.read(arguments);
			return new Point(this.x - point.x, this.y - point.y);
		},

		multiply: function() {
			var point = Point.read(arguments);
			return new Point(this.x * point.x, this.y * point.y);
		},

		divide: function() {
			var point = Point.read(arguments);
			return new Point(this.x / point.x, this.y / point.y);
		},

		modulo: function() {
			var point = Point.read(arguments);
			return new Point(this.x % point.x, this.y % point.y);
		},

		negate: function() {
			return new Point(-this.x, -this.y);
		},

		isInside: function() {
			return Rectangle.read(arguments).contains(this);
		},

		isClose: function() {
			var point = Point.read(arguments),
				tolerance = Base.read(arguments);
			return this.getDistance(point) <= tolerance;
		},

		isCollinear: function() {
			var point = Point.read(arguments);
			return Point.isCollinear(this.x, this.y, point.x, point.y);
		},

		isColinear: '#isCollinear',

		isOrthogonal: function() {
			var point = Point.read(arguments);
			return Point.isOrthogonal(this.x, this.y, point.x, point.y);
		},

		isZero: function() {
			return Numerical.isZero(this.x) && Numerical.isZero(this.y);
		},

		isNaN: function() {
			return isNaN(this.x) || isNaN(this.y);
		},

		dot: function() {
			var point = Point.read(arguments);
			return this.x * point.x + this.y * point.y;
		},

		cross: function() {
			var point = Point.read(arguments);
			return this.x * point.y - this.y * point.x;
		},

		project: function() {
			var point = Point.read(arguments),
				scale = point.isZero() ? 0 : this.dot(point) / point.dot(point);
			return new Point(
				point.x * scale,
				point.y * scale
			);
		},

		statics: {
			min: function() {
				var point1 = Point.read(arguments),
					point2 = Point.read(arguments);
				return new Point(
					Math.min(point1.x, point2.x),
					Math.min(point1.y, point2.y)
				);
			},

			max: function() {
				var point1 = Point.read(arguments),
					point2 = Point.read(arguments);
				return new Point(
					Math.max(point1.x, point2.x),
					Math.max(point1.y, point2.y)
				);
			},

			random: function() {
				return new Point(Math.random(), Math.random());
			},

			isCollinear: function(x1, y1, x2, y2) {
				return Math.abs(x1 * y2 - y1 * x2)
						<= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
							* 1e-7;
			},

			isOrthogonal: function(x1, y1, x2, y2) {
				return Math.abs(x1 * x2 + y1 * y2)
						<= Math.sqrt((x1 * x1 + y1 * y1) * (x2 * x2 + y2 * y2))
							* 1e-7;
			}
		}
	}, Base.each(['round', 'ceil', 'floor', 'abs'], function(key) {
		var op = Math[key];
		this[key] = function() {
			return new Point(op(this.x), op(this.y));
		};
	}, {}));

	var LinkedPoint = Point.extend({
		initialize: function Point(x, y, owner, setter) {
			this._x = x;
			this._y = y;
			this._owner = owner;
			this._setter = setter;
		},

		set: function(x, y, _dontNotify) {
			this._x = x;
			this._y = y;
			if (!_dontNotify)
				this._owner[this._setter](this);
			return this;
		},

		getX: function() {
			return this._x;
		},

		setX: function(x) {
			this._x = x;
			this._owner[this._setter](this);
		},

		getY: function() {
			return this._y;
		},

		setY: function(y) {
			this._y = y;
			this._owner[this._setter](this);
		},

		isSelected: function() {
			return !!(this._owner._selection & this._getSelection());
		},

		setSelected: function(selected) {
			this._owner.changeSelection(this._getSelection(), selected);
		},

		_getSelection: function() {
			return this._setter === 'setPosition' ? 4 : 0;
		}
	});

	var Size = Base.extend({
		_class: 'Size',
		_readIndex: true,

		initialize: function Size(arg0, arg1) {
			var type = typeof arg0;
			if (type === 'number') {
				var hasHeight = typeof arg1 === 'number';
				this.width = arg0;
				this.height = hasHeight ? arg1 : arg0;
				if (this.__read)
					this.__read = hasHeight ? 2 : 1;
			} else if (type === 'undefined' || arg0 === null) {
				this.width = this.height = 0;
				if (this.__read)
					this.__read = arg0 === null ? 1 : 0;
			} else {
				var obj = type === 'string' ? arg0.split(/[\s,]+/) || [] : arg0;
				if (Array.isArray(obj)) {
					this.width = obj[0];
					this.height = obj.length > 1 ? obj[1] : obj[0];
				} else if ('width' in obj) {
					this.width = obj.width;
					this.height = obj.height;
				} else if ('x' in obj) {
					this.width = obj.x;
					this.height = obj.y;
				} else {
					this.width = this.height = 0;
					if (this.__read)
						this.__read = 0;
				}
				if (this.__read)
					this.__read = 1;
			}
		},

		set: function(width, height) {
			this.width = width;
			this.height = height;
			return this;
		},

		equals: function(size) {
			return size === this || size && (this.width === size.width
					&& this.height === size.height
					|| Array.isArray(size) && this.width === size[0]
						&& this.height === size[1]) || false;
		},

		clone: function() {
			return new Size(this.width, this.height);
		},

		toString: function() {
			var f = Formatter.instance;
			return '{ width: ' + f.number(this.width)
					+ ', height: ' + f.number(this.height) + ' }';
		},

		_serialize: function(options) {
			var f = options.formatter;
			return [f.number(this.width),
					f.number(this.height)];
		},

		add: function() {
			var size = Size.read(arguments);
			return new Size(this.width + size.width, this.height + size.height);
		},

		subtract: function() {
			var size = Size.read(arguments);
			return new Size(this.width - size.width, this.height - size.height);
		},

		multiply: function() {
			var size = Size.read(arguments);
			return new Size(this.width * size.width, this.height * size.height);
		},

		divide: function() {
			var size = Size.read(arguments);
			return new Size(this.width / size.width, this.height / size.height);
		},

		modulo: function() {
			var size = Size.read(arguments);
			return new Size(this.width % size.width, this.height % size.height);
		},

		negate: function() {
			return new Size(-this.width, -this.height);
		},

		isZero: function() {
			return Numerical.isZero(this.width) && Numerical.isZero(this.height);
		},

		isNaN: function() {
			return isNaN(this.width) || isNaN(this.height);
		},

		statics: {
			min: function(size1, size2) {
				return new Size(
					Math.min(size1.width, size2.width),
					Math.min(size1.height, size2.height));
			},

			max: function(size1, size2) {
				return new Size(
					Math.max(size1.width, size2.width),
					Math.max(size1.height, size2.height));
			},

			random: function() {
				return new Size(Math.random(), Math.random());
			}
		}
	}, Base.each(['round', 'ceil', 'floor', 'abs'], function(key) {
		var op = Math[key];
		this[key] = function() {
			return new Size(op(this.width), op(this.height));
		};
	}, {}));

	var LinkedSize = Size.extend({
		initialize: function Size(width, height, owner, setter) {
			this._width = width;
			this._height = height;
			this._owner = owner;
			this._setter = setter;
		},

		set: function(width, height, _dontNotify) {
			this._width = width;
			this._height = height;
			if (!_dontNotify)
				this._owner[this._setter](this);
			return this;
		},

		getWidth: function() {
			return this._width;
		},

		setWidth: function(width) {
			this._width = width;
			this._owner[this._setter](this);
		},

		getHeight: function() {
			return this._height;
		},

		setHeight: function(height) {
			this._height = height;
			this._owner[this._setter](this);
		}
	});

	var Rectangle = Base.extend({
		_class: 'Rectangle',
		_readIndex: true,
		beans: true,

		initialize: function Rectangle(arg0, arg1, arg2, arg3) {
			var type = typeof arg0,
				read = 0;
			if (type === 'number') {
				this.x = arg0;
				this.y = arg1;
				this.width = arg2;
				this.height = arg3;
				read = 4;
			} else if (type === 'undefined' || arg0 === null) {
				this.x = this.y = this.width = this.height = 0;
				read = arg0 === null ? 1 : 0;
			} else if (arguments.length === 1) {
				if (Array.isArray(arg0)) {
					this.x = arg0[0];
					this.y = arg0[1];
					this.width = arg0[2];
					this.height = arg0[3];
					read = 1;
				} else if (arg0.x !== undefined || arg0.width !== undefined) {
					this.x = arg0.x || 0;
					this.y = arg0.y || 0;
					this.width = arg0.width || 0;
					this.height = arg0.height || 0;
					read = 1;
				} else if (arg0.from === undefined && arg0.to === undefined) {
					this.x = this.y = this.width = this.height = 0;
					this._set(arg0);
					read = 1;
				}
			}
			if (!read) {
				var point = Point.readNamed(arguments, 'from'),
					next = Base.peek(arguments);
				this.x = point.x;
				this.y = point.y;
				if (next && next.x !== undefined || Base.hasNamed(arguments, 'to')) {
					var to = Point.readNamed(arguments, 'to');
					this.width = to.x - point.x;
					this.height = to.y - point.y;
					if (this.width < 0) {
						this.x = to.x;
						this.width = -this.width;
					}
					if (this.height < 0) {
						this.y = to.y;
						this.height = -this.height;
					}
				} else {
					var size = Size.read(arguments);
					this.width = size.width;
					this.height = size.height;
				}
				read = arguments.__index;
			}
			if (this.__read)
				this.__read = read;
		},

		set: function(x, y, width, height) {
			this.x = x;
			this.y = y;
			this.width = width;
			this.height = height;
			return this;
		},

		clone: function() {
			return new Rectangle(this.x, this.y, this.width, this.height);
		},

		equals: function(rect) {
			var rt = Base.isPlainValue(rect)
					? Rectangle.read(arguments)
					: rect;
			return rt === this
					|| rt && this.x === rt.x && this.y === rt.y
						&& this.width === rt.width && this.height === rt.height
					|| false;
		},

		toString: function() {
			var f = Formatter.instance;
			return '{ x: ' + f.number(this.x)
					+ ', y: ' + f.number(this.y)
					+ ', width: ' + f.number(this.width)
					+ ', height: ' + f.number(this.height)
					+ ' }';
		},

		_serialize: function(options) {
			var f = options.formatter;
			return [f.number(this.x),
					f.number(this.y),
					f.number(this.width),
					f.number(this.height)];
		},

		getPoint: function(_dontLink) {
			var ctor = _dontLink ? Point : LinkedPoint;
			return new ctor(this.x, this.y, this, 'setPoint');
		},

		setPoint: function() {
			var point = Point.read(arguments);
			this.x = point.x;
			this.y = point.y;
		},

		getSize: function(_dontLink) {
			var ctor = _dontLink ? Size : LinkedSize;
			return new ctor(this.width, this.height, this, 'setSize');
		},

		setSize: function() {
			var size = Size.read(arguments);
			if (this._fixX)
				this.x += (this.width - size.width) * this._fixX;
			if (this._fixY)
				this.y += (this.height - size.height) * this._fixY;
			this.width = size.width;
			this.height = size.height;
			this._fixW = 1;
			this._fixH = 1;
		},

		getLeft: function() {
			return this.x;
		},

		setLeft: function(left) {
			if (!this._fixW)
				this.width -= left - this.x;
			this.x = left;
			this._fixX = 0;
		},

		getTop: function() {
			return this.y;
		},

		setTop: function(top) {
			if (!this._fixH)
				this.height -= top - this.y;
			this.y = top;
			this._fixY = 0;
		},

		getRight: function() {
			return this.x + this.width;
		},

		setRight: function(right) {
			if (this._fixX !== undefined && this._fixX !== 1)
				this._fixW = 0;
			if (this._fixW)
				this.x = right - this.width;
			else
				this.width = right - this.x;
			this._fixX = 1;
		},

		getBottom: function() {
			return this.y + this.height;
		},

		setBottom: function(bottom) {
			if (this._fixY !== undefined && this._fixY !== 1)
				this._fixH = 0;
			if (this._fixH)
				this.y = bottom - this.height;
			else
				this.height = bottom - this.y;
			this._fixY = 1;
		},

		getCenterX: function() {
			return this.x + this.width * 0.5;
		},

		setCenterX: function(x) {
			this.x = x - this.width * 0.5;
			this._fixX = 0.5;
		},

		getCenterY: function() {
			return this.y + this.height * 0.5;
		},

		setCenterY: function(y) {
			this.y = y - this.height * 0.5;
			this._fixY = 0.5;
		},

		getCenter: function(_dontLink) {
			var ctor = _dontLink ? Point : LinkedPoint;
			return new ctor(this.getCenterX(), this.getCenterY(), this, 'setCenter');
		},

		setCenter: function() {
			var point = Point.read(arguments);
			this.setCenterX(point.x);
			this.setCenterY(point.y);
			return this;
		},

		getArea: function() {
			return this.width * this.height;
		},

		isEmpty: function() {
			return this.width === 0 || this.height === 0;
		},

		contains: function(arg) {
			return arg && arg.width !== undefined
					|| (Array.isArray(arg) ? arg : arguments).length === 4
					? this._containsRectangle(Rectangle.read(arguments))
					: this._containsPoint(Point.read(arguments));
		},

		_containsPoint: function(point) {
			var x = point.x,
				y = point.y;
			return x >= this.x && y >= this.y
					&& x <= this.x + this.width
					&& y <= this.y + this.height;
		},

		_containsRectangle: function(rect) {
			var x = rect.x,
				y = rect.y;
			return x >= this.x && y >= this.y
					&& x + rect.width <= this.x + this.width
					&& y + rect.height <= this.y + this.height;
		},

		intersects: function() {
			var rect = Rectangle.read(arguments);
			return rect.x + rect.width > this.x
					&& rect.y + rect.height > this.y
					&& rect.x < this.x + this.width
					&& rect.y < this.y + this.height;
		},

		touches: function() {
			var rect = Rectangle.read(arguments);
			return rect.x + rect.width >= this.x
					&& rect.y + rect.height >= this.y
					&& rect.x <= this.x + this.width
					&& rect.y <= this.y + this.height;
		},

		intersect: function() {
			var rect = Rectangle.read(arguments),
				x1 = Math.max(this.x, rect.x),
				y1 = Math.max(this.y, rect.y),
				x2 = Math.min(this.x + this.width, rect.x + rect.width),
				y2 = Math.min(this.y + this.height, rect.y + rect.height);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		unite: function() {
			var rect = Rectangle.read(arguments),
				x1 = Math.min(this.x, rect.x),
				y1 = Math.min(this.y, rect.y),
				x2 = Math.max(this.x + this.width, rect.x + rect.width),
				y2 = Math.max(this.y + this.height, rect.y + rect.height);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		include: function() {
			var point = Point.read(arguments);
			var x1 = Math.min(this.x, point.x),
				y1 = Math.min(this.y, point.y),
				x2 = Math.max(this.x + this.width, point.x),
				y2 = Math.max(this.y + this.height, point.y);
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		},

		expand: function() {
			var amount = Size.read(arguments),
				hor = amount.width,
				ver = amount.height;
			return new Rectangle(this.x - hor / 2, this.y - ver / 2,
					this.width + hor, this.height + ver);
		},

		scale: function(hor, ver) {
			return this.expand(this.width * hor - this.width,
					this.height * (ver === undefined ? hor : ver) - this.height);
		}
	}, Base.each([
			['Top', 'Left'], ['Top', 'Right'],
			['Bottom', 'Left'], ['Bottom', 'Right'],
			['Left', 'Center'], ['Top', 'Center'],
			['Right', 'Center'], ['Bottom', 'Center']
		],
		function(parts, index) {
			var part = parts.join(''),
				xFirst = /^[RL]/.test(part);
			if (index >= 4)
				parts[1] += xFirst ? 'Y' : 'X';
			var x = parts[xFirst ? 0 : 1],
				y = parts[xFirst ? 1 : 0],
				getX = 'get' + x,
				getY = 'get' + y,
				setX = 'set' + x,
				setY = 'set' + y,
				get = 'get' + part,
				set = 'set' + part;
			this[get] = function(_dontLink) {
				var ctor = _dontLink ? Point : LinkedPoint;
				return new ctor(this[getX](), this[getY](), this, set);
			};
			this[set] = function() {
				var point = Point.read(arguments);
				this[setX](point.x);
				this[setY](point.y);
			};
		}, {
			beans: true
		}
	));

	var LinkedRectangle = Rectangle.extend({
		initialize: function Rectangle(x, y, width, height, owner, setter) {
			this.set(x, y, width, height, true);
			this._owner = owner;
			this._setter = setter;
		},

		set: function(x, y, width, height, _dontNotify) {
			this._x = x;
			this._y = y;
			this._width = width;
			this._height = height;
			if (!_dontNotify)
				this._owner[this._setter](this);
			return this;
		}
	},
	new function() {
		var proto = Rectangle.prototype;

		return Base.each(['x', 'y', 'width', 'height'], function(key) {
			var part = Base.capitalize(key),
				internal = '_' + key;
			this['get' + part] = function() {
				return this[internal];
			};

			this['set' + part] = function(value) {
				this[internal] = value;
				if (!this._dontNotify)
					this._owner[this._setter](this);
			};
		}, Base.each(['Point', 'Size', 'Center',
				'Left', 'Top', 'Right', 'Bottom', 'CenterX', 'CenterY',
				'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight',
				'LeftCenter', 'TopCenter', 'RightCenter', 'BottomCenter'],
			function(key) {
				var name = 'set' + key;
				this[name] = function() {
					this._dontNotify = true;
					proto[name].apply(this, arguments);
					this._dontNotify = false;
					this._owner[this._setter](this);
				};
			}, {
				isSelected: function() {
					return !!(this._owner._selection & 2);
				},

				setSelected: function(selected) {
					var owner = this._owner;
					if (owner.changeSelection) {
						owner.changeSelection(2, selected);
					}
				}
			})
		);
	});

	var Matrix = Base.extend({
		_class: 'Matrix',

		initialize: function Matrix(arg) {
			var count = arguments.length,
				ok = true;
			if (count === 6) {
				this.set.apply(this, arguments);
			} else if (count === 1) {
				if (arg instanceof Matrix) {
					this.set(arg._a, arg._b, arg._c, arg._d, arg._tx, arg._ty);
				} else if (Array.isArray(arg)) {
					this.set.apply(this, arg);
				} else {
					ok = false;
				}
			} else if (count === 0) {
				this.reset();
			} else {
				ok = false;
			}
			if (!ok) {
				throw new Error('Unsupported matrix parameters');
			}
		},

		set: function(a, b, c, d, tx, ty, _dontNotify) {
			this._a = a;
			this._b = b;
			this._c = c;
			this._d = d;
			this._tx = tx;
			this._ty = ty;
			if (!_dontNotify)
				this._changed();
			return this;
		},

		_serialize: function(options, dictionary) {
			return Base.serialize(this.getValues(), options, true, dictionary);
		},

		_changed: function() {
			var owner = this._owner;
			if (owner) {
				if (owner._applyMatrix) {
					owner.transform(null, true);
				} else {
					owner._changed(9);
				}
			}
		},

		clone: function() {
			return new Matrix(this._a, this._b, this._c, this._d,
					this._tx, this._ty);
		},

		equals: function(mx) {
			return mx === this || mx && this._a === mx._a && this._b === mx._b
					&& this._c === mx._c && this._d === mx._d
					&& this._tx === mx._tx && this._ty === mx._ty;
		},

		toString: function() {
			var f = Formatter.instance;
			return '[[' + [f.number(this._a), f.number(this._c),
						f.number(this._tx)].join(', ') + '], ['
					+ [f.number(this._b), f.number(this._d),
						f.number(this._ty)].join(', ') + ']]';
		},

		reset: function(_dontNotify) {
			this._a = this._d = 1;
			this._b = this._c = this._tx = this._ty = 0;
			if (!_dontNotify)
				this._changed();
			return this;
		},

		apply: function(recursively, _setApplyMatrix) {
			var owner = this._owner;
			if (owner) {
				owner.transform(null, true, Base.pick(recursively, true),
						_setApplyMatrix);
				return this.isIdentity();
			}
			return false;
		},

		translate: function() {
			var point = Point.read(arguments),
				x = point.x,
				y = point.y;
			this._tx += x * this._a + y * this._c;
			this._ty += x * this._b + y * this._d;
			this._changed();
			return this;
		},

		scale: function() {
			var scale = Point.read(arguments),
				center = Point.read(arguments, 0, { readNull: true });
			if (center)
				this.translate(center);
			this._a *= scale.x;
			this._b *= scale.x;
			this._c *= scale.y;
			this._d *= scale.y;
			if (center)
				this.translate(center.negate());
			this._changed();
			return this;
		},

		rotate: function(angle ) {
			angle *= Math.PI / 180;
			var center = Point.read(arguments, 1),
				x = center.x,
				y = center.y,
				cos = Math.cos(angle),
				sin = Math.sin(angle),
				tx = x - x * cos + y * sin,
				ty = y - x * sin - y * cos,
				a = this._a,
				b = this._b,
				c = this._c,
				d = this._d;
			this._a = cos * a + sin * c;
			this._b = cos * b + sin * d;
			this._c = -sin * a + cos * c;
			this._d = -sin * b + cos * d;
			this._tx += tx * a + ty * c;
			this._ty += tx * b + ty * d;
			this._changed();
			return this;
		},

		shear: function() {
			var shear = Point.read(arguments),
				center = Point.read(arguments, 0, { readNull: true });
			if (center)
				this.translate(center);
			var a = this._a,
				b = this._b;
			this._a += shear.y * this._c;
			this._b += shear.y * this._d;
			this._c += shear.x * a;
			this._d += shear.x * b;
			if (center)
				this.translate(center.negate());
			this._changed();
			return this;
		},

		skew: function() {
			var skew = Point.read(arguments),
				center = Point.read(arguments, 0, { readNull: true }),
				toRadians = Math.PI / 180,
				shear = new Point(Math.tan(skew.x * toRadians),
					Math.tan(skew.y * toRadians));
			return this.shear(shear, center);
		},

		append: function(mx) {
			if (mx) {
				var a1 = this._a,
					b1 = this._b,
					c1 = this._c,
					d1 = this._d,
					a2 = mx._a,
					b2 = mx._c,
					c2 = mx._b,
					d2 = mx._d,
					tx2 = mx._tx,
					ty2 = mx._ty;
				this._a = a2 * a1 + c2 * c1;
				this._c = b2 * a1 + d2 * c1;
				this._b = a2 * b1 + c2 * d1;
				this._d = b2 * b1 + d2 * d1;
				this._tx += tx2 * a1 + ty2 * c1;
				this._ty += tx2 * b1 + ty2 * d1;
				this._changed();
			}
			return this;
		},

		prepend: function(mx) {
			if (mx) {
				var a1 = this._a,
					b1 = this._b,
					c1 = this._c,
					d1 = this._d,
					tx1 = this._tx,
					ty1 = this._ty,
					a2 = mx._a,
					b2 = mx._c,
					c2 = mx._b,
					d2 = mx._d,
					tx2 = mx._tx,
					ty2 = mx._ty;
				this._a = a2 * a1 + b2 * b1;
				this._c = a2 * c1 + b2 * d1;
				this._b = c2 * a1 + d2 * b1;
				this._d = c2 * c1 + d2 * d1;
				this._tx = a2 * tx1 + b2 * ty1 + tx2;
				this._ty = c2 * tx1 + d2 * ty1 + ty2;
				this._changed();
			}
			return this;
		},

		appended: function(mx) {
			return this.clone().append(mx);
		},

		prepended: function(mx) {
			return this.clone().prepend(mx);
		},

		invert: function() {
			var a = this._a,
				b = this._b,
				c = this._c,
				d = this._d,
				tx = this._tx,
				ty = this._ty,
				det = a * d - b * c,
				res = null;
			if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
				this._a = d / det;
				this._b = -b / det;
				this._c = -c / det;
				this._d = a / det;
				this._tx = (c * ty - d * tx) / det;
				this._ty = (b * tx - a * ty) / det;
				res = this;
			}
			return res;
		},

		inverted: function() {
			return this.clone().invert();
		},

		concatenate: '#append',
		preConcatenate: '#prepend',
		chain: '#appended',

		_shiftless: function() {
			return new Matrix(this._a, this._b, this._c, this._d, 0, 0);
		},

		_orNullIfIdentity: function() {
			return this.isIdentity() ? null : this;
		},

		isIdentity: function() {
			return this._a === 1 && this._b === 0 && this._c === 0 && this._d === 1
					&& this._tx === 0 && this._ty === 0;
		},

		isInvertible: function() {
			var det = this._a * this._d - this._c * this._b;
			return det && !isNaN(det) && isFinite(this._tx) && isFinite(this._ty);
		},

		isSingular: function() {
			return !this.isInvertible();
		},

		transform: function( src, dst, count) {
			return arguments.length < 3
				? this._transformPoint(Point.read(arguments))
				: this._transformCoordinates(src, dst, count);
		},

		_transformPoint: function(point, dest, _dontNotify) {
			var x = point.x,
				y = point.y;
			if (!dest)
				dest = new Point();
			return dest.set(
					x * this._a + y * this._c + this._tx,
					x * this._b + y * this._d + this._ty,
					_dontNotify);
		},

		_transformCoordinates: function(src, dst, count) {
			for (var i = 0, max = 2 * count; i < max; i += 2) {
				var x = src[i],
					y = src[i + 1];
				dst[i] = x * this._a + y * this._c + this._tx;
				dst[i + 1] = x * this._b + y * this._d + this._ty;
			}
			return dst;
		},

		_transformCorners: function(rect) {
			var x1 = rect.x,
				y1 = rect.y,
				x2 = x1 + rect.width,
				y2 = y1 + rect.height,
				coords = [ x1, y1, x2, y1, x2, y2, x1, y2 ];
			return this._transformCoordinates(coords, coords, 4);
		},

		_transformBounds: function(bounds, dest, _dontNotify) {
			var coords = this._transformCorners(bounds),
				min = coords.slice(0, 2),
				max = min.slice();
			for (var i = 2; i < 8; i++) {
				var val = coords[i],
					j = i & 1;
				if (val < min[j]) {
					min[j] = val;
				} else if (val > max[j]) {
					max[j] = val;
				}
			}
			if (!dest)
				dest = new Rectangle();
			return dest.set(min[0], min[1], max[0] - min[0], max[1] - min[1],
					_dontNotify);
		},

		inverseTransform: function() {
			return this._inverseTransform(Point.read(arguments));
		},

		_inverseTransform: function(point, dest, _dontNotify) {
			var a = this._a,
				b = this._b,
				c = this._c,
				d = this._d,
				tx = this._tx,
				ty = this._ty,
				det = a * d - b * c,
				res = null;
			if (det && !isNaN(det) && isFinite(tx) && isFinite(ty)) {
				var x = point.x - this._tx,
					y = point.y - this._ty;
				if (!dest)
					dest = new Point();
				res = dest.set(
						(x * d - y * c) / det,
						(y * a - x * b) / det,
						_dontNotify);
			}
			return res;
		},

		decompose: function() {
			var a = this._a,
				b = this._b,
				c = this._c,
				d = this._d,
				det = a * d - b * c,
				sqrt = Math.sqrt,
				atan2 = Math.atan2,
				degrees = 180 / Math.PI,
				rotate,
				scale,
				skew;
			if (a !== 0 || b !== 0) {
				var r = sqrt(a * a + b * b);
				rotate = Math.acos(a / r) * (b > 0 ? 1 : -1);
				scale = [r, det / r];
				skew = [atan2(a * c + b * d, r * r), 0];
			} else if (c !== 0 || d !== 0) {
				var s = sqrt(c * c + d * d);
				rotate = Math.asin(c / s)  * (d > 0 ? 1 : -1);
				scale = [det / s, s];
				skew = [0, atan2(a * c + b * d, s * s)];
			} else {
				rotate = 0;
				skew = scale = [0, 0];
			}
			return {
				translation: this.getTranslation(),
				rotation: rotate * degrees,
				scaling: new Point(scale),
				skewing: new Point(skew[0] * degrees, skew[1] * degrees)
			};
		},

		getValues: function() {
			return [ this._a, this._b, this._c, this._d, this._tx, this._ty ];
		},

		getTranslation: function() {
			return new Point(this._tx, this._ty);
		},

		getScaling: function() {
			return (this.decompose() || {}).scaling;
		},

		getRotation: function() {
			return (this.decompose() || {}).rotation;
		},

		applyToContext: function(ctx) {
			if (!this.isIdentity()) {
				ctx.transform(this._a, this._b, this._c, this._d,
						this._tx, this._ty);
			}
		}
	}, Base.each(['a', 'b', 'c', 'd', 'tx', 'ty'], function(key) {
		var part = Base.capitalize(key),
			prop = '_' + key;
		this['get' + part] = function() {
			return this[prop];
		};
		this['set' + part] = function(value) {
			this[prop] = value;
			this._changed();
		};
	}, {}));

	var Line = Base.extend({
		_class: 'Line',

		initialize: function Line(arg0, arg1, arg2, arg3, arg4) {
			var asVector = false;
			if (arguments.length >= 4) {
				this._px = arg0;
				this._py = arg1;
				this._vx = arg2;
				this._vy = arg3;
				asVector = arg4;
			} else {
				this._px = arg0.x;
				this._py = arg0.y;
				this._vx = arg1.x;
				this._vy = arg1.y;
				asVector = arg2;
			}
			if (!asVector) {
				this._vx -= this._px;
				this._vy -= this._py;
			}
		},

		getPoint: function() {
			return new Point(this._px, this._py);
		},

		getVector: function() {
			return new Point(this._vx, this._vy);
		},

		getLength: function() {
			return this.getVector().getLength();
		},

		intersect: function(line, isInfinite) {
			return Line.intersect(
					this._px, this._py, this._vx, this._vy,
					line._px, line._py, line._vx, line._vy,
					true, isInfinite);
		},

		getSide: function(point, isInfinite) {
			return Line.getSide(
					this._px, this._py, this._vx, this._vy,
					point.x, point.y, true, isInfinite);
		},

		getDistance: function(point) {
			return Math.abs(Line.getSignedDistance(
					this._px, this._py, this._vx, this._vy,
					point.x, point.y, true));
		},

		isCollinear: function(line) {
			return Point.isCollinear(this._vx, this._vy, line._vx, line._vy);
		},

		isOrthogonal: function(line) {
			return Point.isOrthogonal(this._vx, this._vy, line._vx, line._vy);
		},

		statics: {
			intersect: function(p1x, p1y, v1x, v1y, p2x, p2y, v2x, v2y, asVector,
					isInfinite) {
				if (!asVector) {
					v1x -= p1x;
					v1y -= p1y;
					v2x -= p2x;
					v2y -= p2y;
				}
				var cross = v1x * v2y - v1y * v2x;
				if (!Numerical.isZero(cross)) {
					var dx = p1x - p2x,
						dy = p1y - p2y,
						u1 = (v2x * dy - v2y * dx) / cross,
						u2 = (v1x * dy - v1y * dx) / cross,
						epsilon = 1e-12,
						uMin = -epsilon,
						uMax = 1 + epsilon;
					if (isInfinite
							|| uMin < u1 && u1 < uMax && uMin < u2 && u2 < uMax) {
						if (!isInfinite) {
							u1 = u1 <= 0 ? 0 : u1 >= 1 ? 1 : u1;
						}
						return new Point(
								p1x + u1 * v1x,
								p1y + u1 * v1y);
					}
				}
			},

			getSide: function(px, py, vx, vy, x, y, asVector, isInfinite) {
				if (!asVector) {
					vx -= px;
					vy -= py;
				}
				var v2x = x - px,
					v2y = y - py,
					ccw = v2x * vy - v2y * vx;
				if (ccw === 0 && !isInfinite) {
					ccw = (v2x * vx + v2x * vx) / (vx * vx + vy * vy);
					if (ccw >= 0 && ccw <= 1)
						ccw = 0;
				}
				return ccw < 0 ? -1 : ccw > 0 ? 1 : 0;
			},

			getSignedDistance: function(px, py, vx, vy, x, y, asVector) {
				if (!asVector) {
					vx -= px;
					vy -= py;
				}
				return vx === 0 ? vy > 0 ? x - px : px - x
					 : vy === 0 ? vx < 0 ? y - py : py - y
					 : ((x-px) * vy - (y-py) * vx) / Math.sqrt(vx * vx + vy * vy);
			}
		}
	});

	var Project = PaperScopeItem.extend({
		_class: 'Project',
		_list: 'projects',
		_reference: 'project',
		_compactSerialize: true,

		initialize: function Project(element) {
			PaperScopeItem.call(this, true);
			this._children = [];
			this._namedChildren = {};
			this._activeLayer = null;
			this._currentStyle = new Style(null, null, this);
			this._view = View.create(this,
					element || CanvasProvider.getCanvas(1, 1));
			this._selectionItems = {};
			this._selectionCount = 0;
			this._updateVersion = 0;
		},

		_serialize: function(options, dictionary) {
			return Base.serialize(this._children, options, true, dictionary);
		},

		_changed: function(flags, item) {
			if (flags & 1) {
				var view = this._view;
				if (view) {
					view._needsUpdate = true;
					if (!view._requested && view._autoUpdate)
						view.requestUpdate();
				}
			}
			var changes = this._changes;
			if (changes && item) {
				var changesById = this._changesById,
					id = item._id,
					entry = changesById[id];
				if (entry) {
					entry.flags |= flags;
				} else {
					changes.push(changesById[id] = { item: item, flags: flags });
				}
			}
		},

		clear: function() {
			var children = this._children;
			for (var i = children.length - 1; i >= 0; i--)
				children[i].remove();
		},

		isEmpty: function() {
			return this._children.length === 0;
		},

		remove: function remove() {
			if (!remove.base.call(this))
				return false;
			if (this._view)
				this._view.remove();
			return true;
		},

		getView: function() {
			return this._view;
		},

		getCurrentStyle: function() {
			return this._currentStyle;
		},

		setCurrentStyle: function(style) {
			this._currentStyle.initialize(style);
		},

		getIndex: function() {
			return this._index;
		},

		getOptions: function() {
			return this._scope.settings;
		},

		getLayers: function() {
			return this._children;
		},

		getActiveLayer: function() {
			return this._activeLayer || new Layer({ project: this, insert: true });
		},

		getSymbolDefinitions: function() {
			var definitions = [],
				ids = {};
			this.getItems({
				class: SymbolItem,
				match: function(item) {
					var definition = item._definition,
						id = definition._id;
					if (!ids[id]) {
						ids[id] = true;
						definitions.push(definition);
					}
					return false;
				}
			});
			return definitions;
		},

		getSymbols: 'getSymbolDefinitions',

		getSelectedItems: function() {
			var selectionItems = this._selectionItems,
				items = [];
			for (var id in selectionItems) {
				var item = selectionItems[id],
					selection = item._selection;
				if (selection & 1 && item.isInserted()) {
					items.push(item);
				} else if (!selection) {
					this._updateSelection(item);
				}
			}
			return items;
		},

		_updateSelection: function(item) {
			var id = item._id,
				selectionItems = this._selectionItems;
			if (item._selection) {
				if (selectionItems[id] !== item) {
					this._selectionCount++;
					selectionItems[id] = item;
				}
			} else if (selectionItems[id] === item) {
				this._selectionCount--;
				delete selectionItems[id];
			}
		},

		selectAll: function() {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++)
				children[i].setFullySelected(true);
		},

		deselectAll: function() {
			var selectionItems = this._selectionItems;
			for (var i in selectionItems)
				selectionItems[i].setFullySelected(false);
		},

		addLayer: function(layer) {
			return this.insertLayer(undefined, layer);
		},

		insertLayer: function(index, layer) {
			if (layer instanceof Layer) {
				layer._remove(false, true);
				Base.splice(this._children, [layer], index, 0);
				layer._setProject(this, true);
				var name = layer._name;
				if (name)
					layer.setName(name);
				if (this._changes)
					layer._changed(5);
				if (!this._activeLayer)
					this._activeLayer = layer;
			} else {
				layer = null;
			}
			return layer;
		},

		_insertItem: function(index, item, _preserve, _created) {
			item = this.insertLayer(index, item)
					|| (this._activeLayer || this._insertItem(undefined,
							new Layer(Item.NO_INSERT), true, true))
							.insertChild(index, item, _preserve);
			if (_created && item.activate)
				item.activate();
			return item;
		},

		getItems: function(options) {
			return Item._getItems(this, options);
		},

		getItem: function(options) {
			return Item._getItems(this, options, null, null, true)[0] || null;
		},

		importJSON: function(json) {
			this.activate();
			var layer = this._activeLayer;
			return Base.importJSON(json, layer && layer.isEmpty() && layer);
		},

		removeOn: function(type) {
			var sets = this._removeSets;
			if (sets) {
				if (type === 'mouseup')
					sets.mousedrag = null;
				var set = sets[type];
				if (set) {
					for (var id in set) {
						var item = set[id];
						for (var key in sets) {
							var other = sets[key];
							if (other && other != set)
								delete other[item._id];
						}
						item.remove();
					}
					sets[type] = null;
				}
			}
		},

		draw: function(ctx, matrix, pixelRatio) {
			this._updateVersion++;
			ctx.save();
			matrix.applyToContext(ctx);
			var children = this._children,
				param = new Base({
					offset: new Point(0, 0),
					pixelRatio: pixelRatio,
					viewMatrix: matrix.isIdentity() ? null : matrix,
					matrices: [new Matrix()],
					updateMatrix: true
				});
			for (var i = 0, l = children.length; i < l; i++) {
				children[i].draw(ctx, param);
			}
			ctx.restore();

			if (this._selectionCount > 0) {
				ctx.save();
				ctx.strokeWidth = 1;
				var items = this._selectionItems,
					size = this._scope.settings.handleSize,
					version = this._updateVersion;
				for (var id in items) {
					items[id]._drawSelection(ctx, matrix, size, items, version);
				}
				ctx.restore();
			}
		}
	});

	var Item = Base.extend(Emitter, {
		statics: {
			extend: function extend(src) {
				if (src._serializeFields)
					src._serializeFields = Base.set({},
						this.prototype._serializeFields, src._serializeFields);
				return extend.base.apply(this, arguments);
			},

			NO_INSERT: { insert: false }
		},

		_class: 'Item',
		_name: null,
		_applyMatrix: true,
		_canApplyMatrix: true,
		_canScaleStroke: false,
		_pivot: null,
		_visible: true,
		_blendMode: 'normal',
		_opacity: 1,
		_locked: false,
		_guide: false,
		_clipMask: false,
		_selection: 0,
		_selectBounds: true,
		_selectChildren: false,
		_serializeFields: {
			name: null,
			applyMatrix: null,
			matrix: new Matrix(),
			pivot: null,
			visible: true,
			blendMode: 'normal',
			opacity: 1,
			locked: false,
			guide: false,
			clipMask: false,
			selected: false,
			data: {}
		}
	},
	new function() {
		var handlers = ['onMouseDown', 'onMouseUp', 'onMouseDrag', 'onClick',
				'onDoubleClick', 'onMouseMove', 'onMouseEnter', 'onMouseLeave'];
		return Base.each(handlers,
			function(name) {
				this._events[name] = {
					install: function(type) {
						this.getView()._countItemEvent(type, 1);
					},

					uninstall: function(type) {
						this.getView()._countItemEvent(type, -1);
					}
				};
			}, {
				_events: {
					onFrame: {
						install: function() {
							this.getView()._animateItem(this, true);
						},

						uninstall: function() {
							this.getView()._animateItem(this, false);
						}
					},

					onLoad: {},
					onError: {}
				},
				statics: {
					_itemHandlers: handlers
				}
			}
		);
	}, {
		initialize: function Item() {
		},

		_initialize: function(props, point) {
			var hasProps = props && Base.isPlainObject(props),
				internal = hasProps && props.internal === true,
				matrix = this._matrix = new Matrix(),
				project = hasProps && props.project || paper.project,
				settings = paper.settings;
			this._id = internal ? null : UID.get();
			this._parent = this._index = null;
			this._applyMatrix = this._canApplyMatrix && settings.applyMatrix;
			if (point)
				matrix.translate(point);
			matrix._owner = this;
			this._style = new Style(project._currentStyle, this, project);
			if (internal || hasProps && props.insert === false
				|| !settings.insertItems && !(hasProps && props.insert === true)) {
				this._setProject(project);
			} else {
				(hasProps && props.parent || project)
						._insertItem(undefined, this, true, true);
			}
			if (hasProps && props !== Item.NO_INSERT) {
				Base.filter(this, props, {
					internal: true, insert: true, project: true, parent: true
				});
			}
			return hasProps;
		},

		_serialize: function(options, dictionary) {
			var props = {},
				that = this;

			function serialize(fields) {
				for (var key in fields) {
					var value = that[key];
					if (!Base.equals(value, key === 'leading'
							? fields.fontSize * 1.2 : fields[key])) {
						props[key] = Base.serialize(value, options,
								key !== 'data', dictionary);
					}
				}
			}

			serialize(this._serializeFields);
			if (!(this instanceof Group))
				serialize(this._style._defaults);
			return [ this._class, props ];
		},

		_changed: function(flags) {
			var symbol = this._symbol,
				cacheParent = this._parent || symbol,
				project = this._project;
			if (flags & 8) {
				this._bounds = this._position = this._decomposed =
						this._globalMatrix = undefined;
			}
			if (cacheParent
					&& (flags & 40)) {
				Item._clearBoundsCache(cacheParent);
			}
			if (flags & 2) {
				Item._clearBoundsCache(this);
			}
			if (project)
				project._changed(flags, this);
			if (symbol)
				symbol._changed(flags);
		},

		set: function(props) {
			if (props)
				this._set(props);
			return this;
		},

		getId: function() {
			return this._id;
		},

		getName: function() {
			return this._name;
		},

		setName: function(name) {

			if (this._name)
				this._removeNamed();
			if (name === (+name) + '')
				throw new Error(
						'Names consisting only of numbers are not supported.');
			var owner = this._getOwner();
			if (name && owner) {
				var children = owner._children,
					namedChildren = owner._namedChildren;
				(namedChildren[name] = namedChildren[name] || []).push(this);
				if (!(name in children))
					children[name] = this;
			}
			this._name = name || undefined;
			this._changed(128);
		},

		getStyle: function() {
			return this._style;
		},

		setStyle: function(style) {
			this.getStyle().set(style);
		}
	}, Base.each(['locked', 'visible', 'blendMode', 'opacity', 'guide'],
		function(name) {
			var part = Base.capitalize(name),
				name = '_' + name;
			this['get' + part] = function() {
				return this[name];
			};
			this['set' + part] = function(value) {
				if (value != this[name]) {
					this[name] = value;
					this._changed(name === '_locked'
							? 128 : 129);
				}
			};
		},
	{}), {
		beans: true,

		getSelection: function() {
			return this._selection;
		},

		setSelection: function(selection) {
			if (selection !== this._selection) {
				this._selection = selection;
				var project = this._project;
				if (project) {
					project._updateSelection(this);
					this._changed(129);
				}
			}
		},

		changeSelection: function(flag, selected) {
			var selection = this._selection;
			this.setSelection(selected ? selection | flag : selection & ~flag);
		},

		isSelected: function() {
			if (this._selectChildren) {
				var children = this._children;
				for (var i = 0, l = children.length; i < l; i++)
					if (children[i].isSelected())
						return true;
			}
			return !!(this._selection & 1);
		},

		setSelected: function(selected) {
			if (this._selectChildren) {
				var children = this._children;
				for (var i = 0, l = children.length; i < l; i++)
					children[i].setSelected(selected);
			}
			this.changeSelection(1, selected);
		},

		isFullySelected: function() {
			var children = this._children,
				selected = !!(this._selection & 1);
			if (children && selected) {
				for (var i = 0, l = children.length; i < l; i++)
					if (!children[i].isFullySelected())
						return false;
				return true;
			}
			return selected;
		},

		setFullySelected: function(selected) {
			var children = this._children;
			if (children) {
				for (var i = 0, l = children.length; i < l; i++)
					children[i].setFullySelected(selected);
			}
			this.changeSelection(1, selected);
		},

		isClipMask: function() {
			return this._clipMask;
		},

		setClipMask: function(clipMask) {
			if (this._clipMask != (clipMask = !!clipMask)) {
				this._clipMask = clipMask;
				if (clipMask) {
					this.setFillColor(null);
					this.setStrokeColor(null);
				}
				this._changed(129);
				if (this._parent)
					this._parent._changed(1024);
			}
		},

		getData: function() {
			if (!this._data)
				this._data = {};
			return this._data;
		},

		setData: function(data) {
			this._data = data;
		},

		getPosition: function(_dontLink) {
			var position = this._position,
				ctor = _dontLink ? Point : LinkedPoint;
			if (!position) {
				var pivot = this._pivot;
				position = this._position = pivot
						? this._matrix._transformPoint(pivot)
						: this.getBounds().getCenter(true);
			}
			return new ctor(position.x, position.y, this, 'setPosition');
		},

		setPosition: function() {
			this.translate(Point.read(arguments).subtract(this.getPosition(true)));
		},

		getPivot: function(_dontLink) {
			var pivot = this._pivot;
			if (pivot) {
				var ctor = _dontLink ? Point : LinkedPoint;
				pivot = new ctor(pivot.x, pivot.y, this, 'setPivot');
			}
			return pivot;
		},

		setPivot: function() {
			this._pivot = Point.read(arguments, 0, { clone: true, readNull: true });
			this._position = undefined;
		}
	}, Base.each({
			getStrokeBounds: { stroke: true },
			getHandleBounds: { handle: true },
			getInternalBounds: { internal: true }
		},
		function(options, key) {
			this[key] = function(matrix) {
				return this.getBounds(matrix, options);
			};
		},
	{
		beans: true,

		getBounds: function(matrix, options) {
			var hasMatrix = options || matrix instanceof Matrix,
				opts = Base.set({}, hasMatrix ? options : matrix,
						this._boundsOptions);
			if (!opts.stroke || this.getStrokeScaling())
				opts.cacheItem = this;
			var bounds = this._getCachedBounds(hasMatrix && matrix, opts);
			return arguments.length === 0
					? new LinkedRectangle(bounds.x, bounds.y, bounds.width,
							bounds.height, this, 'setBounds')
					: bounds;
		},

		setBounds: function() {
			var rect = Rectangle.read(arguments),
				bounds = this.getBounds(),
				_matrix = this._matrix,
				matrix = new Matrix(),
				center = rect.getCenter();
			matrix.translate(center);
			if (rect.width != bounds.width || rect.height != bounds.height) {
				if (!_matrix.isInvertible()) {
					_matrix.initialize(_matrix._backup
							|| new Matrix().translate(_matrix.getTranslation()));
					bounds = this.getBounds();
				}
				matrix.scale(
						bounds.width !== 0 ? rect.width / bounds.width : 0,
						bounds.height !== 0 ? rect.height / bounds.height : 0);
			}
			center = bounds.getCenter();
			matrix.translate(-center.x, -center.y);
			this.transform(matrix);
		},

		_getBounds: function(matrix, options) {
			var children = this._children;
			if (!children || children.length === 0)
				return new Rectangle();
			Item._updateBoundsCache(this, options.cacheItem);
			return Item._getBounds(children, matrix, options);
		},

		_getCachedBounds: function(matrix, options) {
			matrix = matrix && matrix._orNullIfIdentity();
			var internal = options.internal,
				cacheItem = options.cacheItem,
				_matrix = internal ? null : this._matrix._orNullIfIdentity(),
				cacheKey = cacheItem && (!matrix || matrix.equals(_matrix)) && [
					options.stroke ? 1 : 0,
					options.handle ? 1 : 0,
					internal ? 1 : 0
				].join('');
			Item._updateBoundsCache(this._parent || this._symbol, cacheItem);
			if (cacheKey && this._bounds && cacheKey in this._bounds)
				return this._bounds[cacheKey].rect.clone();
			var bounds = this._getBounds(matrix || _matrix, options);
			if (cacheKey) {
				if (!this._bounds)
					this._bounds = {};
				var cached = this._bounds[cacheKey] = {
					rect: bounds.clone(),
					internal: options.internal
				};
			}
			return bounds;
		},

		_getStrokeMatrix: function(matrix, options) {
			var parent = this.getStrokeScaling() ? null
					: options && options.internal ? this
						: this._parent || this._symbol && this._symbol._item,
				mx = parent ? parent.getViewMatrix().invert() : matrix;
			return mx && mx._shiftless();
		},

		statics: {
			_updateBoundsCache: function(parent, item) {
				if (parent && item) {
					var id = item._id,
						ref = parent._boundsCache = parent._boundsCache || {
							ids: {},
							list: []
						};
					if (!ref.ids[id]) {
						ref.list.push(item);
						ref.ids[id] = item;
					}
				}
			},

			_clearBoundsCache: function(item) {
				var cache = item._boundsCache;
				if (cache) {
					item._bounds = item._position = item._boundsCache = undefined;
					for (var i = 0, list = cache.list, l = list.length; i < l; i++){
						var other = list[i];
						if (other !== item) {
							other._bounds = other._position = undefined;
							if (other._boundsCache)
								Item._clearBoundsCache(other);
						}
					}
				}
			},

			_getBounds: function(items, matrix, options) {
				var x1 = Infinity,
					x2 = -x1,
					y1 = x1,
					y2 = x2;
				options = options || {};
				for (var i = 0, l = items.length; i < l; i++) {
					var item = items[i];
					if (item._visible && !item.isEmpty()) {
						var rect = item._getCachedBounds(
							matrix && matrix.appended(item._matrix), options);
						x1 = Math.min(rect.x, x1);
						y1 = Math.min(rect.y, y1);
						x2 = Math.max(rect.x + rect.width, x2);
						y2 = Math.max(rect.y + rect.height, y2);
					}
				}
				return isFinite(x1)
						? new Rectangle(x1, y1, x2 - x1, y2 - y1)
						: new Rectangle();
			}
		}

	}), {
		beans: true,

		_decompose: function() {
			return this._decomposed || (this._decomposed = this._matrix.decompose());
		},

		getRotation: function() {
			var decomposed = this._decompose();
			return decomposed && decomposed.rotation;
		},

		setRotation: function(rotation) {
			var current = this.getRotation();
			if (current != null && rotation != null) {
				this.rotate(rotation - current);
			}
		},

		getScaling: function(_dontLink) {
			var decomposed = this._decompose(),
				scaling = decomposed && decomposed.scaling,
				ctor = _dontLink ? Point : LinkedPoint;
			return scaling && new ctor(scaling.x, scaling.y, this, 'setScaling');
		},

		setScaling: function() {
			var current = this.getScaling(),
				scaling = Point.read(arguments, 0, { clone: true, readNull: true });
			if (current && scaling) {
				this.scale(scaling.x / current.x, scaling.y / current.y);
			}
		},

		getMatrix: function() {
			return this._matrix;
		},

		setMatrix: function() {
			var matrix = this._matrix;
			matrix.initialize.apply(matrix, arguments);
		},

		getGlobalMatrix: function(_dontClone) {
			var matrix = this._globalMatrix,
				updateVersion = this._project._updateVersion;
			if (matrix && matrix._updateVersion !== updateVersion)
				matrix = null;
			if (!matrix) {
				matrix = this._globalMatrix = this._matrix.clone();
				var parent = this._parent;
				if (parent)
					matrix.prepend(parent.getGlobalMatrix(true));
				matrix._updateVersion = updateVersion;
			}
			return _dontClone ? matrix : matrix.clone();
		},

		getViewMatrix: function() {
			return this.getGlobalMatrix().prepend(this.getView()._matrix);
		},

		getApplyMatrix: function() {
			return this._applyMatrix;
		},

		setApplyMatrix: function(apply) {
			if (this._applyMatrix = this._canApplyMatrix && !!apply)
				this.transform(null, true);
		},

		getTransformContent: '#getApplyMatrix',
		setTransformContent: '#setApplyMatrix',
	}, {
		getProject: function() {
			return this._project;
		},

		_setProject: function(project, installEvents) {
			if (this._project !== project) {
				if (this._project)
					this._installEvents(false);
				this._project = project;
				var children = this._children;
				for (var i = 0, l = children && children.length; i < l; i++)
					children[i]._setProject(project);
				installEvents = true;
			}
			if (installEvents)
				this._installEvents(true);
		},

		getView: function() {
			return this._project._view;
		},

		_installEvents: function _installEvents(install) {
			_installEvents.base.call(this, install);
			var children = this._children;
			for (var i = 0, l = children && children.length; i < l; i++)
				children[i]._installEvents(install);
		},

		getLayer: function() {
			var parent = this;
			while (parent = parent._parent) {
				if (parent instanceof Layer)
					return parent;
			}
			return null;
		},

		getParent: function() {
			return this._parent;
		},

		setParent: function(item) {
			return item.addChild(this);
		},

		_getOwner: '#getParent',

		getChildren: function() {
			return this._children;
		},

		setChildren: function(items, _preserve) {
			this.removeChildren();
			this.addChildren(items, _preserve);
		},

		getFirstChild: function() {
			return this._children && this._children[0] || null;
		},

		getLastChild: function() {
			return this._children && this._children[this._children.length - 1]
					|| null;
		},

		getNextSibling: function() {
			var owner = this._getOwner();
			return owner && owner._children[this._index + 1] || null;
		},

		getPreviousSibling: function() {
			var owner = this._getOwner();
			return owner && owner._children[this._index - 1] || null;
		},

		getIndex: function() {
			return this._index;
		},

		equals: function(item) {
			return item === this || item && this._class === item._class
					&& this._style.equals(item._style)
					&& this._matrix.equals(item._matrix)
					&& this._locked === item._locked
					&& this._visible === item._visible
					&& this._blendMode === item._blendMode
					&& this._opacity === item._opacity
					&& this._clipMask === item._clipMask
					&& this._guide === item._guide
					&& this._equals(item)
					|| false;
		},

		_equals: function(item) {
			return Base.equals(this._children, item._children);
		},

		clone: function(options) {
			var copy = new this.constructor(Item.NO_INSERT),
				children = this._children,
				insert = Base.pick(options ? options.insert : undefined,
						options === undefined || options === true),
				deep = Base.pick(options ? options.deep : undefined, true);
			if (children)
				copy.copyAttributes(this);
			if (!children || deep)
				copy.copyContent(this);
			if (!children)
				copy.copyAttributes(this);
			if (insert)
				copy.insertAbove(this);
			var name = this._name,
				parent = this._parent;
			if (name && parent) {
				var children = parent._children,
					orig = name,
					i = 1;
				while (children[name])
					name = orig + ' ' + (i++);
				if (name !== orig)
					copy.setName(name);
			}
			return copy;
		},

		copyContent: function(source) {
			var children = source._children;
			for (var i = 0, l = children && children.length; i < l; i++) {
				this.addChild(children[i].clone(false), true);
			}
		},

		copyAttributes: function(source, excludeMatrix) {
			this.setStyle(source._style);
			var keys = ['_locked', '_visible', '_blendMode', '_opacity',
					'_clipMask', '_guide'];
			for (var i = 0, l = keys.length; i < l; i++) {
				var key = keys[i];
				if (source.hasOwnProperty(key))
					this[key] = source[key];
			}
			if (!excludeMatrix)
				this._matrix.initialize(source._matrix);
			this.setApplyMatrix(source._applyMatrix);
			this.setPivot(source._pivot);
			this.setSelection(source._selection);
			var data = source._data,
				name = source._name;
			this._data = data ? Base.clone(data) : null;
			if (name)
				this.setName(name);
		},

		rasterize: function(resolution, insert) {
			var bounds = this.getStrokeBounds(),
				scale = (resolution || this.getView().getResolution()) / 72,
				topLeft = bounds.getTopLeft().floor(),
				bottomRight = bounds.getBottomRight().ceil(),
				size = new Size(bottomRight.subtract(topLeft)),
				raster = new Raster(Item.NO_INSERT);
			if (!size.isZero()) {
				var canvas = CanvasProvider.getCanvas(size.multiply(scale)),
					ctx = canvas.getContext('2d'),
					matrix = new Matrix().scale(scale).translate(topLeft.negate());
				ctx.save();
				matrix.applyToContext(ctx);
				this.draw(ctx, new Base({ matrices: [matrix] }));
				ctx.restore();
				raster.setCanvas(canvas);
			}
			raster.transform(new Matrix().translate(topLeft.add(size.divide(2)))
					.scale(1 / scale));
			if (insert === undefined || insert)
				raster.insertAbove(this);
			return raster;
		},

		contains: function() {
			return !!this._contains(
					this._matrix._inverseTransform(Point.read(arguments)));
		},

		_contains: function(point) {
			var children = this._children;
			if (children) {
				for (var i = children.length - 1; i >= 0; i--) {
					if (children[i].contains(point))
						return true;
				}
				return false;
			}
			return point.isInside(this.getInternalBounds());
		},

		isInside: function() {
			return Rectangle.read(arguments).contains(this.getBounds());
		},

		_asPathItem: function() {
			return new Path.Rectangle({
				rectangle: this.getInternalBounds(),
				matrix: this._matrix,
				insert: false,
			});
		},

		intersects: function(item, _matrix) {
			if (!(item instanceof Item))
				return false;
			return this._asPathItem().getIntersections(item._asPathItem(), null,
					_matrix, true).length > 0;
		}
	},
	new function() {
		function hitTest() {
			return this._hitTest(
					Point.read(arguments),
					HitResult.getOptions(arguments));
		}

		function hitTestAll() {
			var point = Point.read(arguments),
				options = HitResult.getOptions(arguments),
				callback = options.match,
				results = [];
			options = Base.set({}, options, {
				match: function(hit) {
					if (!callback || callback(hit))
						results.push(hit);
				}
			});
			this._hitTest(point, options);
			return results;
		}

		function hitTestChildren(point, options, viewMatrix, _exclude) {
			var children = this._children;
			if (children) {
				for (var i = children.length - 1; i >= 0; i--) {
					var child = children[i];
					var res = child !== _exclude && child._hitTest(point, options,
							viewMatrix);
					if (res)
						return res;
				}
			}
			return null;
		}

		Project.inject({
			hitTest: hitTest,
			hitTestAll: hitTestAll,
			_hitTest: hitTestChildren
		});

		return {
			hitTest: hitTest,
			hitTestAll: hitTestAll,
			_hitTestChildren: hitTestChildren,
		};
	}, {

		_hitTest: function(point, options, parentViewMatrix) {
			if (this._locked || !this._visible || this._guide && !options.guides
					|| this.isEmpty()) {
				return null;
			}

			var matrix = this._matrix,
				viewMatrix = parentViewMatrix
						? parentViewMatrix.appended(matrix)
						: this.getGlobalMatrix().prepend(this.getView()._matrix),
				strokeMatrix = this.getStrokeScaling()
						? null
						: viewMatrix.inverted()._shiftless(),
				tolerance = Math.max(options.tolerance, 1e-6),
				tolerancePadding = options._tolerancePadding = new Size(
						Path._getStrokePadding(tolerance, strokeMatrix));
			point = matrix._inverseTransform(point);
			if (!point || !this._children &&
				!this.getBounds({ internal: true, stroke: true, handle: true })
					.expand(tolerancePadding.multiply(2))._containsPoint(point)) {
				return null;
			}

			var checkSelf = !(options.guides && !this._guide
					|| options.selected && !this.isSelected()
					|| options.type && options.type !== Base.hyphenate(this._class)
					|| options.class && !(this instanceof options.class)),
				callback = options.match,
				that = this,
				bounds,
				res;

			function match(hit) {
				return !callback || hit && callback(hit) ? hit : null;
			}

			function checkBounds(type, part) {
				var pt = bounds['get' + part]();
				if (point.subtract(pt).divide(tolerancePadding).length <= 1) {
					return new HitResult(type, that,
							{ name: Base.hyphenate(part), point: pt });
				}
			}

			if (checkSelf && (options.center || options.bounds) && this._parent) {
				bounds = this.getInternalBounds();
				if (options.center) {
					res = checkBounds('center', 'Center');
				}
				if (!res && options.bounds) {
					var points = [
						'TopLeft', 'TopRight', 'BottomLeft', 'BottomRight',
						'LeftCenter', 'TopCenter', 'RightCenter', 'BottomCenter'
					];
					for (var i = 0; i < 8 && !res; i++) {
						res = checkBounds('bounds', points[i]);
					}
				}
				res = match(res);
			}

			if (!res) {
				res = this._hitTestChildren(point, options, viewMatrix)
					|| checkSelf
						&& match(this._hitTestSelf(point, options, viewMatrix,
							strokeMatrix))
					|| null;
			}
			if (res && res.point) {
				res.point = matrix.transform(res.point);
			}
			return res;
		},

		_hitTestSelf: function(point, options) {
			if (options.fill && this.hasFill() && this._contains(point))
				return new HitResult('fill', this);
		},

		matches: function(name, compare) {
			function matchObject(obj1, obj2) {
				for (var i in obj1) {
					if (obj1.hasOwnProperty(i)) {
						var val1 = obj1[i],
							val2 = obj2[i];
						if (Base.isPlainObject(val1) && Base.isPlainObject(val2)) {
							if (!matchObject(val1, val2))
								return false;
						} else if (!Base.equals(val1, val2)) {
							return false;
						}
					}
				}
				return true;
			}
			var type = typeof name;
			if (type === 'object') {
				for (var key in name) {
					if (name.hasOwnProperty(key) && !this.matches(key, name[key]))
						return false;
				}
				return true;
			} else if (type === 'function') {
				return name(this);
			} else if (name === 'match') {
				return compare(this);
			} else {
				var value = /^(empty|editable)$/.test(name)
						? this['is' + Base.capitalize(name)]()
						: name === 'type'
							? Base.hyphenate(this._class)
							: this[name];
				if (name === 'class') {
					if (typeof compare === 'function')
						return this instanceof compare;
					value = this._class;
				}
				if (typeof compare === 'function') {
					return !!compare(value);
				} else if (compare) {
					if (compare.test) {
						return compare.test(value);
					} else if (Base.isPlainObject(compare)) {
						return matchObject(compare, value);
					}
				}
				return Base.equals(value, compare);
			}
		},

		getItems: function(options) {
			return Item._getItems(this, options, this._matrix);
		},

		getItem: function(options) {
			return Item._getItems(this, options, this._matrix, null, true)[0]
					|| null;
		},

		statics: {
			_getItems: function _getItems(item, options, matrix, param, firstOnly) {
				if (!param) {
					var obj = typeof options === 'object' && options,
						overlapping = obj && obj.overlapping,
						inside = obj && obj.inside,
						bounds = overlapping || inside,
						rect = bounds && Rectangle.read([bounds]);
					param = {
						items: [],
						recursive: obj && obj.recursive !== false,
						inside: !!inside,
						overlapping: !!overlapping,
						rect: rect,
						path: overlapping && new Path.Rectangle({
							rectangle: rect,
							insert: false
						})
					};
					if (obj) {
						options = Base.filter({}, options, {
							recursive: true, inside: true, overlapping: true
						});
					}
				}
				var children = item._children,
					items = param.items,
					rect = param.rect;
				matrix = rect && (matrix || new Matrix());
				for (var i = 0, l = children && children.length; i < l; i++) {
					var child = children[i],
						childMatrix = matrix && matrix.appended(child._matrix),
						add = true;
					if (rect) {
						var bounds = child.getBounds(childMatrix);
						if (!rect.intersects(bounds))
							continue;
						if (!(rect.contains(bounds)
								|| param.overlapping && (bounds.contains(rect)
									|| param.path.intersects(child, childMatrix))))
							add = false;
					}
					if (add && child.matches(options)) {
						items.push(child);
						if (firstOnly)
							break;
					}
					if (param.recursive !== false) {
						_getItems(child, options, childMatrix, param, firstOnly);
					}
					if (firstOnly && items.length > 0)
						break;
				}
				return items;
			}
		}
	}, {

		importJSON: function(json) {
			var res = Base.importJSON(json, this);
			return res !== this ? this.addChild(res) : res;
		},

		addChild: function(item, _preserve) {
			return this.insertChild(undefined, item, _preserve);
		},

		insertChild: function(index, item, _preserve) {
			var res = item ? this.insertChildren(index, [item], _preserve) : null;
			return res && res[0];
		},

		addChildren: function(items, _preserve) {
			return this.insertChildren(this._children.length, items, _preserve);
		},

		insertChildren: function(index, items, _preserve, _proto) {
			var children = this._children;
			if (children && items && items.length > 0) {
				items = Array.prototype.slice.apply(items);
				for (var i = items.length - 1; i >= 0; i--) {
					var item = items[i];
					if (!item || _proto && !(item instanceof _proto)) {
						items.splice(i, 1);
					} else {
						item._remove(false, true);
					}
				}
				Base.splice(children, items, index, 0);
				var project = this._project,
					notifySelf = project._changes;
				for (var i = 0, l = items.length; i < l; i++) {
					var item = items[i],
						name = item._name;
					item._parent = this;
					item._setProject(project, true);
					if (name)
						item.setName(name);
					if (notifySelf)
						this._changed(5);
				}
				this._changed(11);
			} else {
				items = null;
			}
			return items;
		},

		_insertItem: '#insertChild',

		_insertAt: function(item, offset, _preserve) {
			var res = this;
			if (res !== item) {
				var owner = item && item._getOwner();
				if (owner) {
					res._remove(false, true);
					owner._insertItem(item._index + offset, res, _preserve);
				} else {
					res = null;
				}
			}
			return res;
		},

		insertAbove: function(item, _preserve) {
			return this._insertAt(item, 1, _preserve);
		},

		insertBelow: function(item, _preserve) {
			return this._insertAt(item, 0, _preserve);
		},

		sendToBack: function() {
			var owner = this._getOwner();
			return owner ? owner._insertItem(0, this) : null;
		},

		bringToFront: function() {
			var owner = this._getOwner();
			return owner ? owner._insertItem(undefined, this) : null;
		},

		appendTop: '#addChild',

		appendBottom: function(item) {
			return this.insertChild(0, item);
		},

		moveAbove: '#insertAbove',

		moveBelow: '#insertBelow',

		copyTo: function(owner) {
			return owner._insertItem(undefined, this.clone(false));
		},

		reduce: function(options) {
			var children = this._children;
			if (children && children.length === 1) {
				var child = children[0].reduce(options);
				if (this._parent) {
					child.insertAbove(this);
					this.remove();
				} else {
					child.remove();
				}
				return child;
			}
			return this;
		},

		_removeNamed: function() {
			var owner = this._getOwner();
			if (owner) {
				var children = owner._children,
					namedChildren = owner._namedChildren,
					name = this._name,
					namedArray = namedChildren[name],
					index = namedArray ? namedArray.indexOf(this) : -1;
				if (index !== -1) {
					if (children[name] == this)
						delete children[name];
					namedArray.splice(index, 1);
					if (namedArray.length) {
						children[name] = namedArray[0];
					} else {
						delete namedChildren[name];
					}
				}
			}
		},

		_remove: function(notifySelf, notifyParent) {
			var owner = this._getOwner(),
				project = this._project,
				index = this._index;
			if (owner) {
				if (index != null) {
					if (project._activeLayer === this)
						project._activeLayer = this.getNextSibling()
								|| this.getPreviousSibling();
					Base.splice(owner._children, null, index, 1);
				}
				if (this._name)
					this._removeNamed();
				this._installEvents(false);
				if (notifySelf && project._changes)
					this._changed(5);
				if (notifyParent)
					owner._changed(11, this);
				this._parent = null;
				return true;
			}
			return false;
		},

		remove: function() {
			return this._remove(true, true);
		},

		replaceWith: function(item) {
			var ok = item && item.insertBelow(this);
			if (ok)
				this.remove();
			return ok;
		},

		removeChildren: function(start, end) {
			if (!this._children)
				return null;
			start = start || 0;
			end = Base.pick(end, this._children.length);
			var removed = Base.splice(this._children, null, start, end - start);
			for (var i = removed.length - 1; i >= 0; i--) {
				removed[i]._remove(true, false);
			}
			if (removed.length > 0)
				this._changed(11);
			return removed;
		},

		clear: '#removeChildren',

		reverseChildren: function() {
			if (this._children) {
				this._children.reverse();
				for (var i = 0, l = this._children.length; i < l; i++)
					this._children[i]._index = i;
				this._changed(11);
			}
		},

		isEmpty: function() {
			return !this._children || this._children.length === 0;
		},

		isEditable: function() {
			var item = this;
			while (item) {
				if (!item._visible || item._locked)
					return false;
				item = item._parent;
			}
			return true;
		},

		hasFill: function() {
			return this.getStyle().hasFill();
		},

		hasStroke: function() {
			return this.getStyle().hasStroke();
		},

		hasShadow: function() {
			return this.getStyle().hasShadow();
		},

		_getOrder: function(item) {
			function getList(item) {
				var list = [];
				do {
					list.unshift(item);
				} while (item = item._parent);
				return list;
			}
			var list1 = getList(this),
				list2 = getList(item);
			for (var i = 0, l = Math.min(list1.length, list2.length); i < l; i++) {
				if (list1[i] != list2[i]) {
					return list1[i]._index < list2[i]._index ? 1 : -1;
				}
			}
			return 0;
		},

		hasChildren: function() {
			return this._children && this._children.length > 0;
		},

		isInserted: function() {
			return this._parent ? this._parent.isInserted() : false;
		},

		isAbove: function(item) {
			return this._getOrder(item) === -1;
		},

		isBelow: function(item) {
			return this._getOrder(item) === 1;
		},

		isParent: function(item) {
			return this._parent === item;
		},

		isChild: function(item) {
			return item && item._parent === this;
		},

		isDescendant: function(item) {
			var parent = this;
			while (parent = parent._parent) {
				if (parent === item)
					return true;
			}
			return false;
		},

		isAncestor: function(item) {
			return item ? item.isDescendant(this) : false;
		},

		isSibling: function(item) {
			return this._parent === item._parent;
		},

		isGroupedWith: function(item) {
			var parent = this._parent;
			while (parent) {
				if (parent._parent
					&& /^(Group|Layer|CompoundPath)$/.test(parent._class)
					&& item.isDescendant(parent))
						return true;
				parent = parent._parent;
			}
			return false;
		},

	}, Base.each(['rotate', 'scale', 'shear', 'skew'], function(key) {
		var rotate = key === 'rotate';
		this[key] = function() {
			var value = (rotate ? Base : Point).read(arguments),
				center = Point.read(arguments, 0, { readNull: true });
			return this.transform(new Matrix()[key](value,
					center || this.getPosition(true)));
		};
	}, {
		translate: function() {
			var mx = new Matrix();
			return this.transform(mx.translate.apply(mx, arguments));
		},

		transform: function(matrix, _applyMatrix, _applyRecursively,
				_setApplyMatrix) {
			if (matrix && matrix.isIdentity())
				matrix = null;
			var _matrix = this._matrix,
				applyMatrix = (_applyMatrix || this._applyMatrix)
						&& ((!_matrix.isIdentity() || matrix)
							|| _applyMatrix && _applyRecursively && this._children);
			if (!matrix && !applyMatrix)
				return this;
			if (matrix) {
				if (!matrix.isInvertible() && _matrix.isInvertible())
					_matrix._backup = _matrix.getValues();
				_matrix.prepend(matrix);
			}
			if (applyMatrix = applyMatrix && this._transformContent(_matrix,
						_applyRecursively, _setApplyMatrix)) {
				var pivot = this._pivot,
					style = this._style,
					fillColor = style.getFillColor(true),
					strokeColor = style.getStrokeColor(true);
				if (pivot)
					_matrix._transformPoint(pivot, pivot, true);
				if (fillColor)
					fillColor.transform(_matrix);
				if (strokeColor)
					strokeColor.transform(_matrix);
				_matrix.reset(true);
				if (_setApplyMatrix && this._canApplyMatrix)
					this._applyMatrix = true;
			}
			var bounds = this._bounds,
				position = this._position;
			this._changed(9);
			var decomp = bounds && matrix && matrix.decompose();
			if (decomp && !decomp.shearing && decomp.rotation % 90 === 0) {
				for (var key in bounds) {
					var cache = bounds[key];
					if (applyMatrix || !cache.internal) {
						var rect = cache.rect;
						matrix._transformBounds(rect, rect);
					}
				}
				var getter = this._boundsGetter,
					rect = bounds[getter && getter.getBounds || getter || 'getBounds'];
				if (rect)
					this._position = rect.getCenter(true);
				this._bounds = bounds;
			} else if (matrix && position) {
				this._position = matrix._transformPoint(position, position);
			}
			return this;
		},

		_transformContent: function(matrix, applyRecursively, setApplyMatrix) {
			var children = this._children;
			if (children) {
				for (var i = 0, l = children.length; i < l; i++)
					children[i].transform(matrix, true, applyRecursively,
							setApplyMatrix);
				return true;
			}
		},

		globalToLocal: function() {
			return this.getGlobalMatrix(true)._inverseTransform(
					Point.read(arguments));
		},

		localToGlobal: function() {
			return this.getGlobalMatrix(true)._transformPoint(
					Point.read(arguments));
		},

		parentToLocal: function() {
			return this._matrix._inverseTransform(Point.read(arguments));
		},

		localToParent: function() {
			return this._matrix._transformPoint(Point.read(arguments));
		},

		fitBounds: function(rectangle, fill) {
			rectangle = Rectangle.read(arguments);
			var bounds = this.getBounds(),
				itemRatio = bounds.height / bounds.width,
				rectRatio = rectangle.height / rectangle.width,
				scale = (fill ? itemRatio > rectRatio : itemRatio < rectRatio)
						? rectangle.width / bounds.width
						: rectangle.height / bounds.height,
				newBounds = new Rectangle(new Point(),
						new Size(bounds.width * scale, bounds.height * scale));
			newBounds.setCenter(rectangle.getCenter());
			this.setBounds(newBounds);
		}
	}), {

		_setStyles: function(ctx, param, viewMatrix) {
			var style = this._style;
			if (style.hasFill()) {
				ctx.fillStyle = style.getFillColor().toCanvasStyle(ctx);
			}
			if (style.hasStroke()) {
				ctx.strokeStyle = style.getStrokeColor().toCanvasStyle(ctx);
				ctx.lineWidth = style.getStrokeWidth();
				var strokeJoin = style.getStrokeJoin(),
					strokeCap = style.getStrokeCap(),
					miterLimit = style.getMiterLimit();
				if (strokeJoin)
					ctx.lineJoin = strokeJoin;
				if (strokeCap)
					ctx.lineCap = strokeCap;
				if (miterLimit)
					ctx.miterLimit = miterLimit;
				if (paper.support.nativeDash) {
					var dashArray = style.getDashArray(),
						dashOffset = style.getDashOffset();
					if (dashArray && dashArray.length) {
						if ('setLineDash' in ctx) {
							ctx.setLineDash(dashArray);
							ctx.lineDashOffset = dashOffset;
						} else {
							ctx.mozDash = dashArray;
							ctx.mozDashOffset = dashOffset;
						}
					}
				}
			}
			if (style.hasShadow()) {
				var pixelRatio = param.pixelRatio || 1,
					mx = viewMatrix._shiftless().prepend(
						new Matrix().scale(pixelRatio, pixelRatio)),
					blur = mx.transform(new Point(style.getShadowBlur(), 0)),
					offset = mx.transform(this.getShadowOffset());
				ctx.shadowColor = style.getShadowColor().toCanvasStyle(ctx);
				ctx.shadowBlur = blur.getLength();
				ctx.shadowOffsetX = offset.x;
				ctx.shadowOffsetY = offset.y;
			}
		},

		draw: function(ctx, param, parentStrokeMatrix) {
			var updateVersion = this._updateVersion = this._project._updateVersion;
			if (!this._visible || this._opacity === 0)
				return;
			var matrices = param.matrices,
				viewMatrix = param.viewMatrix,
				matrix = this._matrix,
				globalMatrix = matrices[matrices.length - 1].appended(matrix);
			if (!globalMatrix.isInvertible())
				return;

			viewMatrix = viewMatrix ? viewMatrix.appended(globalMatrix)
					: globalMatrix;

			matrices.push(globalMatrix);
			if (param.updateMatrix) {
				globalMatrix._updateVersion = updateVersion;
				this._globalMatrix = globalMatrix;
			}

			var blendMode = this._blendMode,
				opacity = this._opacity,
				normalBlend = blendMode === 'normal',
				nativeBlend = BlendMode.nativeModes[blendMode],
				direct = normalBlend && opacity === 1
						|| param.dontStart
						|| param.clip
						|| (nativeBlend || normalBlend && opacity < 1)
							&& this._canComposite(),
				pixelRatio = param.pixelRatio || 1,
				mainCtx, itemOffset, prevOffset;
			if (!direct) {
				var bounds = this.getStrokeBounds(viewMatrix);
				if (!bounds.width || !bounds.height)
					return;
				prevOffset = param.offset;
				itemOffset = param.offset = bounds.getTopLeft().floor();
				mainCtx = ctx;
				ctx = CanvasProvider.getContext(bounds.getSize().ceil().add(1)
						.multiply(pixelRatio));
				if (pixelRatio !== 1)
					ctx.scale(pixelRatio, pixelRatio);
			}
			ctx.save();
			var strokeMatrix = parentStrokeMatrix
					? parentStrokeMatrix.appended(matrix)
					: this._canScaleStroke && !this.getStrokeScaling(true)
						&& viewMatrix,
				clip = !direct && param.clipItem,
				transform = !strokeMatrix || clip;
			if (direct) {
				ctx.globalAlpha = opacity;
				if (nativeBlend)
					ctx.globalCompositeOperation = blendMode;
			} else if (transform) {
				ctx.translate(-itemOffset.x, -itemOffset.y);
			}
			if (transform) {
				(direct ? matrix : viewMatrix).applyToContext(ctx);
			}
			if (clip) {
				param.clipItem.draw(ctx, param.extend({ clip: true }));
			}
			if (strokeMatrix) {
				ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
				var offset = param.offset;
				if (offset)
					ctx.translate(-offset.x, -offset.y);
			}
			this._draw(ctx, param, viewMatrix, strokeMatrix);
			ctx.restore();
			matrices.pop();
			if (param.clip && !param.dontFinish)
				ctx.clip();
			if (!direct) {
				BlendMode.process(blendMode, ctx, mainCtx, opacity,
						itemOffset.subtract(prevOffset).multiply(pixelRatio));
				CanvasProvider.release(ctx);
				param.offset = prevOffset;
			}
		},

		_isUpdated: function(updateVersion) {
			var parent = this._parent;
			if (parent instanceof CompoundPath)
				return parent._isUpdated(updateVersion);
			var updated = this._updateVersion === updateVersion;
			if (!updated && parent && parent._visible
					&& parent._isUpdated(updateVersion)) {
				this._updateVersion = updateVersion;
				updated = true;
			}
			return updated;
		},

		_drawSelection: function(ctx, matrix, size, selectionItems, updateVersion) {
			var selection = this._selection,
				itemSelected = selection & 1,
				boundsSelected = selection & 2
						|| itemSelected && this._selectBounds,
				positionSelected = selection & 4;
			if (!this._drawSelected)
				itemSelected = false;
			if ((itemSelected || boundsSelected || positionSelected)
					&& this._isUpdated(updateVersion)) {
				var layer,
					color = this.getSelectedColor(true) || (layer = this.getLayer())
						&& layer.getSelectedColor(true),
					mx = matrix.appended(this.getGlobalMatrix(true)),
					half = size / 2;
				ctx.strokeStyle = ctx.fillStyle = color
						? color.toCanvasStyle(ctx) : '#009dec';
				if (itemSelected)
					this._drawSelected(ctx, mx, selectionItems);
				if (positionSelected) {
					var point = this.getPosition(true),
						x = point.x,
						y = point.y;
					ctx.beginPath();
					ctx.arc(x, y, half, 0, Math.PI * 2, true);
					ctx.stroke();
					var deltas = [[0, -1], [1, 0], [0, 1], [-1, 0]],
						start = half,
						end = size + 1;
					for (var i = 0; i < 4; i++) {
						var delta = deltas[i],
							dx = delta[0],
							dy = delta[1];
						ctx.moveTo(x + dx * start, y + dy * start);
						ctx.lineTo(x + dx * end, y + dy * end);
						ctx.stroke();
					}
				}
				if (boundsSelected) {
					var coords = mx._transformCorners(this.getInternalBounds());
					ctx.beginPath();
					for (var i = 0; i < 8; i++) {
						ctx[i === 0 ? 'moveTo' : 'lineTo'](coords[i], coords[++i]);
					}
					ctx.closePath();
					ctx.stroke();
					for (var i = 0; i < 8; i++) {
						ctx.fillRect(coords[i] - half, coords[++i] - half,
								size, size);
					}
				}
			}
		},

		_canComposite: function() {
			return false;
		}
	}, Base.each(['down', 'drag', 'up', 'move'], function(key) {
		this['removeOn' + Base.capitalize(key)] = function() {
			var hash = {};
			hash[key] = true;
			return this.removeOn(hash);
		};
	}, {

		removeOn: function(obj) {
			for (var name in obj) {
				if (obj[name]) {
					var key = 'mouse' + name,
						project = this._project,
						sets = project._removeSets = project._removeSets || {};
					sets[key] = sets[key] || {};
					sets[key][this._id] = this;
				}
			}
			return this;
		}
	}));

	var Group = Item.extend({
		_class: 'Group',
		_selectBounds: false,
		_selectChildren: true,
		_serializeFields: {
			children: []
		},

		initialize: function Group(arg) {
			this._children = [];
			this._namedChildren = {};
			if (!this._initialize(arg))
				this.addChildren(Array.isArray(arg) ? arg : arguments);
		},

		_changed: function _changed(flags) {
			_changed.base.call(this, flags);
			if (flags & 1026) {
				this._clipItem = undefined;
			}
		},

		_getClipItem: function() {
			var clipItem = this._clipItem;
			if (clipItem === undefined) {
				clipItem = null;
				var children = this._children;
				for (var i = 0, l = children.length; i < l; i++) {
					if (children[i]._clipMask) {
						clipItem = children[i];
						break;
					}
				}
				this._clipItem = clipItem;
			}
			return clipItem;
		},

		isClipped: function() {
			return !!this._getClipItem();
		},

		setClipped: function(clipped) {
			var child = this.getFirstChild();
			if (child)
				child.setClipMask(clipped);
		},

		_getBounds: function _getBounds(matrix, options) {
			var clipItem = this._getClipItem();
			return clipItem
				? clipItem._getCachedBounds(
					matrix && matrix.appended(clipItem._matrix),
					Base.set({}, options, { stroke: false }))
				: _getBounds.base.call(this, matrix, options);
		},

		_hitTestChildren: function _hitTestChildren(point, options, viewMatrix) {
			var clipItem = this._getClipItem();
			return (!clipItem || clipItem.contains(point))
					&& _hitTestChildren.base.call(this, point, options, viewMatrix,
						clipItem);
		},

		_draw: function(ctx, param) {
			var clip = param.clip,
				clipItem = !clip && this._getClipItem();
			param = param.extend({ clipItem: clipItem, clip: false });
			if (clip) {
				ctx.beginPath();
				param.dontStart = param.dontFinish = true;
			} else if (clipItem) {
				clipItem.draw(ctx, param.extend({ clip: true }));
			}
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				var item = children[i];
				if (item !== clipItem)
					item.draw(ctx, param);
			}
		}
	});

	var Layer = Group.extend({
		_class: 'Layer',

		initialize: function Layer() {
			Group.apply(this, arguments);
		},

		_getOwner: function() {
			return this._parent || this._index != null && this._project;
		},

		isInserted: function isInserted() {
			return this._parent ? isInserted.base.call(this) : this._index != null;
		},

		activate: function() {
			this._project._activeLayer = this;
		},

		_hitTestSelf: function() {
		}
	});

	var Shape = Item.extend({
		_class: 'Shape',
		_applyMatrix: false,
		_canApplyMatrix: false,
		_canScaleStroke: true,
		_serializeFields: {
			type: null,
			size: null,
			radius: null
		},

		initialize: function Shape(props) {
			this._initialize(props);
		},

		_equals: function(item) {
			return this._type === item._type
				&& this._size.equals(item._size)
				&& Base.equals(this._radius, item._radius);
		},

		copyContent: function(source) {
			this.setType(source._type);
			this.setSize(source._size);
			this.setRadius(source._radius);
		},

		getType: function() {
			return this._type;
		},

		setType: function(type) {
			this._type = type;
		},

		getShape: '#getType',
		setShape: '#setType',

		getSize: function() {
			var size = this._size;
			return new LinkedSize(size.width, size.height, this, 'setSize');
		},

		setSize: function() {
			var size = Size.read(arguments);
			if (!this._size) {
				this._size = size.clone();
			} else if (!this._size.equals(size)) {
				var type = this._type,
					width = size.width,
					height = size.height;
				if (type === 'rectangle') {
					var radius = Size.min(this._radius, size.divide(2));
					this._radius.set(radius.width, radius.height);
				} else if (type === 'circle') {
					width = height = (width + height) / 2;
					this._radius = width / 2;
				} else if (type === 'ellipse') {
					this._radius.set(width / 2, height / 2);
				}
				this._size.set(width, height);
				this._changed(9);
			}
		},

		getRadius: function() {
			var rad = this._radius;
			return this._type === 'circle'
					? rad
					: new LinkedSize(rad.width, rad.height, this, 'setRadius');
		},

		setRadius: function(radius) {
			var type = this._type;
			if (type === 'circle') {
				if (radius === this._radius)
					return;
				var size = radius * 2;
				this._radius = radius;
				this._size.set(size, size);
			} else {
				radius = Size.read(arguments);
				if (!this._radius) {
					this._radius = radius.clone();
				} else {
					if (this._radius.equals(radius))
						return;
					this._radius.set(radius.width, radius.height);
					if (type === 'rectangle') {
						var size = Size.max(this._size, radius.multiply(2));
						this._size.set(size.width, size.height);
					} else if (type === 'ellipse') {
						this._size.set(radius.width * 2, radius.height * 2);
					}
				}
			}
			this._changed(9);
		},

		isEmpty: function() {
			return false;
		},

		toPath: function(insert) {
			var path = new Path[Base.capitalize(this._type)]({
				center: new Point(),
				size: this._size,
				radius: this._radius,
				insert: false
			});
			path.copyAttributes(this);
			if (paper.settings.applyMatrix)
				path.setApplyMatrix(true);
			if (insert === undefined || insert)
				path.insertAbove(this);
			return path;
		},

		toShape: '#clone',

		_draw: function(ctx, param, viewMatrix, strokeMatrix) {
			var style = this._style,
				hasFill = style.hasFill(),
				hasStroke = style.hasStroke(),
				dontPaint = param.dontFinish || param.clip,
				untransformed = !strokeMatrix;
			if (hasFill || hasStroke || dontPaint) {
				var type = this._type,
					radius = this._radius,
					isCircle = type === 'circle';
				if (!param.dontStart)
					ctx.beginPath();
				if (untransformed && isCircle) {
					ctx.arc(0, 0, radius, 0, Math.PI * 2, true);
				} else {
					var rx = isCircle ? radius : radius.width,
						ry = isCircle ? radius : radius.height,
						size = this._size,
						width = size.width,
						height = size.height;
					if (untransformed && type === 'rectangle' && rx === 0 && ry === 0) {
						ctx.rect(-width / 2, -height / 2, width, height);
					} else {
						var x = width / 2,
							y = height / 2,
							kappa = 1 - 0.5522847498307936,
							cx = rx * kappa,
							cy = ry * kappa,
							c = [
								-x, -y + ry,
								-x, -y + cy,
								-x + cx, -y,
								-x + rx, -y,
								x - rx, -y,
								x - cx, -y,
								x, -y + cy,
								x, -y + ry,
								x, y - ry,
								x, y - cy,
								x - cx, y,
								x - rx, y,
								-x + rx, y,
								-x + cx, y,
								-x, y - cy,
								-x, y - ry
							];
						if (strokeMatrix)
							strokeMatrix.transform(c, c, 32);
						ctx.moveTo(c[0], c[1]);
						ctx.bezierCurveTo(c[2], c[3], c[4], c[5], c[6], c[7]);
						if (x !== rx)
							ctx.lineTo(c[8], c[9]);
						ctx.bezierCurveTo(c[10], c[11], c[12], c[13], c[14], c[15]);
						if (y !== ry)
							ctx.lineTo(c[16], c[17]);
						ctx.bezierCurveTo(c[18], c[19], c[20], c[21], c[22], c[23]);
						if (x !== rx)
							ctx.lineTo(c[24], c[25]);
						ctx.bezierCurveTo(c[26], c[27], c[28], c[29], c[30], c[31]);
					}
				}
				ctx.closePath();
			}
			if (!dontPaint && (hasFill || hasStroke)) {
				this._setStyles(ctx, param, viewMatrix);
				if (hasFill) {
					ctx.fill(style.getFillRule());
					ctx.shadowColor = 'rgba(0,0,0,0)';
				}
				if (hasStroke)
					ctx.stroke();
			}
		},

		_canComposite: function() {
			return !(this.hasFill() && this.hasStroke());
		},

		_getBounds: function(matrix, options) {
			var rect = new Rectangle(this._size).setCenter(0, 0),
				style = this._style,
				strokeWidth = options.stroke && style.hasStroke()
						&& style.getStrokeWidth();
			if (matrix)
				rect = matrix._transformBounds(rect);
			return strokeWidth
					? rect.expand(Path._getStrokePadding(strokeWidth,
						this._getStrokeMatrix(matrix, options)))
					: rect;
		}
	},
	new function() {
		function getCornerCenter(that, point, expand) {
			var radius = that._radius;
			if (!radius.isZero()) {
				var halfSize = that._size.divide(2);
				for (var i = 0; i < 4; i++) {
					var dir = new Point(i & 1 ? 1 : -1, i > 1 ? 1 : -1),
						corner = dir.multiply(halfSize),
						center = corner.subtract(dir.multiply(radius)),
						rect = new Rectangle(corner, center);
					if ((expand ? rect.expand(expand) : rect).contains(point))
						return center;
				}
			}
		}

		function isOnEllipseStroke(point, radius, padding, quadrant) {
			var vector = point.divide(radius);
			return (!quadrant || vector.quadrant === quadrant) &&
					vector.subtract(vector.normalize()).multiply(radius)
						.divide(padding).length <= 1;
		}

		return {
			_contains: function _contains(point) {
				if (this._type === 'rectangle') {
					var center = getCornerCenter(this, point);
					return center
							? point.subtract(center).divide(this._radius)
								.getLength() <= 1
							: _contains.base.call(this, point);
				} else {
					return point.divide(this.size).getLength() <= 0.5;
				}
			},

			_hitTestSelf: function _hitTestSelf(point, options, viewMatrix,
					strokeMatrix) {
				var hit = false,
					style = this._style,
					hitStroke = options.stroke && style.hasStroke(),
					hitFill = options.fill && style.hasFill();
				if (hitStroke || hitFill) {
					var type = this._type,
						radius = this._radius,
						strokeRadius = hitStroke ? style.getStrokeWidth() / 2 : 0,
						strokePadding = options._tolerancePadding.add(
							Path._getStrokePadding(strokeRadius,
								!style.getStrokeScaling() && strokeMatrix));
					if (type === 'rectangle') {
						var padding = strokePadding.multiply(2),
							center = getCornerCenter(this, point, padding);
						if (center) {
							hit = isOnEllipseStroke(point.subtract(center), radius,
									strokePadding, center.getQuadrant());
						} else {
							var rect = new Rectangle(this._size).setCenter(0, 0),
								outer = rect.expand(padding),
								inner = rect.expand(padding.negate());
							hit = outer._containsPoint(point)
									&& !inner._containsPoint(point);
						}
					} else {
						hit = isOnEllipseStroke(point, radius, strokePadding);
					}
				}
				return hit ? new HitResult(hitStroke ? 'stroke' : 'fill', this)
						: _hitTestSelf.base.apply(this, arguments);
			}
		};
	}, {

	statics: new function() {
		function createShape(type, point, size, radius, args) {
			var item = new Shape(Base.getNamed(args));
			item._type = type;
			item._size = size;
			item._radius = radius;
			return item.translate(point);
		}

		return {
			Circle: function() {
				var center = Point.readNamed(arguments, 'center'),
					radius = Base.readNamed(arguments, 'radius');
				return createShape('circle', center, new Size(radius * 2), radius,
						arguments);
			},

			Rectangle: function() {
				var rect = Rectangle.readNamed(arguments, 'rectangle'),
					radius = Size.min(Size.readNamed(arguments, 'radius'),
							rect.getSize(true).divide(2));
				return createShape('rectangle', rect.getCenter(true),
						rect.getSize(true), radius, arguments);
			},

			Ellipse: function() {
				var ellipse = Shape._readEllipse(arguments),
					radius = ellipse.radius;
				return createShape('ellipse', ellipse.center, radius.multiply(2),
						radius, arguments);
			},

			_readEllipse: function(args) {
				var center,
					radius;
				if (Base.hasNamed(args, 'radius')) {
					center = Point.readNamed(args, 'center');
					radius = Size.readNamed(args, 'radius');
				} else {
					var rect = Rectangle.readNamed(args, 'rectangle');
					center = rect.getCenter(true);
					radius = rect.getSize(true).divide(2);
				}
				return { center: center, radius: radius };
			}
		};
	}});

	var Raster = Item.extend({
		_class: 'Raster',
		_applyMatrix: false,
		_canApplyMatrix: false,
		_boundsOptions: { stroke: false, handle: false },
		_serializeFields: {
			crossOrigin: null,
			source: null
		},

		initialize: function Raster(object, position) {
			if (!this._initialize(object,
					position !== undefined && Point.read(arguments, 1))) {
				var image = typeof object === 'string'
						? document.getElementById(object) : object;
				if (image) {
					this.setImage(image);
				} else {
					this.setSource(object);
				}
			}
			if (!this._size) {
				this._size = new Size();
				this._loaded = false;
			}
		},

		_equals: function(item) {
			return this.getSource() === item.getSource();
		},

		copyContent: function(source) {
			var image = source._image,
				canvas = source._canvas;
			if (image) {
				this._setImage(image);
			} else if (canvas) {
				var copyCanvas = CanvasProvider.getCanvas(source._size);
				copyCanvas.getContext('2d').drawImage(canvas, 0, 0);
				this._setImage(copyCanvas);
			}
			this._crossOrigin = source._crossOrigin;
		},

		getSize: function() {
			var size = this._size;
			return new LinkedSize(size ? size.width : 0, size ? size.height : 0,
					this, 'setSize');
		},

		setSize: function() {
			var size = Size.read(arguments);
			if (!size.equals(this._size)) {
				if (size.width > 0 && size.height > 0) {
					var element = this.getElement();
					this._setImage(CanvasProvider.getCanvas(size));
					if (element)
						this.getContext(true).drawImage(element, 0, 0,
								size.width, size.height);
				} else {
					if (this._canvas)
						CanvasProvider.release(this._canvas);
					this._size = size.clone();
				}
			}
		},

		getWidth: function() {
			return this._size ? this._size.width : 0;
		},

		setWidth: function(width) {
			this.setSize(width, this.getHeight());
		},

		getHeight: function() {
			return this._size ? this._size.height : 0;
		},

		setHeight: function(height) {
			this.setSize(this.getWidth(), height);
		},

		getLoaded: function() {
			return this._loaded;
		},

		isEmpty: function() {
			var size = this._size;
			return !size || size.width === 0 && size.height === 0;
		},

		getResolution: function() {
			var matrix = this._matrix,
				orig = new Point(0, 0).transform(matrix),
				u = new Point(1, 0).transform(matrix).subtract(orig),
				v = new Point(0, 1).transform(matrix).subtract(orig);
			return new Size(
				72 / u.getLength(),
				72 / v.getLength()
			);
		},

		getPpi: '#getResolution',

		getImage: function() {
			return this._image;
		},

		setImage: function(image) {
			var that = this;

			function emit(event) {
				var view = that.getView(),
					type = event && event.type || 'load';
				if (view && that.responds(type)) {
					paper = view._scope;
					that.emit(type, new Event(event));
				}
			}

			this._setImage(image);
			if (this._loaded) {
				setTimeout(emit, 0);
			} else if (image) {
				DomEvent.add(image, {
					load: function(event) {
						that._setImage(image);
						emit(event);
					},
					error: emit
				});
			}
		},

		_setImage: function(image) {
			if (this._canvas)
				CanvasProvider.release(this._canvas);
			if (image && image.getContext) {
				this._image = null;
				this._canvas = image;
				this._loaded = true;
			} else {
				this._image = image;
				this._canvas = null;
				this._loaded = !!(image && image.src && image.complete);
			}
			this._size = new Size(
					image ? image.naturalWidth || image.width : 0,
					image ? image.naturalHeight || image.height : 0);
			this._context = null;
			this._changed(521);
		},

		getCanvas: function() {
			if (!this._canvas) {
				var ctx = CanvasProvider.getContext(this._size);
				try {
					if (this._image)
						ctx.drawImage(this._image, 0, 0);
					this._canvas = ctx.canvas;
				} catch (e) {
					CanvasProvider.release(ctx);
				}
			}
			return this._canvas;
		},

		setCanvas: '#setImage',

		getContext: function(modify) {
			if (!this._context)
				this._context = this.getCanvas().getContext('2d');
			if (modify) {
				this._image = null;
				this._changed(513);
			}
			return this._context;
		},

		setContext: function(context) {
			this._context = context;
		},

		getSource: function() {
			var image = this._image;
			return image && image.src || this.toDataURL();
		},

		setSource: function(src) {
			var image = new window.Image(),
				crossOrigin = this._crossOrigin;
			if (crossOrigin)
				image.crossOrigin = crossOrigin;
			image.src = src;
			this.setImage(image);
		},

		getCrossOrigin: function() {
			var image = this._image;
			return image && image.crossOrigin || this._crossOrigin || '';
		},

		setCrossOrigin: function(crossOrigin) {
			this._crossOrigin = crossOrigin;
			var image = this._image;
			if (image)
				image.crossOrigin = crossOrigin;
		},

		getElement: function() {
			return this._canvas || this._loaded && this._image;
		}
	}, {
		beans: false,

		getSubCanvas: function() {
			var rect = Rectangle.read(arguments),
				ctx = CanvasProvider.getContext(rect.getSize());
			ctx.drawImage(this.getCanvas(), rect.x, rect.y,
					rect.width, rect.height, 0, 0, rect.width, rect.height);
			return ctx.canvas;
		},

		getSubRaster: function() {
			var rect = Rectangle.read(arguments),
				raster = new Raster(Item.NO_INSERT);
			raster._setImage(this.getSubCanvas(rect));
			raster.translate(rect.getCenter().subtract(this.getSize().divide(2)));
			raster._matrix.prepend(this._matrix);
			raster.insertAbove(this);
			return raster;
		},

		toDataURL: function() {
			var image = this._image,
				src = image && image.src;
			if (/^data:/.test(src))
				return src;
			var canvas = this.getCanvas();
			return canvas ? canvas.toDataURL.apply(canvas, arguments) : null;
		},

		drawImage: function(image ) {
			var point = Point.read(arguments, 1);
			this.getContext(true).drawImage(image, point.x, point.y);
		},

		getAverageColor: function(object) {
			var bounds, path;
			if (!object) {
				bounds = this.getBounds();
			} else if (object instanceof PathItem) {
				path = object;
				bounds = object.getBounds();
			} else if (typeof object === 'object') {
				if ('width' in object) {
					bounds = new Rectangle(object);
				} else if ('x' in object) {
					bounds = new Rectangle(object.x - 0.5, object.y - 0.5, 1, 1);
				}
			}
			if (!bounds)
				return null;
			var sampleSize = 32,
				width = Math.min(bounds.width, sampleSize),
				height = Math.min(bounds.height, sampleSize);
			var ctx = Raster._sampleContext;
			if (!ctx) {
				ctx = Raster._sampleContext = CanvasProvider.getContext(
						new Size(sampleSize));
			} else {
				ctx.clearRect(0, 0, sampleSize + 1, sampleSize + 1);
			}
			ctx.save();
			var matrix = new Matrix()
					.scale(width / bounds.width, height / bounds.height)
					.translate(-bounds.x, -bounds.y);
			matrix.applyToContext(ctx);
			if (path)
				path.draw(ctx, new Base({ clip: true, matrices: [matrix] }));
			this._matrix.applyToContext(ctx);
			var element = this.getElement(),
				size = this._size;
			if (element)
				ctx.drawImage(element, -size.width / 2, -size.height / 2);
			ctx.restore();
			var pixels = ctx.getImageData(0.5, 0.5, Math.ceil(width),
					Math.ceil(height)).data,
				channels = [0, 0, 0],
				total = 0;
			for (var i = 0, l = pixels.length; i < l; i += 4) {
				var alpha = pixels[i + 3];
				total += alpha;
				alpha /= 255;
				channels[0] += pixels[i] * alpha;
				channels[1] += pixels[i + 1] * alpha;
				channels[2] += pixels[i + 2] * alpha;
			}
			for (var i = 0; i < 3; i++)
				channels[i] /= total;
			return total ? Color.read(channels) : null;
		},

		getPixel: function() {
			var point = Point.read(arguments);
			var data = this.getContext().getImageData(point.x, point.y, 1, 1).data;
			return new Color('rgb', [data[0] / 255, data[1] / 255, data[2] / 255],
					data[3] / 255);
		},

		setPixel: function() {
			var point = Point.read(arguments),
				color = Color.read(arguments),
				components = color._convert('rgb'),
				alpha = color._alpha,
				ctx = this.getContext(true),
				imageData = ctx.createImageData(1, 1),
				data = imageData.data;
			data[0] = components[0] * 255;
			data[1] = components[1] * 255;
			data[2] = components[2] * 255;
			data[3] = alpha != null ? alpha * 255 : 255;
			ctx.putImageData(imageData, point.x, point.y);
		},

		createImageData: function() {
			var size = Size.read(arguments);
			return this.getContext().createImageData(size.width, size.height);
		},

		getImageData: function() {
			var rect = Rectangle.read(arguments);
			if (rect.isEmpty())
				rect = new Rectangle(this._size);
			return this.getContext().getImageData(rect.x, rect.y,
					rect.width, rect.height);
		},

		setImageData: function(data ) {
			var point = Point.read(arguments, 1);
			this.getContext(true).putImageData(data, point.x, point.y);
		},

		_getBounds: function(matrix, options) {
			var rect = new Rectangle(this._size).setCenter(0, 0);
			return matrix ? matrix._transformBounds(rect) : rect;
		},

		_hitTestSelf: function(point) {
			if (this._contains(point)) {
				var that = this;
				return new HitResult('pixel', that, {
					offset: point.add(that._size.divide(2)).round(),
					color: {
						get: function() {
							return that.getPixel(this.offset);
						}
					}
				});
			}
		},

		_draw: function(ctx) {
			var element = this.getElement();
			if (element) {
				ctx.globalAlpha = this._opacity;
				ctx.drawImage(element,
						-this._size.width / 2, -this._size.height / 2);
			}
		},

		_canComposite: function() {
			return true;
		}
	});

	var SymbolItem = Item.extend({
		_class: 'SymbolItem',
		_applyMatrix: false,
		_canApplyMatrix: false,
		_boundsOptions: { stroke: true },
		_serializeFields: {
			symbol: null
		},

		initialize: function SymbolItem(arg0, arg1) {
			if (!this._initialize(arg0,
					arg1 !== undefined && Point.read(arguments, 1)))
				this.setDefinition(arg0 instanceof SymbolDefinition ?
						arg0 : new SymbolDefinition(arg0));
		},

		_equals: function(item) {
			return this._definition === item._definition;
		},

		copyContent: function(source) {
			this.setDefinition(source._definition);
		},

		getDefinition: function() {
			return this._definition;
		},

		setDefinition: function(definition) {
			this._definition = definition;
			this._changed(9);
		},

		getSymbol: '#getDefinition',
		setSymbol: '#setDefinition',

		isEmpty: function() {
			return this._definition._item.isEmpty();
		},

		_getBounds: function(matrix, options) {
			var item = this._definition._item;
			return item._getCachedBounds(item._matrix.prepended(matrix), options);
		},

		_hitTestSelf: function(point, options, viewMatrix, strokeMatrix) {
			var res = this._definition._item._hitTest(point, options, viewMatrix);
			if (res)
				res.item = this;
			return res;
		},

		_draw: function(ctx, param) {
			this._definition._item.draw(ctx, param);
		}

	});

	var SymbolDefinition = Base.extend({
		_class: 'SymbolDefinition',

		initialize: function SymbolDefinition(item, dontCenter) {
			this._id = UID.get();
			this.project = paper.project;
			if (item)
				this.setItem(item, dontCenter);
		},

		_serialize: function(options, dictionary) {
			return dictionary.add(this, function() {
				return Base.serialize([this._class, this._item],
						options, false, dictionary);
			});
		},

		_changed: function(flags) {
			if (flags & 8)
				Item._clearBoundsCache(this);
			if (flags & 1)
				this.project._changed(flags);
		},

		getItem: function() {
			return this._item;
		},

		setItem: function(item, _dontCenter) {
			if (item._symbol)
				item = item.clone();
			if (this._item)
				this._item._symbol = null;
			this._item = item;
			item.remove();
			item.setSelected(false);
			if (!_dontCenter)
				item.setPosition(new Point());
			item._symbol = this;
			this._changed(9);
		},

		getDefinition: '#getItem',
		setDefinition: '#setItem',

		place: function(position) {
			return new SymbolItem(this, position);
		},

		clone: function() {
			return new SymbolDefinition(this._item.clone(false));
		},

		equals: function(symbol) {
			return symbol === this
					|| symbol && this._item.equals(symbol._item)
					|| false;
		}
	});

	var HitResult = Base.extend({
		_class: 'HitResult',

		initialize: function HitResult(type, item, values) {
			this.type = type;
			this.item = item;
			if (values) {
				values.enumerable = true;
				this.inject(values);
			}
		},

		statics: {
			getOptions: function(args) {
				var options = args && Base.read(args);
				return Base.set({
					type: null,
					tolerance: paper.settings.hitTolerance,
					fill: !options,
					stroke: !options,
					segments: !options,
					handles: false,
					ends: false,
					center: false,
					bounds: false,
					guides: false,
					selected: false
				}, options);
			}
		}
	});

	var Segment = Base.extend({
		_class: 'Segment',
		beans: true,
		_selection: 0,

		initialize: function Segment(arg0, arg1, arg2, arg3, arg4, arg5) {
			var count = arguments.length,
				point, handleIn, handleOut,
				selection;
			if (count === 0) {
			} else if (count === 1) {
				if (arg0 && 'point' in arg0) {
					point = arg0.point;
					handleIn = arg0.handleIn;
					handleOut = arg0.handleOut;
					selection = arg0.selection;
				} else {
					point = arg0;
				}
			} else if (arg0 == null || typeof arg0 === 'object') {
				point = arg0;
				handleIn = arg1;
				handleOut = arg2;
				selection = arg3;
			} else {
				point = arg0 !== undefined ? [ arg0, arg1 ] : null;
				handleIn = arg2 !== undefined ? [ arg2, arg3 ] : null;
				handleOut = arg4 !== undefined ? [ arg4, arg5 ] : null;
			}
			new SegmentPoint(point, this, '_point');
			new SegmentPoint(handleIn, this, '_handleIn');
			new SegmentPoint(handleOut, this, '_handleOut');
			if (selection)
				this.setSelection(selection);
		},

		_serialize: function(options, dictionary) {
			var point = this._point,
				selection = this._selection,
				obj = selection || this.hasHandles()
						? [point, this._handleIn, this._handleOut]
						: point;
			if (selection)
				obj.push(selection);
			return Base.serialize(obj, options, true, dictionary);
		},

		_changed: function(point) {
			var path = this._path;
			if (!path)
				return;
			var curves = path._curves,
				index = this._index,
				curve;
			if (curves) {
				if ((!point || point === this._point || point === this._handleIn)
						&& (curve = index > 0 ? curves[index - 1] : path._closed
							? curves[curves.length - 1] : null))
					curve._changed();
				if ((!point || point === this._point || point === this._handleOut)
						&& (curve = curves[index]))
					curve._changed();
			}
			path._changed(25);
		},

		getPoint: function() {
			return this._point;
		},

		setPoint: function() {
			var point = Point.read(arguments);
			this._point.set(point.x, point.y);
		},

		getHandleIn: function() {
			return this._handleIn;
		},

		setHandleIn: function() {
			var point = Point.read(arguments);
			this._handleIn.set(point.x, point.y);
		},

		getHandleOut: function() {
			return this._handleOut;
		},

		setHandleOut: function() {
			var point = Point.read(arguments);
			this._handleOut.set(point.x, point.y);
		},

		hasHandles: function() {
			return !this._handleIn.isZero() || !this._handleOut.isZero();
		},

		clearHandles: function() {
			this._handleIn.set(0, 0);
			this._handleOut.set(0, 0);
		},

		getSelection: function() {
			return this._selection;
		},

		setSelection: function(selection) {
			var oldSelection = this._selection,
				path = this._path;
			this._selection = selection = selection || 0;
			if (path && selection !== oldSelection) {
				path._updateSelection(this, oldSelection, selection);
				path._changed(129);
			}
		},

		changeSelection: function(flag, selected) {
			var selection = this._selection;
			this.setSelection(selected ? selection | flag : selection & ~flag);
		},

		isSelected: function() {
			return !!(this._selection & 7);
		},

		setSelected: function(selected) {
			this.changeSelection(7, selected);
		},

		getIndex: function() {
			return this._index !== undefined ? this._index : null;
		},

		getPath: function() {
			return this._path || null;
		},

		getCurve: function() {
			var path = this._path,
				index = this._index;
			if (path) {
				if (index > 0 && !path._closed
						&& index === path._segments.length - 1)
					index--;
				return path.getCurves()[index] || null;
			}
			return null;
		},

		getLocation: function() {
			var curve = this.getCurve();
			return curve
					? new CurveLocation(curve, this === curve._segment1 ? 0 : 1)
					: null;
		},

		getNext: function() {
			var segments = this._path && this._path._segments;
			return segments && (segments[this._index + 1]
					|| this._path._closed && segments[0]) || null;
		},

		smooth: function(options, _first, _last) {
			var opts = options || {},
				type = opts.type,
				factor = opts.factor,
				prev = this.getPrevious(),
				next = this.getNext(),
				p0 = (prev || this)._point,
				p1 = this._point,
				p2 = (next || this)._point,
				d1 = p0.getDistance(p1),
				d2 = p1.getDistance(p2);
			if (!type || type === 'catmull-rom') {
				var a = factor === undefined ? 0.5 : factor,
					d1_a = Math.pow(d1, a),
					d1_2a = d1_a * d1_a,
					d2_a = Math.pow(d2, a),
					d2_2a = d2_a * d2_a;
				if (!_first && prev) {
					var A = 2 * d2_2a + 3 * d2_a * d1_a + d1_2a,
						N = 3 * d2_a * (d2_a + d1_a);
					this.setHandleIn(N !== 0
						? new Point(
							(d2_2a * p0._x + A * p1._x - d1_2a * p2._x) / N - p1._x,
							(d2_2a * p0._y + A * p1._y - d1_2a * p2._y) / N - p1._y)
						: new Point());
				}
				if (!_last && next) {
					var A = 2 * d1_2a + 3 * d1_a * d2_a + d2_2a,
						N = 3 * d1_a * (d1_a + d2_a);
					this.setHandleOut(N !== 0
						? new Point(
							(d1_2a * p2._x + A * p1._x - d2_2a * p0._x) / N - p1._x,
							(d1_2a * p2._y + A * p1._y - d2_2a * p0._y) / N - p1._y)
						: new Point());
				}
			} else if (type === 'geometric') {
				if (prev && next) {
					var vector = p0.subtract(p2),
						t = factor === undefined ? 0.4 : factor,
						k = t * d1 / (d1 + d2);
					if (!_first)
						this.setHandleIn(vector.multiply(k));
					if (!_last)
						this.setHandleOut(vector.multiply(k - t));
				}
			} else {
				throw new Error('Smoothing method \'' + type + '\' not supported.');
			}
		},

		getPrevious: function() {
			var segments = this._path && this._path._segments;
			return segments && (segments[this._index - 1]
					|| this._path._closed && segments[segments.length - 1]) || null;
		},

		isFirst: function() {
			return this._index === 0;
		},

		isLast: function() {
			var path = this._path;
			return path && this._index === path._segments.length - 1 || false;
		},

		reverse: function() {
			var handleIn = this._handleIn,
				handleOut = this._handleOut,
				inX = handleIn._x,
				inY = handleIn._y;
			handleIn.set(handleOut._x, handleOut._y);
			handleOut.set(inX, inY);
		},

		reversed: function() {
			return new Segment(this._point, this._handleOut, this._handleIn);
		},

		remove: function() {
			return this._path ? !!this._path.removeSegment(this._index) : false;
		},

		clone: function() {
			return new Segment(this._point, this._handleIn, this._handleOut);
		},

		equals: function(segment) {
			return segment === this || segment && this._class === segment._class
					&& this._point.equals(segment._point)
					&& this._handleIn.equals(segment._handleIn)
					&& this._handleOut.equals(segment._handleOut)
					|| false;
		},

		toString: function() {
			var parts = [ 'point: ' + this._point ];
			if (!this._handleIn.isZero())
				parts.push('handleIn: ' + this._handleIn);
			if (!this._handleOut.isZero())
				parts.push('handleOut: ' + this._handleOut);
			return '{ ' + parts.join(', ') + ' }';
		},

		transform: function(matrix) {
			this._transformCoordinates(matrix, new Array(6), true);
			this._changed();
		},

		interpolate: function(from, to, factor) {
			var u = 1 - factor,
				v = factor,
				point1 = from._point,
				point2 = to._point,
				handleIn1 = from._handleIn,
				handleIn2 = to._handleIn,
				handleOut2 = to._handleOut,
				handleOut1 = from._handleOut;
			this._point.set(
					u * point1._x + v * point2._x,
					u * point1._y + v * point2._y, true);
			this._handleIn.set(
					u * handleIn1._x + v * handleIn2._x,
					u * handleIn1._y + v * handleIn2._y, true);
			this._handleOut.set(
					u * handleOut1._x + v * handleOut2._x,
					u * handleOut1._y + v * handleOut2._y, true);
			this._changed();
		},

		_transformCoordinates: function(matrix, coords, change) {
			var point = this._point,
				handleIn = !change || !this._handleIn.isZero()
						? this._handleIn : null,
				handleOut = !change || !this._handleOut.isZero()
						? this._handleOut : null,
				x = point._x,
				y = point._y,
				i = 2;
			coords[0] = x;
			coords[1] = y;
			if (handleIn) {
				coords[i++] = handleIn._x + x;
				coords[i++] = handleIn._y + y;
			}
			if (handleOut) {
				coords[i++] = handleOut._x + x;
				coords[i++] = handleOut._y + y;
			}
			if (matrix) {
				matrix._transformCoordinates(coords, coords, i / 2);
				x = coords[0];
				y = coords[1];
				if (change) {
					point._x = x;
					point._y = y;
					i = 2;
					if (handleIn) {
						handleIn._x = coords[i++] - x;
						handleIn._y = coords[i++] - y;
					}
					if (handleOut) {
						handleOut._x = coords[i++] - x;
						handleOut._y = coords[i++] - y;
					}
				} else {
					if (!handleIn) {
						coords[i++] = x;
						coords[i++] = y;
					}
					if (!handleOut) {
						coords[i++] = x;
						coords[i++] = y;
					}
				}
			}
			return coords;
		}
	});

	var SegmentPoint = Point.extend({
		initialize: function SegmentPoint(point, owner, key) {
			var x, y,
				selected;
			if (!point) {
				x = y = 0;
			} else if ((x = point[0]) !== undefined) {
				y = point[1];
			} else {
				var pt = point;
				if ((x = pt.x) === undefined) {
					pt = Point.read(arguments);
					x = pt.x;
				}
				y = pt.y;
				selected = pt.selected;
			}
			this._x = x;
			this._y = y;
			this._owner = owner;
			owner[key] = this;
			if (selected)
				this.setSelected(true);
		},

		set: function(x, y) {
			this._x = x;
			this._y = y;
			this._owner._changed(this);
			return this;
		},

		getX: function() {
			return this._x;
		},

		setX: function(x) {
			this._x = x;
			this._owner._changed(this);
		},

		getY: function() {
			return this._y;
		},

		setY: function(y) {
			this._y = y;
			this._owner._changed(this);
		},

		isZero: function() {
			return Numerical.isZero(this._x) && Numerical.isZero(this._y);
		},

		isSelected: function() {
			return !!(this._owner._selection & this._getSelection());
		},

		setSelected: function(selected) {
			this._owner.changeSelection(this._getSelection(), selected);
		},

		_getSelection: function() {
			var owner = this._owner;
			return this === owner._point ? 1
				: this === owner._handleIn ? 2
				: this === owner._handleOut ? 4
				: 0;
		}
	});

	var Curve = Base.extend({
		_class: 'Curve',

		initialize: function Curve(arg0, arg1, arg2, arg3, arg4, arg5, arg6, arg7) {
			var count = arguments.length,
				seg1, seg2,
				point1, point2,
				handle1, handle2;
			if (count === 3) {
				this._path = arg0;
				seg1 = arg1;
				seg2 = arg2;
			} else if (count === 0) {
				seg1 = new Segment();
				seg2 = new Segment();
			} else if (count === 1) {
				if ('segment1' in arg0) {
					seg1 = new Segment(arg0.segment1);
					seg2 = new Segment(arg0.segment2);
				} else if ('point1' in arg0) {
					point1 = arg0.point1;
					handle1 = arg0.handle1;
					handle2 = arg0.handle2;
					point2 = arg0.point2;
				} else if (Array.isArray(arg0)) {
					point1 = [arg0[0], arg0[1]];
					point2 = [arg0[6], arg0[7]];
					handle1 = [arg0[2] - arg0[0], arg0[3] - arg0[1]];
					handle2 = [arg0[4] - arg0[6], arg0[5] - arg0[7]];
				}
			} else if (count === 2) {
				seg1 = new Segment(arg0);
				seg2 = new Segment(arg1);
			} else if (count === 4) {
				point1 = arg0;
				handle1 = arg1;
				handle2 = arg2;
				point2 = arg3;
			} else if (count === 8) {
				point1 = [arg0, arg1];
				point2 = [arg6, arg7];
				handle1 = [arg2 - arg0, arg3 - arg1];
				handle2 = [arg4 - arg6, arg5 - arg7];
			}
			this._segment1 = seg1 || new Segment(point1, null, handle1);
			this._segment2 = seg2 || new Segment(point2, handle2, null);
		},

		_serialize: function(options, dictionary) {
			return Base.serialize(this.hasHandles()
					? [this.getPoint1(), this.getHandle1(), this.getHandle2(),
						this.getPoint2()]
					: [this.getPoint1(), this.getPoint2()],
					options, true, dictionary);
		},

		_changed: function() {
			this._length = this._bounds = undefined;
		},

		clone: function() {
			return new Curve(this._segment1, this._segment2);
		},

		toString: function() {
			var parts = [ 'point1: ' + this._segment1._point ];
			if (!this._segment1._handleOut.isZero())
				parts.push('handle1: ' + this._segment1._handleOut);
			if (!this._segment2._handleIn.isZero())
				parts.push('handle2: ' + this._segment2._handleIn);
			parts.push('point2: ' + this._segment2._point);
			return '{ ' + parts.join(', ') + ' }';
		},

		remove: function() {
			var removed = false;
			if (this._path) {
				var segment2 = this._segment2,
					handleOut = segment2._handleOut;
				removed = segment2.remove();
				if (removed)
					this._segment1._handleOut.set(handleOut.x, handleOut.y);
			}
			return removed;
		},

		getPoint1: function() {
			return this._segment1._point;
		},

		setPoint1: function() {
			var point = Point.read(arguments);
			this._segment1._point.set(point.x, point.y);
		},

		getPoint2: function() {
			return this._segment2._point;
		},

		setPoint2: function() {
			var point = Point.read(arguments);
			this._segment2._point.set(point.x, point.y);
		},

		getHandle1: function() {
			return this._segment1._handleOut;
		},

		setHandle1: function() {
			var point = Point.read(arguments);
			this._segment1._handleOut.set(point.x, point.y);
		},

		getHandle2: function() {
			return this._segment2._handleIn;
		},

		setHandle2: function() {
			var point = Point.read(arguments);
			this._segment2._handleIn.set(point.x, point.y);
		},

		getSegment1: function() {
			return this._segment1;
		},

		getSegment2: function() {
			return this._segment2;
		},

		getPath: function() {
			return this._path;
		},

		getIndex: function() {
			return this._segment1._index;
		},

		getNext: function() {
			var curves = this._path && this._path._curves;
			return curves && (curves[this._segment1._index + 1]
					|| this._path._closed && curves[0]) || null;
		},

		getPrevious: function() {
			var curves = this._path && this._path._curves;
			return curves && (curves[this._segment1._index - 1]
					|| this._path._closed && curves[curves.length - 1]) || null;
		},

		isFirst: function() {
			return this._segment1._index === 0;
		},

		isLast: function() {
			var path = this._path;
			return path && this._segment1._index === path._curves.length - 1
					|| false;
		},

		isSelected: function() {
			return this.getPoint1().isSelected()
					&& this.getHandle2().isSelected()
					&& this.getHandle2().isSelected()
					&& this.getPoint2().isSelected();
		},

		setSelected: function(selected) {
			this.getPoint1().setSelected(selected);
			this.getHandle1().setSelected(selected);
			this.getHandle2().setSelected(selected);
			this.getPoint2().setSelected(selected);
		},

		getValues: function(matrix) {
			return Curve.getValues(this._segment1, this._segment2, matrix);
		},

		getPoints: function() {
			var coords = this.getValues(),
				points = [];
			for (var i = 0; i < 8; i += 2)
				points.push(new Point(coords[i], coords[i + 1]));
			return points;
		},

		getLength: function() {
			if (this._length == null)
				this._length = Curve.getLength(this.getValues(), 0, 1);
			return this._length;
		},

		getArea: function() {
			return Curve.getArea(this.getValues());
		},

		getLine: function() {
			return new Line(this._segment1._point, this._segment2._point);
		},

		getPart: function(from, to) {
			return new Curve(Curve.getPart(this.getValues(), from, to));
		},

		getPartLength: function(from, to) {
			return Curve.getLength(this.getValues(), from, to);
		},

		getIntersections: function(curve) {
			return Curve._getIntersections(this.getValues(),
					curve && curve !== this ? curve.getValues() : null,
					this, curve, [], {});
		},

		divideAt: function(location) {
			return this.divideAtTime(location && location.curve === this
					? location.time : location);
		},

		divideAtTime: function(time, _setHandles) {
			var tMin = 4e-7,
				tMax = 1 - tMin,
				res = null;
			if (time >= tMin && time <= tMax) {
				var parts = Curve.subdivide(this.getValues(), time),
					left = parts[0],
					right = parts[1],
					setHandles = _setHandles || this.hasHandles(),
					segment1 = this._segment1,
					segment2 = this._segment2,
					path = this._path;
				if (setHandles) {
					segment1._handleOut.set(left[2] - left[0], left[3] - left[1]);
					segment2._handleIn.set(right[4] - right[6],right[5] - right[7]);
				}
				var x = left[6], y = left[7],
					segment = new Segment(new Point(x, y),
							setHandles && new Point(left[4] - x, left[5] - y),
							setHandles && new Point(right[2] - x, right[3] - y));
				if (path) {
					path.insert(segment1._index + 1, segment);
					res = this.getNext();
				} else {
					this._segment2 = segment;
					this._changed();
					res = new Curve(segment, segment2);
				}
			}
			return res;
		},

		splitAt: function(location) {
			return this._path ? this._path.splitAt(location) : null;
		},

		splitAtTime: function(t) {
			return this.splitAt(this.getLocationAtTime(t));
		},

		divide: function(offset, isTime) {
			return this.divideAtTime(offset === undefined ? 0.5 : isTime ? offset
					: this.getTimeAt(offset));
		},

		split: function(offset, isTime) {
			return this.splitAtTime(offset === undefined ? 0.5 : isTime ? offset
					: this.getTimeAt(offset));
		},

		reversed: function() {
			return new Curve(this._segment2.reversed(), this._segment1.reversed());
		},

		clearHandles: function() {
			this._segment1._handleOut.set(0, 0);
			this._segment2._handleIn.set(0, 0);
		},

	statics: {
		getValues: function(segment1, segment2, matrix) {
			var p1 = segment1._point,
				h1 = segment1._handleOut,
				h2 = segment2._handleIn,
				p2 = segment2._point,
				values = [
					p1._x, p1._y,
					p1._x + h1._x, p1._y + h1._y,
					p2._x + h2._x, p2._y + h2._y,
					p2._x, p2._y
				];
			if (matrix)
				matrix._transformCoordinates(values, values, 4);
			return values;
		},

		subdivide: function(v, t) {
			var p1x = v[0], p1y = v[1],
				c1x = v[2], c1y = v[3],
				c2x = v[4], c2y = v[5],
				p2x = v[6], p2y = v[7];
			if (t === undefined)
				t = 0.5;
			var u = 1 - t,
				p3x = u * p1x + t * c1x, p3y = u * p1y + t * c1y,
				p4x = u * c1x + t * c2x, p4y = u * c1y + t * c2y,
				p5x = u * c2x + t * p2x, p5y = u * c2y + t * p2y,
				p6x = u * p3x + t * p4x, p6y = u * p3y + t * p4y,
				p7x = u * p4x + t * p5x, p7y = u * p4y + t * p5y,
				p8x = u * p6x + t * p7x, p8y = u * p6y + t * p7y;
			return [
				[p1x, p1y, p3x, p3y, p6x, p6y, p8x, p8y],
				[p8x, p8y, p7x, p7y, p5x, p5y, p2x, p2y]
			];
		},

		solveCubic: function (v, coord, val, roots, min, max) {
			var p1 = v[coord],
				c1 = v[coord + 2],
				c2 = v[coord + 4],
				p2 = v[coord + 6],
				res = 0;
			if (  !(p1 < val && p2 < val && c1 < val && c2 < val ||
					p1 > val && p2 > val && c1 > val && c2 > val)) {
				var c = 3 * (c1 - p1),
					b = 3 * (c2 - c1) - c,
					a = p2 - p1 - c - b;
				res = Numerical.solveCubic(a, b, c, p1 - val, roots, min, max);
			}
			return res;
		},

		getTimeOf: function(v, point) {
			var p1 = new Point(v[0], v[1]),
				p2 = new Point(v[6], v[7]),
				epsilon = 1e-12,
				t = point.isClose(p1, epsilon) ? 0
				  : point.isClose(p2, epsilon) ? 1
				  : null;
			if (t !== null)
				return t;
			var coords = [point.x, point.y],
				roots = [],
				geomEpsilon = 2e-7;
			for (var c = 0; c < 2; c++) {
				var count = Curve.solveCubic(v, c, coords[c], roots, 0, 1);
				for (var i = 0; i < count; i++) {
					t = roots[i];
					if (point.isClose(Curve.getPoint(v, t), geomEpsilon))
						return t;
				}
			}
			return point.isClose(p1, geomEpsilon) ? 0
				 : point.isClose(p2, geomEpsilon) ? 1
				 : null;
		},

		getNearestTime: function(v, point) {
			if (Curve.isStraight(v)) {
				var p1x = v[0], p1y = v[1],
					p2x = v[6], p2y = v[7],
					vx = p2x - p1x, vy = p2y - p1y,
					det = vx * vx + vy * vy;
				if (det === 0)
					return 0;
				var u = ((point.x - p1x) * vx + (point.y - p1y) * vy) / det;
				return u < 1e-12 ? 0
					 : u > 0.999999999999 ? 1
					 : Curve.getTimeOf(v,
						new Point(p1x + u * vx, p1y + u * vy));
			}

			var count = 100,
				minDist = Infinity,
				minT = 0;

			function refine(t) {
				if (t >= 0 && t <= 1) {
					var dist = point.getDistance(Curve.getPoint(v, t), true);
					if (dist < minDist) {
						minDist = dist;
						minT = t;
						return true;
					}
				}
			}

			for (var i = 0; i <= count; i++)
				refine(i / count);

			var step = 1 / (count * 2);
			while (step > 4e-7) {
				if (!refine(minT - step) && !refine(minT + step))
					step /= 2;
			}
			return minT;
		},

		getPart: function(v, from, to) {
			var flip = from > to;
			if (flip) {
				var tmp = from;
				from = to;
				to = tmp;
			}
			if (from > 0)
				v = Curve.subdivide(v, from)[1];
			if (to < 1)
				v = Curve.subdivide(v, (to - from) / (1 - from))[0];
			return flip
					? [v[6], v[7], v[4], v[5], v[2], v[3], v[0], v[1]]
					: v;
		},

		isFlatEnough: function(v, flatness) {
			var p1x = v[0], p1y = v[1],
				c1x = v[2], c1y = v[3],
				c2x = v[4], c2y = v[5],
				p2x = v[6], p2y = v[7],
				ux = 3 * c1x - 2 * p1x - p2x,
				uy = 3 * c1y - 2 * p1y - p2y,
				vx = 3 * c2x - 2 * p2x - p1x,
				vy = 3 * c2y - 2 * p2y - p1y;
			return Math.max(ux * ux, vx * vx) + Math.max(uy * uy, vy * vy)
					<= 16 * flatness * flatness;
		},

		getArea: function(v) {
			var p1x = v[0], p1y = v[1],
				c1x = v[2], c1y = v[3],
				c2x = v[4], c2y = v[5],
				p2x = v[6], p2y = v[7];
			return 3 * ((p2y - p1y) * (c1x + c2x) - (p2x - p1x) * (c1y + c2y)
					+ c1y * (p1x - c2x) - c1x * (p1y - c2y)
					+ p2y * (c2x + p1x / 3) - p2x * (c2y + p1y / 3)) / 20;
		},

		getBounds: function(v) {
			var min = v.slice(0, 2),
				max = min.slice(),
				roots = [0, 0];
			for (var i = 0; i < 2; i++)
				Curve._addBounds(v[i], v[i + 2], v[i + 4], v[i + 6],
						i, 0, min, max, roots);
			return new Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
		},

		_addBounds: function(v0, v1, v2, v3, coord, padding, min, max, roots) {
			function add(value, padding) {
				var left = value - padding,
					right = value + padding;
				if (left < min[coord])
					min[coord] = left;
				if (right > max[coord])
					max[coord] = right;
			}

			padding /= 2;
			var minPad = min[coord] - padding,
				maxPad = max[coord] + padding;
			if (    v0 < minPad || v1 < minPad || v2 < minPad || v3 < minPad ||
					v0 > maxPad || v1 > maxPad || v2 > maxPad || v3 > maxPad) {
				if (v1 < v0 != v1 < v3 && v2 < v0 != v2 < v3) {
					add(v0, padding);
					add(v3, padding);
				} else {
					var a = 3 * (v1 - v2) - v0 + v3,
						b = 2 * (v0 + v2) - 4 * v1,
						c = v1 - v0,
						count = Numerical.solveQuadratic(a, b, c, roots),
						tMin = 4e-7,
						tMax = 1 - tMin;
					add(v3, 0);
					for (var i = 0; i < count; i++) {
						var t = roots[i],
							u = 1 - t;
						if (tMin < t && t < tMax)
							add(u * u * u * v0
								+ 3 * u * u * t * v1
								+ 3 * u * t * t * v2
								+ t * t * t * v3,
								padding);
					}
				}
			}
		}
	}}, Base.each(
		['getBounds', 'getStrokeBounds', 'getHandleBounds'],
		function(name) {
			this[name] = function() {
				if (!this._bounds)
					this._bounds = {};
				var bounds = this._bounds[name];
				if (!bounds) {
					bounds = this._bounds[name] = Path[name](
							[this._segment1, this._segment2], false, this._path);
				}
				return bounds.clone();
			};
		},
	{

	}), Base.each({
		isStraight: function(l, h1, h2) {
			if (h1.isZero() && h2.isZero()) {
				return true;
			} else {
				var v = l.getVector(),
					epsilon = 2e-7;
				if (v.isZero()) {
					return false;
				} else if (l.getDistance(h1) < epsilon
						&& l.getDistance(h2) < epsilon) {
					var div = v.dot(v),
						p1 = v.dot(h1) / div,
						p2 = v.dot(h2) / div;
					return p1 >= 0 && p1 <= 1 && p2 <= 0 && p2 >= -1;
				}
			}
			return false;
		},

		isLinear: function(l, h1, h2) {
			var third = l.getVector().divide(3);
			return h1.equals(third) && h2.negate().equals(third);
		}
	}, function(test, name) {
		this[name] = function() {
			var seg1 = this._segment1,
				seg2 = this._segment2;
			return test(new Line(seg1._point, seg2._point),
					seg1._handleOut, seg2._handleIn);
		};

		this.statics[name] = function(v) {
			var p1x = v[0], p1y = v[1],
				p2x = v[6], p2y = v[7];
			return test(new Line(p1x, p1y, p2x, p2y),
					new Point(v[2] - p1x, v[3] - p1y),
					new Point(v[4] - p2x, v[5] - p2y));
		};
	}, {
		statics: {},

		hasHandles: function() {
			return !this._segment1._handleOut.isZero()
					|| !this._segment2._handleIn.isZero();
		},

		isCollinear: function(curve) {
			return curve && this.isStraight() && curve.isStraight()
					&& this.getLine().isCollinear(curve.getLine());
		},

		isHorizontal: function() {
			return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).y)
					< 1e-7;
		},

		isVertical: function() {
			return this.isStraight() && Math.abs(this.getTangentAtTime(0.5).x)
					< 1e-7;
		}
	}), {
		beans: false,

		getLocationAt: function(offset, _isTime) {
			return this.getLocationAtTime(
					_isTime ? offset : this.getTimeAt(offset));
		},

		getLocationAtTime: function(t) {
			return t != null && t >= 0 && t <= 1
					? new CurveLocation(this, t)
					: null;
		},

		getTimeAt: function(offset, start) {
			return Curve.getTimeAt(this.getValues(), offset, start);
		},

		getParameterAt: '#getTimeAt',

		getOffsetAtTime: function(t) {
			return this.getPartLength(0, t);
		},

		getLocationOf: function() {
			return this.getLocationAtTime(this.getTimeOf(Point.read(arguments)));
		},

		getOffsetOf: function() {
			var loc = this.getLocationOf.apply(this, arguments);
			return loc ? loc.getOffset() : null;
		},

		getTimeOf: function() {
			return Curve.getTimeOf(this.getValues(), Point.read(arguments));
		},

		getParameterOf: '#getTimeOf',

		getNearestLocation: function() {
			var point = Point.read(arguments),
				values = this.getValues(),
				t = Curve.getNearestTime(values, point),
				pt = Curve.getPoint(values, t);
			return new CurveLocation(this, t, pt, null, point.getDistance(pt));
		},

		getNearestPoint: function() {
			var loc = this.getNearestLocation.apply(this, arguments);
			return loc ? loc.getPoint() : loc;
		}

	},
	new function() {
		var methods = ['getPoint', 'getTangent', 'getNormal', 'getWeightedTangent',
			'getWeightedNormal', 'getCurvature'];
		return Base.each(methods,
			function(name) {
				this[name + 'At'] = function(location, _isTime) {
					var values = this.getValues();
					return Curve[name](values, _isTime ? location
							: Curve.getTimeAt(values, location));
				};

				this[name + 'AtTime'] = function(time) {
					return Curve[name](this.getValues(), time);
				};
			}, {
				statics: {
					_evaluateMethods: methods
				}
			}
		);
	},
	new function() {

		function getLengthIntegrand(v) {
			var p1x = v[0], p1y = v[1],
				c1x = v[2], c1y = v[3],
				c2x = v[4], c2y = v[5],
				p2x = v[6], p2y = v[7],

				ax = 9 * (c1x - c2x) + 3 * (p2x - p1x),
				bx = 6 * (p1x + c2x) - 12 * c1x,
				cx = 3 * (c1x - p1x),

				ay = 9 * (c1y - c2y) + 3 * (p2y - p1y),
				by = 6 * (p1y + c2y) - 12 * c1y,
				cy = 3 * (c1y - p1y);

			return function(t) {
				var dx = (ax * t + bx) * t + cx,
					dy = (ay * t + by) * t + cy;
				return Math.sqrt(dx * dx + dy * dy);
			};
		}

		function getIterations(a, b) {
			return Math.max(2, Math.min(16, Math.ceil(Math.abs(b - a) * 32)));
		}

		function evaluate(v, t, type, normalized) {
			if (t == null || t < 0 || t > 1)
				return null;
			var p1x = v[0], p1y = v[1],
				c1x = v[2], c1y = v[3],
				c2x = v[4], c2y = v[5],
				p2x = v[6], p2y = v[7],
				isZero = Numerical.isZero;
			if (isZero(c1x - p1x) && isZero(c1y - p1y)) {
				c1x = p1x;
				c1y = p1y;
			}
			if (isZero(c2x - p2x) && isZero(c2y - p2y)) {
				c2x = p2x;
				c2y = p2y;
			}
			var cx = 3 * (c1x - p1x),
				bx = 3 * (c2x - c1x) - cx,
				ax = p2x - p1x - cx - bx,
				cy = 3 * (c1y - p1y),
				by = 3 * (c2y - c1y) - cy,
				ay = p2y - p1y - cy - by,
				x, y;
			if (type === 0) {
				x = t === 0 ? p1x : t === 1 ? p2x
						: ((ax * t + bx) * t + cx) * t + p1x;
				y = t === 0 ? p1y : t === 1 ? p2y
						: ((ay * t + by) * t + cy) * t + p1y;
			} else {
				var tMin = 4e-7,
					tMax = 1 - tMin;
				if (t < tMin) {
					x = cx;
					y = cy;
				} else if (t > tMax) {
					x = 3 * (p2x - c2x);
					y = 3 * (p2y - c2y);
				} else {
					x = (3 * ax * t + 2 * bx) * t + cx;
					y = (3 * ay * t + 2 * by) * t + cy;
				}
				if (normalized) {
					if (x === 0 && y === 0 && (t < tMin || t > tMax)) {
						x = c2x - c1x;
						y = c2y - c1y;
					}
					var len = Math.sqrt(x * x + y * y);
					if (len) {
						x /= len;
						y /= len;
					}
				}
				if (type === 3) {
					var x2 = 6 * ax * t + 2 * bx,
						y2 = 6 * ay * t + 2 * by,
						d = Math.pow(x * x + y * y, 3 / 2);
					x = d !== 0 ? (x * y2 - y * x2) / d : 0;
					y = 0;
				}
			}
			return type === 2 ? new Point(y, -x) : new Point(x, y);
		}

		return { statics: {

			getLength: function(v, a, b, ds) {
				if (a === undefined)
					a = 0;
				if (b === undefined)
					b = 1;
				if (Curve.isStraight(v)) {
					var c = v;
					if (b < 1) {
						c = Curve.subdivide(c, b)[0];
						a /= b;
					}
					if (a > 0) {
						c = Curve.subdivide(c, a)[1];
					}
					var dx = c[6] - c[0],
						dy = c[7] - c[1];
					return Math.sqrt(dx * dx + dy * dy);
				}
				return Numerical.integrate(ds || getLengthIntegrand(v), a, b,
						getIterations(a, b));
			},

			getTimeAt: function(v, offset, start) {
				if (start === undefined)
					start = offset < 0 ? 1 : 0;
				if (offset === 0)
					return start;
				var abs = Math.abs,
					epsilon = 1e-12,
					forward = offset > 0,
					a = forward ? start : 0,
					b = forward ? 1 : start,
					ds = getLengthIntegrand(v),
					rangeLength = Curve.getLength(v, a, b, ds),
					diff = abs(offset) - rangeLength;
				if (abs(diff) < epsilon) {
					return forward ? b : a;
				} else if (diff > epsilon) {
					return null;
				}
				var guess = offset / rangeLength,
					length = 0;
				function f(t) {
					length += Numerical.integrate(ds, start, t,
							getIterations(start, t));
					start = t;
					return length - offset;
				}
				return Numerical.findRoot(f, ds, start + guess, a, b, 32,
						1e-12);
			},

			getPoint: function(v, t) {
				return evaluate(v, t, 0, false);
			},

			getTangent: function(v, t) {
				return evaluate(v, t, 1, true);
			},

			getWeightedTangent: function(v, t) {
				return evaluate(v, t, 1, false);
			},

			getNormal: function(v, t) {
				return evaluate(v, t, 2, true);
			},

			getWeightedNormal: function(v, t) {
				return evaluate(v, t, 2, false);
			},

			getCurvature: function(v, t) {
				return evaluate(v, t, 3, false).x;
			}
		}};
	},
	new function() {

		function addLocation(locations, param, v1, c1, t1, p1, v2, c2, t2, p2,
				overlap) {
			var excludeStart = !overlap && param.excludeStart,
				excludeEnd = !overlap && param.excludeEnd,
				tMin = 4e-7,
				tMax = 1 - tMin;
			if (t1 == null)
				t1 = Curve.getTimeOf(v1, p1);
			if (t1 !== null && t1 >= (excludeStart ? tMin : 0) &&
				t1 <= (excludeEnd ? tMax : 1)) {
				if (t2 == null)
					t2 = Curve.getTimeOf(v2, p2);
				if (t2 !== null && t2 >= (excludeEnd ? tMin : 0) &&
					t2 <= (excludeStart ? tMax : 1)) {
					var renormalize = param.renormalize;
					if (renormalize) {
						var res = renormalize(t1, t2);
						t1 = res[0];
						t2 = res[1];
					}
					var loc1 = new CurveLocation(c1, t1,
							p1 || Curve.getPoint(v1, t1), overlap),
						loc2 = new CurveLocation(c2, t2,
							p2 || Curve.getPoint(v2, t2), overlap),
						flip = loc1.getPath() === loc2.getPath()
							&& loc1.getIndex() > loc2.getIndex(),
						loc = flip ? loc2 : loc1,
						include = param.include;
					loc1._intersection = loc2;
					loc2._intersection = loc1;
					if (!include || include(loc)) {
						CurveLocation.insert(locations, loc, true);
					}
				}
			}
		}

		function addCurveIntersections(v1, v2, c1, c2, locations, param, tMin, tMax,
				uMin, uMax, flip, recursion, calls) {
			if (++recursion >= 48 || ++calls > 4096)
				return calls;
			var q0x = v2[0], q0y = v2[1], q3x = v2[6], q3y = v2[7],
				getSignedDistance = Line.getSignedDistance,
				d1 = getSignedDistance(q0x, q0y, q3x, q3y, v2[2], v2[3]),
				d2 = getSignedDistance(q0x, q0y, q3x, q3y, v2[4], v2[5]),
				factor = d1 * d2 > 0 ? 3 / 4 : 4 / 9,
				dMin = factor * Math.min(0, d1, d2),
				dMax = factor * Math.max(0, d1, d2),
				dp0 = getSignedDistance(q0x, q0y, q3x, q3y, v1[0], v1[1]),
				dp1 = getSignedDistance(q0x, q0y, q3x, q3y, v1[2], v1[3]),
				dp2 = getSignedDistance(q0x, q0y, q3x, q3y, v1[4], v1[5]),
				dp3 = getSignedDistance(q0x, q0y, q3x, q3y, v1[6], v1[7]),
				hull = getConvexHull(dp0, dp1, dp2, dp3),
				top = hull[0],
				bottom = hull[1],
				tMinClip,
				tMaxClip;
			if (d1 === 0 && d2 === 0
					&& dp0 === 0 && dp1 === 0 && dp2 === 0 && dp3 === 0
				|| (tMinClip = clipConvexHull(top, bottom, dMin, dMax)) == null
				|| (tMaxClip = clipConvexHull(top.reverse(), bottom.reverse(),
					dMin, dMax)) == null)
				return calls;
			var tMinNew = tMin + (tMax - tMin) * tMinClip,
				tMaxNew = tMin + (tMax - tMin) * tMaxClip;
			if (Math.max(uMax - uMin, tMaxNew - tMinNew)
					< 1e-9) {
				var t = (tMinNew + tMaxNew) / 2,
					u = (uMin + uMax) / 2;
				v1 = c1.getValues();
				v2 = c2.getValues();
				addLocation(locations, param,
						flip ? v2 : v1, flip ? c2 : c1, flip ? u : t, null,
						flip ? v1 : v2, flip ? c1 : c2, flip ? t : u, null);
			} else {
				v1 = Curve.getPart(v1, tMinClip, tMaxClip);
				if (tMaxClip - tMinClip > 0.8) {
					if (tMaxNew - tMinNew > uMax - uMin) {
						var parts = Curve.subdivide(v1, 0.5),
							t = (tMinNew + tMaxNew) / 2;
						calls = addCurveIntersections(
								v2, parts[0], c2, c1, locations, param,
								uMin, uMax, tMinNew, t, !flip, recursion, calls);
						calls = addCurveIntersections(
								v2, parts[1], c2, c1, locations, param,
								uMin, uMax, t, tMaxNew, !flip, recursion, calls);
					} else {
						var parts = Curve.subdivide(v2, 0.5),
							u = (uMin + uMax) / 2;
						calls = addCurveIntersections(
								parts[0], v1, c2, c1, locations, param,
								uMin, u, tMinNew, tMaxNew, !flip, recursion, calls);
						calls = addCurveIntersections(
								parts[1], v1, c2, c1, locations, param,
								u, uMax, tMinNew, tMaxNew, !flip, recursion, calls);
					}
				} else {
					calls = addCurveIntersections(
							v2, v1, c2, c1, locations, param,
							uMin, uMax, tMinNew, tMaxNew, !flip, recursion, calls);
				}
			}
			return calls;
		}

		function getConvexHull(dq0, dq1, dq2, dq3) {
			var p0 = [ 0, dq0 ],
				p1 = [ 1 / 3, dq1 ],
				p2 = [ 2 / 3, dq2 ],
				p3 = [ 1, dq3 ],
				dist1 = dq1 - (2 * dq0 + dq3) / 3,
				dist2 = dq2 - (dq0 + 2 * dq3) / 3,
				hull;
			if (dist1 * dist2 < 0) {
				hull = [[p0, p1, p3], [p0, p2, p3]];
			} else {
				var distRatio = dist1 / dist2;
				hull = [
					distRatio >= 2 ? [p0, p1, p3]
					: distRatio <= 0.5 ? [p0, p2, p3]
					: [p0, p1, p2, p3],
					[p0, p3]
				];
			}
			return (dist1 || dist2) < 0 ? hull.reverse() : hull;
		}

		function clipConvexHull(hullTop, hullBottom, dMin, dMax) {
			if (hullTop[0][1] < dMin) {
				return clipConvexHullPart(hullTop, true, dMin);
			} else if (hullBottom[0][1] > dMax) {
				return clipConvexHullPart(hullBottom, false, dMax);
			} else {
				return hullTop[0][0];
			}
		}

		function clipConvexHullPart(part, top, threshold) {
			var px = part[0][0],
				py = part[0][1];
			for (var i = 1, l = part.length; i < l; i++) {
				var qx = part[i][0],
					qy = part[i][1];
				if (top ? qy >= threshold : qy <= threshold) {
					return qy === threshold ? qx
							: px + (threshold - py) * (qx - px) / (qy - py);
				}
				px = qx;
				py = qy;
			}
			return null;
		}

		function addCurveLineIntersections(v1, v2, c1, c2, locations, param) {
			var flip = Curve.isStraight(v1),
				vc = flip ? v2 : v1,
				vl = flip ? v1 : v2,
				lx1 = vl[0], ly1 = vl[1],
				lx2 = vl[6], ly2 = vl[7],
				ldx = lx2 - lx1,
				ldy = ly2 - ly1,
				angle = Math.atan2(-ldy, ldx),
				sin = Math.sin(angle),
				cos = Math.cos(angle),
				rvc = [];
			for(var i = 0; i < 8; i += 2) {
				var x = vc[i] - lx1,
					y = vc[i + 1] - ly1;
				rvc.push(
					x * cos - y * sin,
					x * sin + y * cos);
			}
			var roots = [],
				count = Curve.solveCubic(rvc, 1, 0, roots, 0, 1);
			for (var i = 0; i < count; i++) {
				var tc = roots[i],
					pc = Curve.getPoint(vc, tc),
					tl = Curve.getTimeOf(vl, pc);
				if (tl !== null) {
					var pl = Curve.getPoint(vl, tl),
						t1 = flip ? tl : tc,
						t2 = flip ? tc : tl;
					if (!param.excludeEnd || t2 > Numerical.CURVETIME_EPSILON) {
						addLocation(locations, param,
								v1, c1, t1, flip ? pl : pc,
								v2, c2, t2, flip ? pc : pl);
					}
				}
			}
		}

		function addLineIntersection(v1, v2, c1, c2, locations, param) {
			var pt = Line.intersect(
					v1[0], v1[1], v1[6], v1[7],
					v2[0], v2[1], v2[6], v2[7]);
			if (pt) {
				addLocation(locations, param, v1, c1, null, pt, v2, c2, null, pt);
			}
		}

		return { statics: {
			_getIntersections: function(v1, v2, c1, c2, locations, param) {
				if (!v2) {
					return Curve._getSelfIntersection(v1, c1, locations, param);
				}
				var epsilon = 2e-7,
					c1p1x = v1[0], c1p1y = v1[1],
					c1p2x = v1[6], c1p2y = v1[7],
					c2p1x = v2[0], c2p1y = v2[1],
					c2p2x = v2[6], c2p2y = v2[7],
					c1s1x = (3 * v1[2] + c1p1x) / 4,
					c1s1y = (3 * v1[3] + c1p1y) / 4,
					c1s2x = (3 * v1[4] + c1p2x) / 4,
					c1s2y = (3 * v1[5] + c1p2y) / 4,
					c2s1x = (3 * v2[2] + c2p1x) / 4,
					c2s1y = (3 * v2[3] + c2p1y) / 4,
					c2s2x = (3 * v2[4] + c2p2x) / 4,
					c2s2y = (3 * v2[5] + c2p2y) / 4,
					min = Math.min,
					max = Math.max;
				if (!(  max(c1p1x, c1s1x, c1s2x, c1p2x) + epsilon >
						min(c2p1x, c2s1x, c2s2x, c2p2x) &&
						min(c1p1x, c1s1x, c1s2x, c1p2x) - epsilon <
						max(c2p1x, c2s1x, c2s2x, c2p2x) &&
						max(c1p1y, c1s1y, c1s2y, c1p2y) + epsilon >
						min(c2p1y, c2s1y, c2s2y, c2p2y) &&
						min(c1p1y, c1s1y, c1s2y, c1p2y) - epsilon <
						max(c2p1y, c2s1y, c2s2y, c2p2y)))
					return locations;
				var overlaps = Curve.getOverlaps(v1, v2);
				if (overlaps) {
					for (var i = 0; i < 2; i++) {
						var overlap = overlaps[i];
						addLocation(locations, param,
							v1, c1, overlap[0], null,
							v2, c2, overlap[1], null, true);
					}
					return locations;
				}

				var straight1 = Curve.isStraight(v1),
					straight2 = Curve.isStraight(v2),
					straight = straight1 && straight2,
					before = locations.length;
				(straight
					? addLineIntersection
					: straight1 || straight2
						? addCurveLineIntersections
						: addCurveIntersections)(
							v1, v2, c1, c2, locations, param,
							0, 1, 0, 1, 0, 0, 0);
				if (straight && locations.length > before)
					return locations;
				var c1p1 = new Point(c1p1x, c1p1y),
					c1p2 = new Point(c1p2x, c1p2y),
					c2p1 = new Point(c2p1x, c2p1y),
					c2p2 = new Point(c2p2x, c2p2y);
				if (c1p1.isClose(c2p1, epsilon))
					addLocation(locations, param, v1, c1, 0, c1p1, v2, c2, 0, c2p1);
				if (!param.excludeStart && c1p1.isClose(c2p2, epsilon))
					addLocation(locations, param, v1, c1, 0, c1p1, v2, c2, 1, c2p2);
				if (!param.excludeEnd && c1p2.isClose(c2p1, epsilon))
					addLocation(locations, param, v1, c1, 1, c1p2, v2, c2, 0, c2p1);
				if (c1p2.isClose(c2p2, epsilon))
					addLocation(locations, param, v1, c1, 1, c1p2, v2, c2, 1, c2p2);
				return locations;
			},

			_getSelfIntersection: function(v1, c1, locations, param) {
				var p1x = v1[0], p1y = v1[1],
					h1x = v1[2], h1y = v1[3],
					h2x = v1[4], h2y = v1[5],
					p2x = v1[6], p2y = v1[7];
				var line = new Line(p1x, p1y, p2x, p2y, false),
					side1 = line.getSide(new Point(h1x, h1y), true),
					side2 = line.getSide(new Point(h2x, h2y), true);
				if (side1 === side2) {
					var edgeSum = (p1x - h2x) * (h1y - p2y)
								+ (h1x - p2x) * (h2y - p1y);
					if (edgeSum * side1 > 0)
						return locations;
				}
				var ax = p2x - 3 * h2x + 3 * h1x - p1x,
					bx = h2x - 2 * h1x + p1x,
					cx = h1x - p1x,
					ay = p2y - 3 * h2y + 3 * h1y - p1y,
					by = h2y - 2 * h1y + p1y,
					cy = h1y - p1y,
					ac = ay * cx - ax * cy,
					ab = ay * bx - ax * by,
					bc = by * cx - bx * cy;
				if (ac * ac - 4 * ab * bc < 0) {
					var roots = [],
						tSplit,
						count = Numerical.solveCubic(
								ax * ax  + ay * ay,
								3 * (ax * bx + ay * by),
								2 * (bx * bx + by * by) + ax * cx + ay * cy,
								bx * cx + by * cy,
								roots, 0, 1);
					if (count > 0) {
						for (var i = 0, maxCurvature = 0; i < count; i++) {
							var curvature = Math.abs(
									c1.getCurvatureAtTime(roots[i]));
							if (curvature > maxCurvature) {
								maxCurvature = curvature;
								tSplit = roots[i];
							}
						}
						var parts = Curve.subdivide(v1, tSplit);
						param.excludeEnd = true;
						param.renormalize = function(t1, t2) {
							return [t1 * tSplit, t2 * (1 - tSplit) + tSplit];
						};
						Curve._getIntersections(parts[0], parts[1], c1, c1,
								locations, param);
					}
				}
				return locations;
			},

			getOverlaps: function(v1, v2) {
				var abs = Math.abs,
					timeEpsilon = 4e-7,
					geomEpsilon = 2e-7,
					straight1 = Curve.isStraight(v1),
					straight2 = Curve.isStraight(v2),
					straightBoth = straight1 && straight2;

				function getSquaredLineLength(v) {
					var x = v[6] - v[0],
						y = v[7] - v[1];
					return x * x + y * y;
				}

				var flip = getSquaredLineLength(v1) < getSquaredLineLength(v2),
					l1 = flip ? v2 : v1,
					l2 = flip ? v1 : v2,
					line = new Line(l1[0], l1[1], l1[6], l1[7]);
				if (line.getDistance(new Point(l2[0], l2[1])) < geomEpsilon &&
					line.getDistance(new Point(l2[6], l2[7])) < geomEpsilon) {
					if (!straightBoth &&
						line.getDistance(new Point(l1[2], l1[3])) < geomEpsilon &&
						line.getDistance(new Point(l1[4], l1[5])) < geomEpsilon &&
						line.getDistance(new Point(l2[2], l2[3])) < geomEpsilon &&
						line.getDistance(new Point(l2[4], l2[5])) < geomEpsilon) {
						straight1 = straight2 = straightBoth = true;
					}
				} else if (straightBoth) {
					return null;
				}
				if (straight1 ^ straight2) {
					return null;
				}

				var v = [v1, v2],
					pairs = [];
				for (var i = 0, t1 = 0;
						i < 2 && pairs.length < 2;
						i += t1 === 0 ? 0 : 1, t1 = t1 ^ 1) {
					var t2 = Curve.getTimeOf(v[i ^ 1], new Point(
							v[i][t1 === 0 ? 0 : 6],
							v[i][t1 === 0 ? 1 : 7]));
					if (t2 != null) {
						var pair = i === 0 ? [t1, t2] : [t2, t1];
						if (pairs.length === 0 ||
							abs(pair[0] - pairs[0][0]) > timeEpsilon &&
							abs(pair[1] - pairs[0][1]) > timeEpsilon)
							pairs.push(pair);
					}
					if (i === 1 && pairs.length === 0)
						break;
				}
				if (pairs.length !== 2) {
					pairs = null;
				} else if (!straightBoth) {
					var o1 = Curve.getPart(v1, pairs[0][0], pairs[1][0]),
						o2 = Curve.getPart(v2, pairs[0][1], pairs[1][1]);
					if (abs(o2[2] - o1[2]) > geomEpsilon ||
						abs(o2[3] - o1[3]) > geomEpsilon ||
						abs(o2[4] - o1[4]) > geomEpsilon ||
						abs(o2[5] - o1[5]) > geomEpsilon)
						pairs = null;
				}
				return pairs;
			}
		}};
	});

	var CurveLocation = Base.extend({
		_class: 'CurveLocation',
		beans: true,

		initialize: function CurveLocation(curve, time, point, _overlap, _distance) {
			if (time > 0.9999996) {
				var next = curve.getNext();
				if (next) {
					time = 0;
					curve = next;
				}
			}
			this._setCurve(curve);
			this._time = time;
			this._point = point || curve.getPointAtTime(time);
			this._overlap = _overlap;
			this._distance = _distance;
			this._intersection = this._next = this._previous = null;
		},

		_setCurve: function(curve) {
			var path = curve._path;
			this._path = path;
			this._version = path ? path._version : 0;
			this._curve = curve;
			this._segment = null;
			this._segment1 = curve._segment1;
			this._segment2 = curve._segment2;
		},

		_setSegment: function(segment) {
			this._setCurve(segment.getCurve());
			this._segment = segment;
			this._time = segment === this._segment1 ? 0 : 1;
			this._point = segment._point.clone();
		},

		getSegment: function() {
			var curve = this.getCurve(),
				segment = this._segment;
			if (!segment) {
				var time = this.getTime();
				if (time === 0) {
					segment = curve._segment1;
				} else if (time === 1) {
					segment = curve._segment2;
				} else if (time != null) {
					segment = curve.getPartLength(0, time)
						< curve.getPartLength(time, 1)
							? curve._segment1
							: curve._segment2;
				}
				this._segment = segment;
			}
			return segment;
		},

		getCurve: function() {
			var path = this._path,
				that = this;
			if (path && path._version !== this._version) {
				this._time = this._curve = this._offset = null;
			}

			function trySegment(segment) {
				var curve = segment && segment.getCurve();
				if (curve && (that._time = curve.getTimeOf(that._point))
						!= null) {
					that._setCurve(curve);
					that._segment = segment;
					return curve;
				}
			}

			return this._curve
				|| trySegment(this._segment)
				|| trySegment(this._segment1)
				|| trySegment(this._segment2.getPrevious());
		},

		getPath: function() {
			var curve = this.getCurve();
			return curve && curve._path;
		},

		getIndex: function() {
			var curve = this.getCurve();
			return curve && curve.getIndex();
		},

		getTime: function() {
			var curve = this.getCurve(),
				time = this._time;
			return curve && time == null
				? this._time = curve.getTimeOf(this._point)
				: time;
		},

		getParameter: '#getTime',

		getPoint: function() {
			return this._point;
		},

		getOffset: function() {
			var offset = this._offset;
			if (offset == null) {
				offset = 0;
				var path = this.getPath(),
					index = this.getIndex();
				if (path && index != null) {
					var curves = path.getCurves();
					for (var i = 0; i < index; i++)
						offset += curves[i].getLength();
				}
				this._offset = offset += this.getCurveOffset();
			}
			return offset;
		},

		getCurveOffset: function() {
			var curve = this.getCurve(),
				time = this.getTime();
			return time != null && curve && curve.getPartLength(0, time);
		},

		getIntersection: function() {
			return this._intersection;
		},

		getDistance: function() {
			return this._distance;
		},

		divide: function() {
			var curve = this.getCurve(),
				res = null;
			if (curve) {
				res = curve.divideAtTime(this.getTime());
				if (res)
					this._setSegment(res._segment1);
			}
			return res;
		},

		split: function() {
			var curve = this.getCurve();
			return curve ? curve.splitAtTime(this.getTime()) : null;
		},

		equals: function(loc, _ignoreOther) {
			var res = this === loc,
				epsilon = 2e-7;
			if (!res && loc instanceof CurveLocation
					&& this.getPath() === loc.getPath()
					&& this.getPoint().isClose(loc.getPoint(), epsilon)) {
				var c1 = this.getCurve(),
					c2 = loc.getCurve(),
					abs = Math.abs,
					diff = abs(
						((c1.isLast() && c2.isFirst() ? -1 : c1.getIndex())
								+ this.getTime()) -
						((c2.isLast() && c1.isFirst() ? -1 : c2.getIndex())
								+ loc.getTime()));
				res = (diff < 4e-7
					|| ((diff = abs(this.getOffset() - loc.getOffset())) < epsilon
						|| abs(this.getPath().getLength() - diff) < epsilon))
					&& (_ignoreOther
						|| (!this._intersection && !loc._intersection
							|| this._intersection && this._intersection.equals(
									loc._intersection, true)));
			}
			return res;
		},

		toString: function() {
			var parts = [],
				point = this.getPoint(),
				f = Formatter.instance;
			if (point)
				parts.push('point: ' + point);
			var index = this.getIndex();
			if (index != null)
				parts.push('index: ' + index);
			var time = this.getTime();
			if (time != null)
				parts.push('time: ' + f.number(time));
			if (this._distance != null)
				parts.push('distance: ' + f.number(this._distance));
			return '{ ' + parts.join(', ') + ' }';
		},

		isTouching: function() {
			var inter = this._intersection;
			if (inter && this.getTangent().isCollinear(inter.getTangent())) {
				var curve1 = this.getCurve(),
					curve2 = inter.getCurve();
				return !(curve1.isStraight() && curve2.isStraight()
						&& curve1.getLine().intersect(curve2.getLine()));
			}
			return false;
		},

		isCrossing: function() {
			var inter = this._intersection;
			if (!inter)
				return false;
			var t1 = this.getTime(),
				t2 = inter.getTime(),
				tMin = 4e-7,
				tMax = 1 - tMin,
				t1Inside = t1 > tMin && t1 < tMax,
				t2Inside = t2 > tMin && t2 < tMax;
			if (t1Inside && t2Inside)
				return !this.isTouching();
			var c2 = this.getCurve(),
				c1 = t1 <= tMin ? c2.getPrevious() : c2,
				c4 = inter.getCurve(),
				c3 = t2 <= tMin ? c4.getPrevious() : c4;
			if (t1 >= tMax)
				c2 = c2.getNext();
			if (t2 >= tMax)
				c4 = c4.getNext();
			if (!c1 || !c2 || !c3 || !c4)
				return false;

			function isInRange(angle, min, max) {
				return min < max
						? angle > min && angle < max
						: angle > min || angle < max;
			}

			var lenghts = [];
			if (!t1Inside)
				lenghts.push(c1.getLength(), c2.getLength());
			if (!t2Inside)
				lenghts.push(c3.getLength(), c4.getLength());
			var pt = this.getPoint(),
				offset = Math.min.apply(Math, lenghts) / 64,
				v2 = t1Inside ? c2.getTangentAtTime(t1)
						: c2.getPointAt(offset).subtract(pt),
				v1 = t1Inside ? v2.negate()
						: c1.getPointAt(-offset).subtract(pt),
				v4 = t2Inside ? c4.getTangentAtTime(t2)
						: c4.getPointAt(offset).subtract(pt),
				v3 = t2Inside ? v4.negate()
						: c3.getPointAt(-offset).subtract(pt),
				a1 = v1.getAngle(),
				a2 = v2.getAngle(),
				a3 = v3.getAngle(),
				a4 = v4.getAngle();
			return !!(t1Inside
					? (isInRange(a1, a3, a4) ^ isInRange(a2, a3, a4)) &&
					  (isInRange(a1, a4, a3) ^ isInRange(a2, a4, a3))
					: (isInRange(a3, a1, a2) ^ isInRange(a4, a1, a2)) &&
					  (isInRange(a3, a2, a1) ^ isInRange(a4, a2, a1)));
		},

		hasOverlap: function() {
			return !!this._overlap;
		}
	}, Base.each(Curve._evaluateMethods, function(name) {
		var get = name + 'At';
		this[name] = function() {
			var curve = this.getCurve(),
				time = this.getTime();
			return time != null && curve && curve[get](time, true);
		};
	}, {
		preserve: true
	}),
	new function() {

		function insert(locations, loc, merge) {
			var length = locations.length,
				l = 0,
				r = length - 1;

			function search(index, dir) {
				for (var i = index + dir; i >= -1 && i <= length; i += dir) {
					var loc2 = locations[((i % length) + length) % length];
					if (!loc.getPoint().isClose(loc2.getPoint(),
							2e-7))
						break;
					if (loc.equals(loc2))
						return loc2;
				}
				return null;
			}

			while (l <= r) {
				var m = (l + r) >>> 1,
					loc2 = locations[m],
					found;
				if (merge && (found = loc.equals(loc2) ? loc2
						: (search(m, -1) || search(m, 1)))) {
					if (loc._overlap) {
						found._overlap = found._intersection._overlap = true;
					}
					return found;
				}
			var path1 = loc.getPath(),
				path2 = loc2.getPath(),
				diff = path1 === path2
					? (loc.getIndex() + loc.getTime())
					- (loc2.getIndex() + loc2.getTime())
					: path1._id - path2._id;
				if (diff < 0) {
					r = m - 1;
				} else {
					l = m + 1;
				}
			}
			locations.splice(l, 0, loc);
			return loc;
		}

		return { statics: {
			insert: insert,

			expand: function(locations) {
				var expanded = locations.slice();
				for (var i = locations.length - 1; i >= 0; i--) {
					insert(expanded, locations[i]._intersection, false);
				}
				return expanded;
			}
		}};
	});

	var PathItem = Item.extend({
		_class: 'PathItem',
		_selectBounds: false,
		_canScaleStroke: true,

		initialize: function PathItem() {
		},

		statics: {
			create: function(pathData) {
				var ctor = (pathData && pathData.match(/m/gi) || []).length > 1
						|| /z\s*\S+/i.test(pathData) ? CompoundPath : Path;
				return new ctor(pathData);
			}
		},

		_asPathItem: function() {
			return this;
		},

		setPathData: function(data) {

			var parts = data && data.match(/[mlhvcsqtaz][^mlhvcsqtaz]*/ig),
				coords,
				relative = false,
				previous,
				control,
				current = new Point(),
				start = new Point();

			function getCoord(index, coord) {
				var val = +coords[index];
				if (relative)
					val += current[coord];
				return val;
			}

			function getPoint(index) {
				return new Point(
					getCoord(index, 'x'),
					getCoord(index + 1, 'y')
				);
			}

			this.clear();

			for (var i = 0, l = parts && parts.length; i < l; i++) {
				var part = parts[i],
					command = part[0],
					lower = command.toLowerCase();
				coords = part.match(/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g);
				var length = coords && coords.length;
				relative = command === lower;
				if (previous === 'z' && !/[mz]/.test(lower))
					this.moveTo(current = start);
				switch (lower) {
				case 'm':
				case 'l':
					var move = lower === 'm';
					for (var j = 0; j < length; j += 2)
						this[j === 0 && move ? 'moveTo' : 'lineTo'](
								current = getPoint(j));
					control = current;
					if (move)
						start = current;
					break;
				case 'h':
				case 'v':
					var coord = lower === 'h' ? 'x' : 'y';
					for (var j = 0; j < length; j++) {
						current[coord] = getCoord(j, coord);
						this.lineTo(current);
					}
					control = current;
					break;
				case 'c':
					for (var j = 0; j < length; j += 6) {
						this.cubicCurveTo(
								getPoint(j),
								control = getPoint(j + 2),
								current = getPoint(j + 4));
					}
					break;
				case 's':
					for (var j = 0; j < length; j += 4) {
						this.cubicCurveTo(
								/[cs]/.test(previous)
										? current.multiply(2).subtract(control)
										: current,
								control = getPoint(j),
								current = getPoint(j + 2));
						previous = lower;
					}
					break;
				case 'q':
					for (var j = 0; j < length; j += 4) {
						this.quadraticCurveTo(
								control = getPoint(j),
								current = getPoint(j + 2));
					}
					break;
				case 't':
					for (var j = 0; j < length; j += 2) {
						this.quadraticCurveTo(
								control = (/[qt]/.test(previous)
										? current.multiply(2).subtract(control)
										: current),
								current = getPoint(j));
						previous = lower;
					}
					break;
				case 'a':
					for (var j = 0; j < length; j += 7) {
						this.arcTo(current = getPoint(j + 5),
								new Size(+coords[j], +coords[j + 1]),
								+coords[j + 2], +coords[j + 4], +coords[j + 3]);
					}
					break;
				case 'z':
					this.closePath(1e-12);
					break;
				}
				previous = lower;
			}
		},

		_canComposite: function() {
			return !(this.hasFill() && this.hasStroke());
		},

		_contains: function(point) {
			var winding = point.isInside(
					this.getBounds({ internal: true, handle: true }))
						&& this._getWinding(point);
			return !!(this.getFillRule() === 'evenodd' ? winding & 1 : winding);
		},

		getIntersections: function(path, include, _matrix, _returnFirst) {
			var self = this === path || !path,
				matrix1 = this._matrix._orNullIfIdentity(),
				matrix2 = self ? matrix1
					: (_matrix || path._matrix)._orNullIfIdentity();
			if (!self && !this.getBounds(matrix1).touches(path.getBounds(matrix2)))
				return [];
			var curves1 = this.getCurves(),
				curves2 = self ? curves1 : path.getCurves(),
				length1 = curves1.length,
				length2 = self ? length1 : curves2.length,
				values2 = [],
				arrays = [],
				locations,
				path;
			for (var i = 0; i < length2; i++)
				values2[i] = curves2[i].getValues(matrix2);
			for (var i = 0; i < length1; i++) {
				var curve1 = curves1[i],
					values1 = self ? values2[i] : curve1.getValues(matrix1),
					path1 = curve1.getPath();
				if (path1 !== path) {
					path = path1;
					locations = [];
					arrays.push(locations);
				}
				if (self) {
					Curve._getSelfIntersection(values1, curve1, locations, {
						include: include,
						excludeStart: length1 === 1 &&
								curve1.getPoint1().equals(curve1.getPoint2())
					});
				}
				for (var j = self ? i + 1 : 0; j < length2; j++) {
					if (_returnFirst && locations.length)
						return locations;
					var curve2 = curves2[j];
					Curve._getIntersections(
						values1, values2[j], curve1, curve2, locations,
						{
							include: include,
							excludeStart: self && curve1.getPrevious() === curve2,
							excludeEnd: self && curve1.getNext() === curve2
						}
					);
				}
			}
			locations = [];
			for (var i = 0, l = arrays.length; i < l; i++) {
				locations.push.apply(locations, arrays[i]);
			}
			return locations;
		},

		getCrossings: function(path) {
			return this.getIntersections(path, function(inter) {
				return inter._overlap || inter.isCrossing();
			});
		},

		getNearestLocation: function() {
			var point = Point.read(arguments),
				curves = this.getCurves(),
				minDist = Infinity,
				minLoc = null;
			for (var i = 0, l = curves.length; i < l; i++) {
				var loc = curves[i].getNearestLocation(point);
				if (loc._distance < minDist) {
					minDist = loc._distance;
					minLoc = loc;
				}
			}
			return minLoc;
		},

		getNearestPoint: function() {
			var loc = this.getNearestLocation.apply(this, arguments);
			return loc ? loc.getPoint() : loc;
		},

		interpolate: function(from, to, factor) {
			var isPath = !this._children,
				name = isPath ? '_segments' : '_children',
				itemsFrom = from[name],
				itemsTo = to[name],
				items = this[name];
			if (!itemsFrom || !itemsTo || itemsFrom.length !== itemsTo.length) {
				throw new Error('Invalid operands in interpolate() call: ' +
						from + ', ' + to);
			}
			var current = items.length,
				length = itemsTo.length;
			if (current < length) {
				var ctor = isPath ? Segment : Path;
				for (var i = current; i < length; i++) {
					this.add(new ctor());
				}
			} else if (current > length) {
				this[isPath ? 'removeSegments' : 'removeChildren'](length, current);
			}
			for (var i = 0; i < length; i++) {
				items[i].interpolate(itemsFrom[i], itemsTo[i], factor);
			}
			if (isPath) {
				this.setClosed(from._closed);
				this._changed(9);
			}
		},

	});

	var Path = PathItem.extend({
		_class: 'Path',
		_serializeFields: {
			segments: [],
			closed: false
		},

		initialize: function Path(arg) {
			this._closed = false;
			this._segments = [];
			this._version = 0;
			var segments = Array.isArray(arg)
				? typeof arg[0] === 'object'
					? arg
					: arguments
				: arg && (arg.size === undefined && (arg.x !== undefined
						|| arg.point !== undefined))
					? arguments
					: null;
			if (segments && segments.length > 0) {
				this.setSegments(segments);
			} else {
				this._curves = undefined;
				this._segmentSelection = 0;
				if (!segments && typeof arg === 'string') {
					this.setPathData(arg);
					arg = null;
				}
			}
			this._initialize(!segments && arg);
		},

		_equals: function(item) {
			return this._closed === item._closed
					&& Base.equals(this._segments, item._segments);
		},

		copyContent: function(source) {
			this.setSegments(source._segments);
			this._closed = source._closed;
			var clockwise = source._clockwise;
			if (clockwise !== undefined)
				this._clockwise = clockwise;
		},

		_changed: function _changed(flags) {
			_changed.base.call(this, flags);
			if (flags & 8) {
				this._length = this._area = this._clockwise = this._monoCurves =
						undefined;
				if (flags & 16) {
					this._version++;
				} else if (this._curves) {
				   for (var i = 0, l = this._curves.length; i < l; i++)
						this._curves[i]._changed();
				}
			} else if (flags & 32) {
				this._bounds = undefined;
			}
		},

		getStyle: function() {
			var parent = this._parent;
			return (parent instanceof CompoundPath ? parent : this)._style;
		},

		getSegments: function() {
			return this._segments;
		},

		setSegments: function(segments) {
			var fullySelected = this.isFullySelected();
			this._segments.length = 0;
			this._segmentSelection = 0;
			this._curves = undefined;
			if (segments && segments.length > 0)
				this._add(Segment.readAll(segments));
			if (fullySelected)
				this.setFullySelected(true);
		},

		getFirstSegment: function() {
			return this._segments[0];
		},

		getLastSegment: function() {
			return this._segments[this._segments.length - 1];
		},

		getCurves: function() {
			var curves = this._curves,
				segments = this._segments;
			if (!curves) {
				var length = this._countCurves();
				curves = this._curves = new Array(length);
				for (var i = 0; i < length; i++)
					curves[i] = new Curve(this, segments[i],
						segments[i + 1] || segments[0]);
			}
			return curves;
		},

		getFirstCurve: function() {
			return this.getCurves()[0];
		},

		getLastCurve: function() {
			var curves = this.getCurves();
			return curves[curves.length - 1];
		},

		isClosed: function() {
			return this._closed;
		},

		setClosed: function(closed) {
			if (this._closed != (closed = !!closed)) {
				this._closed = closed;
				if (this._curves) {
					var length = this._curves.length = this._countCurves();
					if (closed)
						this._curves[length - 1] = new Curve(this,
							this._segments[length - 1], this._segments[0]);
				}
				this._changed(25);
			}
		}
	}, {
		beans: true,

		getPathData: function(_matrix, _precision) {
			var segments = this._segments,
				length = segments.length,
				f = new Formatter(_precision),
				coords = new Array(6),
				first = true,
				curX, curY,
				prevX, prevY,
				inX, inY,
				outX, outY,
				parts = [];

			function addSegment(segment, skipLine) {
				segment._transformCoordinates(_matrix, coords);
				curX = coords[0];
				curY = coords[1];
				if (first) {
					parts.push('M' + f.pair(curX, curY));
					first = false;
				} else {
					inX = coords[2];
					inY = coords[3];
					if (inX === curX && inY === curY
							&& outX === prevX && outY === prevY) {
						if (!skipLine)
							parts.push('l' + f.pair(curX - prevX, curY - prevY));
					} else {
						parts.push('c' + f.pair(outX - prevX, outY - prevY)
								+ ' ' + f.pair(inX - prevX, inY - prevY)
								+ ' ' + f.pair(curX - prevX, curY - prevY));
					}
				}
				prevX = curX;
				prevY = curY;
				outX = coords[4];
				outY = coords[5];
			}

			if (length === 0)
				return '';

			for (var i = 0; i < length; i++)
				addSegment(segments[i]);
			if (this._closed && length > 0) {
				addSegment(segments[0], true);
				parts.push('z');
			}
			return parts.join('');
		},

		isEmpty: function() {
			return this._segments.length === 0;
		},

		_transformContent: function(matrix) {
			var segments = this._segments,
				coords = new Array(6);
			for (var i = 0, l = segments.length; i < l; i++)
				segments[i]._transformCoordinates(matrix, coords, true);
			return true;
		},

		_add: function(segs, index) {
			var segments = this._segments,
				curves = this._curves,
				amount = segs.length,
				append = index == null,
				index = append ? segments.length : index;
			for (var i = 0; i < amount; i++) {
				var segment = segs[i];
				if (segment._path)
					segment = segs[i] = segment.clone();
				segment._path = this;
				segment._index = index + i;
				if (segment._selection)
					this._updateSelection(segment, 0, segment._selection);
			}
			if (append) {
				segments.push.apply(segments, segs);
			} else {
				segments.splice.apply(segments, [index, 0].concat(segs));
				for (var i = index + amount, l = segments.length; i < l; i++)
					segments[i]._index = i;
			}
			if (curves) {
				var total = this._countCurves(),
					start = index > 0 && index + amount - 1 === total ? index - 1
						: index,
					insert = start,
					end = Math.min(start + amount, total);
				if (segs._curves) {
					curves.splice.apply(curves, [start, 0].concat(segs._curves));
					insert += segs._curves.length;
				}
				for (var i = insert; i < end; i++)
					curves.splice(i, 0, new Curve(this, null, null));
				this._adjustCurves(start, end);
			}
			this._changed(25);
			return segs;
		},

		_adjustCurves: function(start, end) {
			var segments = this._segments,
				curves = this._curves,
				curve;
			for (var i = start; i < end; i++) {
				curve = curves[i];
				curve._path = this;
				curve._segment1 = segments[i];
				curve._segment2 = segments[i + 1] || segments[0];
				curve._changed();
			}
			if (curve = curves[this._closed && start === 0 ? segments.length - 1
					: start - 1]) {
				curve._segment2 = segments[start] || segments[0];
				curve._changed();
			}
			if (curve = curves[end]) {
				curve._segment1 = segments[end];
				curve._changed();
			}
		},

		_countCurves: function() {
			var length = this._segments.length;
			return !this._closed && length > 0 ? length - 1 : length;
		},

		add: function(segment1 ) {
			return arguments.length > 1 && typeof segment1 !== 'number'
				? this._add(Segment.readAll(arguments))
				: this._add([ Segment.read(arguments) ])[0];
		},

		insert: function(index, segment1 ) {
			return arguments.length > 2 && typeof segment1 !== 'number'
				? this._add(Segment.readAll(arguments, 1), index)
				: this._add([ Segment.read(arguments, 1) ], index)[0];
		},

		addSegment: function() {
			return this._add([ Segment.read(arguments) ])[0];
		},

		insertSegment: function(index ) {
			return this._add([ Segment.read(arguments, 1) ], index)[0];
		},

		addSegments: function(segments) {
			return this._add(Segment.readAll(segments));
		},

		insertSegments: function(index, segments) {
			return this._add(Segment.readAll(segments), index);
		},

		removeSegment: function(index) {
			return this.removeSegments(index, index + 1)[0] || null;
		},

		removeSegments: function(start, end, _includeCurves) {
			start = start || 0;
			end = Base.pick(end, this._segments.length);
			var segments = this._segments,
				curves = this._curves,
				count = segments.length,
				removed = segments.splice(start, end - start),
				amount = removed.length;
			if (!amount)
				return removed;
			for (var i = 0; i < amount; i++) {
				var segment = removed[i];
				if (segment._selection)
					this._updateSelection(segment, segment._selection, 0);
				segment._index = segment._path = null;
			}
			for (var i = start, l = segments.length; i < l; i++)
				segments[i]._index = i;
			if (curves) {
				var index = start > 0 && end === count + (this._closed ? 1 : 0)
						? start - 1
						: start,
					curves = curves.splice(index, amount);
				for (var i = curves.length - 1; i >= 0; i--)
					curves[i]._path = null;
				if (_includeCurves)
					removed._curves = curves.slice(1);
				this._adjustCurves(index, index);
			}
			this._changed(25);
			return removed;
		},

		clear: '#removeSegments',

		hasHandles: function() {
			var segments = this._segments;
			for (var i = 0, l = segments.length; i < l; i++) {
				if (segments[i].hasHandles())
					return true;
			}
			return false;
		},

		clearHandles: function() {
			var segments = this._segments;
			for (var i = 0, l = segments.length; i < l; i++)
				segments[i].clearHandles();
		},

		getLength: function() {
			if (this._length == null) {
				var curves = this.getCurves(),
					length = 0;
				for (var i = 0, l = curves.length; i < l; i++)
					length += curves[i].getLength();
				this._length = length;
			}
			return this._length;
		},

		getArea: function(_closed) {
			var cached = _closed === undefined,
				area = this._area;
			if (!cached || area == null) {
				var segments = this._segments,
					count = segments.length,
					closed = cached ? this._closed : _closed,
					last = count - 1;
				area = 0;
				for (var i = 0, l = closed ? count : last; i < l; i++) {
					area += Curve.getArea(Curve.getValues(
							segments[i], segments[i < last ? i + 1 : 0]));
				}
				if (cached)
					this._area = area;
			}
			return area;
		},

		isClockwise: function() {
			if (this._clockwise !== undefined)
				return this._clockwise;
			return this.getArea() >= 0;
		},

		setClockwise: function(clockwise) {
			if (this.isClockwise() != (clockwise = !!clockwise))
				this.reverse();
			this._clockwise = clockwise;
		},

		isFullySelected: function() {
			var length = this._segments.length;
			return this.isSelected() && length > 0 && this._segmentSelection
					=== length * 7;
		},

		setFullySelected: function(selected) {
			if (selected)
				this._selectSegments(true);
			this.setSelected(selected);
		},

		setSelection: function setSelection(selection) {
			if (!(selection & 1))
				this._selectSegments(false);
			setSelection.base.call(this, selection);
		},

		_selectSegments: function(selected) {
			var segments = this._segments,
				length = segments.length,
				selection = selected ? 7 : 0;
			this._segmentSelection = selection * length;
			for (var i = 0; i < length; i++)
				segments[i]._selection = selection;
		},

		_updateSelection: function(segment, oldSelection, newSelection) {
			segment._selection = newSelection;
			var selection = this._segmentSelection += newSelection - oldSelection;
			if (selection > 0)
				this.setSelected(true);
		},

		splitAt: function(location) {
			var loc = typeof location === 'number'
					? this.getLocationAt(location) : location,
				index = loc && loc.index,
				time = loc && loc.time,
				tMin = 4e-7,
				tMax = 1 - tMin;
			if (time >= tMax) {
				index++;
				time = 0;
			}
			var curves = this.getCurves();
			if (index >= 0 && index < curves.length) {
				if (time >= tMin) {
					curves[index++].divideAtTime(time);
				}
				var segs = this.removeSegments(index, this._segments.length, true),
					path;
				if (this._closed) {
					this.setClosed(false);
					path = this;
				} else {
					path = new Path(Item.NO_INSERT);
					path.insertAbove(this, true);
					path.copyAttributes(this);
				}
				path._add(segs, 0);
				this.addSegment(segs[0]);
				return path;
			}
			return null;
		},

		split: function(index, time) {
			var curve,
				location = time === undefined ? index
					: (curve = this.getCurves()[index])
						&& curve.getLocationAtTime(time);
			return location != null ? this.splitAt(location) : null;
		},

		join: function(path, tolerance) {
			var epsilon = tolerance || 0;
			if (path && path !== this) {
				var segments = path._segments,
					last1 = this.getLastSegment(),
					last2 = path.getLastSegment();
				if (!last2)
					return this;
				if (last1 && last1._point.isClose(last2._point, epsilon))
					path.reverse();
				var first2 = path.getFirstSegment();
				if (last1 && last1._point.isClose(first2._point, epsilon)) {
					last1.setHandleOut(first2._handleOut);
					this._add(segments.slice(1));
				} else {
					var first1 = this.getFirstSegment();
					if (first1 && first1._point.isClose(first2._point, epsilon))
						path.reverse();
					last2 = path.getLastSegment();
					if (first1 && first1._point.isClose(last2._point, epsilon)) {
						first1.setHandleIn(last2._handleIn);
						this._add(segments.slice(0, segments.length - 1), 0);
					} else {
						this._add(segments.slice());
					}
				}
				if (path._closed)
					this._add([segments[0]]);
				path.remove();
			}
			var first = this.getFirstSegment(),
				last = this.getLastSegment();
			if (first !== last && first._point.isClose(last._point, epsilon)) {
				first.setHandleIn(last._handleIn);
				last.remove();
				this.setClosed(true);
			}
			return this;
		},

		reduce: function(options) {
			var curves = this.getCurves(),
				simplify = options && options.simplify,
				tolerance = simplify ? 2e-7 : 0;
			for (var i = curves.length - 1; i >= 0; i--) {
				var curve = curves[i];
				if (!curve.hasHandles() && (curve.getLength() < tolerance
						|| simplify && curve.isCollinear(curve.getNext())))
					curve.remove();
			}
			return this;
		},

		reverse: function() {
			this._segments.reverse();
			for (var i = 0, l = this._segments.length; i < l; i++) {
				var segment = this._segments[i];
				var handleIn = segment._handleIn;
				segment._handleIn = segment._handleOut;
				segment._handleOut = handleIn;
				segment._index = i;
			}
			this._curves = null;
			if (this._clockwise !== undefined)
				this._clockwise = !this._clockwise;
			this._changed(9);
		},

		flatten: function(flatness) {
			var iterator = new PathIterator(this, flatness || 0.25, 256, true),
				parts = iterator.parts,
				length = parts.length,
				segments = [];
			for (var i = 0; i < length; i++) {
				segments.push(new Segment(parts[i].curve.slice(0, 2)));
			}
			if (!this._closed && length > 0) {
				segments.push(new Segment(parts[length - 1].curve.slice(6)));
			}
			this.setSegments(segments);
		},

		simplify: function(tolerance) {
			var segments = new PathFitter(this).fit(tolerance || 2.5);
			if (segments)
				this.setSegments(segments);
			return !!segments;
		},

		smooth: function(options) {
			var that = this,
				opts = options || {},
				type = opts.type || 'asymmetric',
				segments = this._segments,
				length = segments.length,
				closed = this._closed;

			function getIndex(value, _default) {
				var index = value && value.index;
				if (index != null) {
					var path = value.path;
					if (path && path !== that)
						throw new Error(value._class + ' ' + index + ' of ' + path
								+ ' is not part of ' + that);
					if (_default && value instanceof Curve)
						index++;
				} else {
					index = typeof value === 'number' ? value : _default;
				}
				return Math.min(index < 0 && closed
						? index % length
						: index < 0 ? index + length : index, length - 1);
			}

			var loop = closed && opts.from === undefined && opts.to === undefined,
				from = getIndex(opts.from, 0),
				to = getIndex(opts.to, length - 1);

			if (from > to) {
				if (closed) {
					from -= length;
				} else {
					var tmp = from;
					from = to;
					to = tmp;
				}
			}
			if (/^(?:asymmetric|continuous)$/.test(type)) {
				var asymmetric = type === 'asymmetric',
					min = Math.min,
					amount = to - from + 1,
					n = amount - 1,
					padding = loop ? min(amount, 4) : 1,
					paddingLeft = padding,
					paddingRight = padding,
					knots = [];
				if (!closed) {
					paddingLeft = min(1, from);
					paddingRight = min(1, length - to - 1);
				}
				n += paddingLeft + paddingRight;
				if (n <= 1)
					return;
				for (var i = 0, j = from - paddingLeft; i <= n; i++, j++) {
					knots[i] = segments[(j < 0 ? j + length : j) % length]._point;
				}

				var x = knots[0]._x + 2 * knots[1]._x,
					y = knots[0]._y + 2 * knots[1]._y,
					f = 2,
					n_1 = n - 1,
					rx = [x],
					ry = [y],
					rf = [f],
					px = [],
					py = [];
				for (var i = 1; i < n; i++) {
					var internal = i < n_1,
						a = internal ? 1 : asymmetric ? 1 : 2,
						b = internal ? 4 : asymmetric ? 2 : 7,
						u = internal ? 4 : asymmetric ? 3 : 8,
						v = internal ? 2 : asymmetric ? 0 : 1,
						m = a / f;
					f = rf[i] = b - m;
					x = rx[i] = u * knots[i]._x + v * knots[i + 1]._x - m * x;
					y = ry[i] = u * knots[i]._y + v * knots[i + 1]._y - m * y;
				}

				px[n_1] = rx[n_1] / rf[n_1];
				py[n_1] = ry[n_1] / rf[n_1];
				for (var i = n - 2; i >= 0; i--) {
					px[i] = (rx[i] - px[i + 1]) / rf[i];
					py[i] = (ry[i] - py[i + 1]) / rf[i];
				}
				px[n] = (3 * knots[n]._x - px[n_1]) / 2;
				py[n] = (3 * knots[n]._y - py[n_1]) / 2;

				for (var i = paddingLeft, max = n - paddingRight, j = from;
						i <= max; i++, j++) {
					var segment = segments[j < 0 ? j + length : j],
						pt = segment._point,
						hx = px[i] - pt._x,
						hy = py[i] - pt._y;
					if (loop || i < max)
						segment.setHandleOut(hx, hy);
					if (loop || i > paddingLeft)
						segment.setHandleIn(-hx, -hy);
				}
			} else {
				for (var i = from; i <= to; i++) {
					segments[i < 0 ? i + length : i].smooth(opts,
							!loop && i === from, !loop && i === to);
				}
			}
		},

		toShape: function(insert) {
			if (!this._closed)
				return null;

			var segments = this._segments,
				type,
				size,
				radius,
				topCenter;

			function isCollinear(i, j) {
				var seg1 = segments[i],
					seg2 = seg1.getNext(),
					seg3 = segments[j],
					seg4 = seg3.getNext();
				return seg1._handleOut.isZero() && seg2._handleIn.isZero()
						&& seg3._handleOut.isZero() && seg4._handleIn.isZero()
						&& seg2._point.subtract(seg1._point).isCollinear(
							seg4._point.subtract(seg3._point));
			}

			function isOrthogonal(i) {
				var seg2 = segments[i],
					seg1 = seg2.getPrevious(),
					seg3 = seg2.getNext();
				return seg1._handleOut.isZero() && seg2._handleIn.isZero()
						&& seg2._handleOut.isZero() && seg3._handleIn.isZero()
						&& seg2._point.subtract(seg1._point).isOrthogonal(
							seg3._point.subtract(seg2._point));
			}

			function isArc(i) {
				var seg1 = segments[i],
					seg2 = seg1.getNext(),
					handle1 = seg1._handleOut,
					handle2 = seg2._handleIn,
					kappa = 0.5522847498307936;
				if (handle1.isOrthogonal(handle2)) {
					var pt1 = seg1._point,
						pt2 = seg2._point,
						corner = new Line(pt1, handle1, true).intersect(
								new Line(pt2, handle2, true), true);
					return corner && Numerical.isZero(handle1.getLength() /
							corner.subtract(pt1).getLength() - kappa)
						&& Numerical.isZero(handle2.getLength() /
							corner.subtract(pt2).getLength() - kappa);
				}
				return false;
			}

			function getDistance(i, j) {
				return segments[i]._point.getDistance(segments[j]._point);
			}

			if (!this.hasHandles() && segments.length === 4
					&& isCollinear(0, 2) && isCollinear(1, 3) && isOrthogonal(1)) {
				type = Shape.Rectangle;
				size = new Size(getDistance(0, 3), getDistance(0, 1));
				topCenter = segments[1]._point.add(segments[2]._point).divide(2);
			} else if (segments.length === 8 && isArc(0) && isArc(2) && isArc(4)
					&& isArc(6) && isCollinear(1, 5) && isCollinear(3, 7)) {
				type = Shape.Rectangle;
				size = new Size(getDistance(1, 6), getDistance(0, 3));
				radius = size.subtract(new Size(getDistance(0, 7),
						getDistance(1, 2))).divide(2);
				topCenter = segments[3]._point.add(segments[4]._point).divide(2);
			} else if (segments.length === 4
					&& isArc(0) && isArc(1) && isArc(2) && isArc(3)) {
				if (Numerical.isZero(getDistance(0, 2) - getDistance(1, 3))) {
					type = Shape.Circle;
					radius = getDistance(0, 2) / 2;
				} else {
					type = Shape.Ellipse;
					radius = new Size(getDistance(2, 0) / 2, getDistance(3, 1) / 2);
				}
				topCenter = segments[1]._point;
			}

			if (type) {
				var center = this.getPosition(true),
					shape = new type({
						center: center,
						size: size,
						radius: radius,
						insert: false
					});
				shape.copyAttributes(this, true);
				shape._matrix.prepend(this._matrix);
				shape.rotate(topCenter.subtract(center).getAngle() + 90);
				if (insert === undefined || insert)
					shape.insertAbove(this);
				return shape;
			}
			return null;
		},

		toPath: '#clone',

		_hitTestSelf: function(point, options, viewMatrix, strokeMatrix) {
			var that = this,
				style = this.getStyle(),
				segments = this._segments,
				numSegments = segments.length,
				closed = this._closed,
				tolerancePadding = options._tolerancePadding,
				strokePadding = tolerancePadding,
				join, cap, miterLimit,
				area, loc, res,
				hitStroke = options.stroke && style.hasStroke(),
				hitFill = options.fill && style.hasFill(),
				hitCurves = options.curves,
				strokeRadius = hitStroke
						? style.getStrokeWidth() / 2
						: hitFill && options.tolerance > 0 || hitCurves
							? 0 : null;
			if (strokeRadius !== null) {
				if (strokeRadius > 0) {
					join = style.getStrokeJoin();
					cap = style.getStrokeCap();
					miterLimit = strokeRadius * style.getMiterLimit();
					strokePadding = strokePadding.add(
						Path._getStrokePadding(strokeRadius, strokeMatrix));
				} else {
					join = cap = 'round';
				}
			}

			function isCloseEnough(pt, padding) {
				return point.subtract(pt).divide(padding).length <= 1;
			}

			function checkSegmentPoint(seg, pt, name) {
				if (!options.selected || pt.isSelected()) {
					var anchor = seg._point;
					if (pt !== anchor)
						pt = pt.add(anchor);
					if (isCloseEnough(pt, strokePadding)) {
						return new HitResult(name, that, {
							segment: seg,
							point: pt
						});
					}
				}
			}

			function checkSegmentPoints(seg, ends) {
				return (ends || options.segments)
					&& checkSegmentPoint(seg, seg._point, 'segment')
					|| (!ends && options.handles) && (
						checkSegmentPoint(seg, seg._handleIn, 'handle-in') ||
						checkSegmentPoint(seg, seg._handleOut, 'handle-out'));
			}

			function addToArea(point) {
				area.add(point);
			}

			function checkSegmentStroke(segment) {
				if (join !== 'round' || cap !== 'round') {
					area = new Path({ internal: true, closed: true });
					if (closed || segment._index > 0
							&& segment._index < numSegments - 1) {
						if (join !== 'round' && (segment._handleIn.isZero()
								|| segment._handleOut.isZero()))
							Path._addBevelJoin(segment, join, strokeRadius,
								   miterLimit, null, strokeMatrix, addToArea, true);
					} else if (cap !== 'round') {
						Path._addSquareCap(segment, cap, strokeRadius, null,
								strokeMatrix, addToArea, true);
					}
					if (!area.isEmpty()) {
						var loc;
						return area.contains(point)
							|| (loc = area.getNearestLocation(point))
								&& isCloseEnough(loc.getPoint(), tolerancePadding);
					}
				}
				return isCloseEnough(segment._point, strokePadding);
			}

			if (options.ends && !options.segments && !closed) {
				if (res = checkSegmentPoints(segments[0], true)
						|| checkSegmentPoints(segments[numSegments - 1], true))
					return res;
			} else if (options.segments || options.handles) {
				for (var i = 0; i < numSegments; i++)
					if (res = checkSegmentPoints(segments[i]))
						return res;
			}
			if (strokeRadius !== null) {
				loc = this.getNearestLocation(point);
				if (loc) {
					var time = loc.getTime();
					if (time === 0 || time === 1 && numSegments > 1) {
						if (!checkSegmentStroke(loc.getSegment()))
							loc = null;
					} else if (!isCloseEnough(loc.getPoint(), strokePadding)) {
						loc = null;
					}
				}
				if (!loc && join === 'miter' && numSegments > 1) {
					for (var i = 0; i < numSegments; i++) {
						var segment = segments[i];
						if (point.getDistance(segment._point) <= miterLimit
								&& checkSegmentStroke(segment)) {
							loc = segment.getLocation();
							break;
						}
					}
				}
			}
			return !loc && hitFill && this._contains(point)
					|| loc && !hitStroke && !hitCurves
						? new HitResult('fill', this)
						: loc
							? new HitResult(hitStroke ? 'stroke' : 'curve', this, {
								location: loc,
								point: loc.getPoint()
							})
							: null;
		}

	}, Base.each(Curve._evaluateMethods,
		function(name) {
			this[name + 'At'] = function(offset) {
				var loc = this.getLocationAt(offset);
				return loc && loc[name]();
			};
		},
	{
		beans: false,

		getLocationOf: function() {
			var point = Point.read(arguments),
				curves = this.getCurves();
			for (var i = 0, l = curves.length; i < l; i++) {
				var loc = curves[i].getLocationOf(point);
				if (loc)
					return loc;
			}
			return null;
		},

		getOffsetOf: function() {
			var loc = this.getLocationOf.apply(this, arguments);
			return loc ? loc.getOffset() : null;
		},

		getLocationAt: function(offset) {
			var curves = this.getCurves(),
				length = 0;
			for (var i = 0, l = curves.length; i < l; i++) {
				var start = length,
					curve = curves[i];
				length += curve.getLength();
				if (length > offset) {
					return curve.getLocationAt(offset - start);
				}
			}
			if (curves.length > 0 && offset <= this.getLength())
				return new CurveLocation(curves[curves.length - 1], 1);
			return null;
		}

	}),
	new function() {

		function drawHandles(ctx, segments, matrix, size) {
			var half = size / 2,
				coords = new Array(6),
				pX, pY;

			function drawHandle(index) {
				var hX = coords[index],
					hY = coords[index + 1];
				if (pX != hX || pY != hY) {
					ctx.beginPath();
					ctx.moveTo(pX, pY);
					ctx.lineTo(hX, hY);
					ctx.stroke();
					ctx.beginPath();
					ctx.arc(hX, hY, half, 0, Math.PI * 2, true);
					ctx.fill();
				}
			}

			for (var i = 0, l = segments.length; i < l; i++) {
				var segment = segments[i],
					selection = segment._selection;
				segment._transformCoordinates(matrix, coords);
				pX = coords[0];
				pY = coords[1];
				if (selection & 2)
					drawHandle(2);
				if (selection & 4)
					drawHandle(4);
				ctx.fillRect(pX - half, pY - half, size, size);
				if (!(selection & 1)) {
					var fillStyle = ctx.fillStyle;
					ctx.fillStyle = '#ffffff';
					ctx.fillRect(pX - half + 1, pY - half + 1, size - 2, size - 2);
					ctx.fillStyle = fillStyle;
				}
			}
		}

		function drawSegments(ctx, path, matrix) {
			var segments = path._segments,
				length = segments.length,
				coords = new Array(6),
				first = true,
				curX, curY,
				prevX, prevY,
				inX, inY,
				outX, outY;

			function drawSegment(segment) {
				if (matrix) {
					segment._transformCoordinates(matrix, coords);
					curX = coords[0];
					curY = coords[1];
				} else {
					var point = segment._point;
					curX = point._x;
					curY = point._y;
				}
				if (first) {
					ctx.moveTo(curX, curY);
					first = false;
				} else {
					if (matrix) {
						inX = coords[2];
						inY = coords[3];
					} else {
						var handle = segment._handleIn;
						inX = curX + handle._x;
						inY = curY + handle._y;
					}
					if (inX === curX && inY === curY
							&& outX === prevX && outY === prevY) {
						ctx.lineTo(curX, curY);
					} else {
						ctx.bezierCurveTo(outX, outY, inX, inY, curX, curY);
					}
				}
				prevX = curX;
				prevY = curY;
				if (matrix) {
					outX = coords[4];
					outY = coords[5];
				} else {
					var handle = segment._handleOut;
					outX = prevX + handle._x;
					outY = prevY + handle._y;
				}
			}

			for (var i = 0; i < length; i++)
				drawSegment(segments[i]);
			if (path._closed && length > 0)
				drawSegment(segments[0]);
		}

		return {
			_draw: function(ctx, param, viewMatrix, strokeMatrix) {
				var dontStart = param.dontStart,
					dontPaint = param.dontFinish || param.clip,
					style = this.getStyle(),
					hasFill = style.hasFill(),
					hasStroke = style.hasStroke(),
					dashArray = style.getDashArray(),
					dashLength = !paper.support.nativeDash && hasStroke
							&& dashArray && dashArray.length;

				if (!dontStart)
					ctx.beginPath();

				if (hasFill || hasStroke && !dashLength || dontPaint) {
					drawSegments(ctx, this, strokeMatrix);
					if (this._closed)
						ctx.closePath();
				}

				function getOffset(i) {
					return dashArray[((i % dashLength) + dashLength) % dashLength];
				}

				if (!dontPaint && (hasFill || hasStroke)) {
					this._setStyles(ctx, param, viewMatrix);
					if (hasFill) {
						ctx.fill(style.getFillRule());
						ctx.shadowColor = 'rgba(0,0,0,0)';
					}
					if (hasStroke) {
						if (dashLength) {
							if (!dontStart)
								ctx.beginPath();
							var iterator = new PathIterator(this, 0.25, 32, false,
									strokeMatrix),
								length = iterator.length,
								from = -style.getDashOffset(), to,
								i = 0;
							from = from % length;
							while (from > 0) {
								from -= getOffset(i--) + getOffset(i--);
							}
							while (from < length) {
								to = from + getOffset(i++);
								if (from > 0 || to > 0)
									iterator.drawPart(ctx,
											Math.max(from, 0), Math.max(to, 0));
								from = to + getOffset(i++);
							}
						}
						ctx.stroke();
					}
				}
			},

			_drawSelected: function(ctx, matrix) {
				ctx.beginPath();
				drawSegments(ctx, this, matrix);
				ctx.stroke();
				drawHandles(ctx, this._segments, matrix, paper.settings.handleSize);
			}
		};
	},
	new function() {
		function getCurrentSegment(that) {
			var segments = that._segments;
			if (segments.length === 0)
				throw new Error('Use a moveTo() command first');
			return segments[segments.length - 1];
		}

		return {
			moveTo: function() {
				var segments = this._segments;
				if (segments.length === 1)
					this.removeSegment(0);
				if (!segments.length)
					this._add([ new Segment(Point.read(arguments)) ]);
			},

			moveBy: function() {
				throw new Error('moveBy() is unsupported on Path items.');
			},

			lineTo: function() {
				this._add([ new Segment(Point.read(arguments)) ]);
			},

			cubicCurveTo: function() {
				var handle1 = Point.read(arguments),
					handle2 = Point.read(arguments),
					to = Point.read(arguments),
					current = getCurrentSegment(this);
				current.setHandleOut(handle1.subtract(current._point));
				this._add([ new Segment(to, handle2.subtract(to)) ]);
			},

			quadraticCurveTo: function() {
				var handle = Point.read(arguments),
					to = Point.read(arguments),
					current = getCurrentSegment(this)._point;
				this.cubicCurveTo(
					handle.add(current.subtract(handle).multiply(1 / 3)),
					handle.add(to.subtract(handle).multiply(1 / 3)),
					to
				);
			},

			curveTo: function() {
				var through = Point.read(arguments),
					to = Point.read(arguments),
					t = Base.pick(Base.read(arguments), 0.5),
					t1 = 1 - t,
					current = getCurrentSegment(this)._point,
					handle = through.subtract(current.multiply(t1 * t1))
						.subtract(to.multiply(t * t)).divide(2 * t * t1);
				if (handle.isNaN())
					throw new Error(
						'Cannot put a curve through points with parameter = ' + t);
				this.quadraticCurveTo(handle, to);
			},

			arcTo: function() {
				var current = getCurrentSegment(this),
					from = current._point,
					to = Point.read(arguments),
					through,
					peek = Base.peek(arguments),
					clockwise = Base.pick(peek, true),
					center, extent, vector, matrix;
				if (typeof clockwise === 'boolean') {
					var middle = from.add(to).divide(2),
					through = middle.add(middle.subtract(from).rotate(
							clockwise ? -90 : 90));
				} else if (Base.remain(arguments) <= 2) {
					through = to;
					to = Point.read(arguments);
				} else {
					var radius = Size.read(arguments),
						isZero = Numerical.isZero;
					if (isZero(radius.width) || isZero(radius.height))
						return this.lineTo(to);
					var rotation = Base.read(arguments),
						clockwise = !!Base.read(arguments),
						large = !!Base.read(arguments),
						middle = from.add(to).divide(2),
						pt = from.subtract(middle).rotate(-rotation),
						x = pt.x,
						y = pt.y,
						abs = Math.abs,
						rx = abs(radius.width),
						ry = abs(radius.height),
						rxSq = rx * rx,
						rySq = ry * ry,
						xSq = x * x,
						ySq = y * y;
					var factor = Math.sqrt(xSq / rxSq + ySq / rySq);
					if (factor > 1) {
						rx *= factor;
						ry *= factor;
						rxSq = rx * rx;
						rySq = ry * ry;
					}
					factor = (rxSq * rySq - rxSq * ySq - rySq * xSq) /
							(rxSq * ySq + rySq * xSq);
					if (abs(factor) < 1e-12)
						factor = 0;
					if (factor < 0)
						throw new Error(
								'Cannot create an arc with the given arguments');
					center = new Point(rx * y / ry, -ry * x / rx)
							.multiply((large === clockwise ? -1 : 1)
								* Math.sqrt(factor))
							.rotate(rotation).add(middle);
					matrix = new Matrix().translate(center).rotate(rotation)
							.scale(rx, ry);
					vector = matrix._inverseTransform(from);
					extent = vector.getDirectedAngle(matrix._inverseTransform(to));
					if (!clockwise && extent > 0)
						extent -= 360;
					else if (clockwise && extent < 0)
						extent += 360;
				}
				if (through) {
					var l1 = new Line(from.add(through).divide(2),
								through.subtract(from).rotate(90), true),
						l2 = new Line(through.add(to).divide(2),
								to.subtract(through).rotate(90), true),
						line = new Line(from, to),
						throughSide = line.getSide(through);
					center = l1.intersect(l2, true);
					if (!center) {
						if (!throughSide)
							return this.lineTo(to);
						throw new Error(
								'Cannot create an arc with the given arguments');
					}
					vector = from.subtract(center);
					extent = vector.getDirectedAngle(to.subtract(center));
					var centerSide = line.getSide(center);
					if (centerSide === 0) {
						extent = throughSide * Math.abs(extent);
					} else if (throughSide === centerSide) {
						extent += extent < 0 ? 360 : -360;
					}
				}
				var ext = Math.abs(extent),
					count = ext >= 360 ? 4 : Math.ceil(ext / 90),
					inc = extent / count,
					half = inc * Math.PI / 360,
					z = 4 / 3 * Math.sin(half) / (1 + Math.cos(half)),
					segments = [];
				for (var i = 0; i <= count; i++) {
					var pt = to,
						out = null;
					if (i < count) {
						out = vector.rotate(90).multiply(z);
						if (matrix) {
							pt = matrix._transformPoint(vector);
							out = matrix._transformPoint(vector.add(out))
									.subtract(pt);
						} else {
							pt = center.add(vector);
						}
					}
					if (i === 0) {
						current.setHandleOut(out);
					} else {
						var _in = vector.rotate(-90).multiply(z);
						if (matrix) {
							_in = matrix._transformPoint(vector.add(_in))
									.subtract(pt);
						}
						segments.push(new Segment(pt, _in, out));
					}
					vector = vector.rotate(inc);
				}
				this._add(segments);
			},

			lineBy: function() {
				var to = Point.read(arguments),
					current = getCurrentSegment(this)._point;
				this.lineTo(current.add(to));
			},

			curveBy: function() {
				var through = Point.read(arguments),
					to = Point.read(arguments),
					parameter = Base.read(arguments),
					current = getCurrentSegment(this)._point;
				this.curveTo(current.add(through), current.add(to), parameter);
			},

			cubicCurveBy: function() {
				var handle1 = Point.read(arguments),
					handle2 = Point.read(arguments),
					to = Point.read(arguments),
					current = getCurrentSegment(this)._point;
				this.cubicCurveTo(current.add(handle1), current.add(handle2),
						current.add(to));
			},

			quadraticCurveBy: function() {
				var handle = Point.read(arguments),
					to = Point.read(arguments),
					current = getCurrentSegment(this)._point;
				this.quadraticCurveTo(current.add(handle), current.add(to));
			},

			arcBy: function() {
				var current = getCurrentSegment(this)._point,
					point = current.add(Point.read(arguments)),
					clockwise = Base.pick(Base.peek(arguments), true);
				if (typeof clockwise === 'boolean') {
					this.arcTo(point, clockwise);
				} else {
					this.arcTo(point, current.add(Point.read(arguments)));
				}
			},

			closePath: function(tolerance) {
				this.setClosed(true);
				this.join(this, tolerance);
			}
		};
	}, {

		_getBounds: function(matrix, options) {
			var method = options.handle
					? 'getHandleBounds'
					: options.stroke
					? 'getStrokeBounds'
					: 'getBounds';
			return Path[method](this._segments, this._closed, this, matrix, options);
		},

	statics: {
		getBounds: function(segments, closed, path, matrix, options, strokePadding) {
			var first = segments[0];
			if (!first)
				return new Rectangle();
			var coords = new Array(6),
				prevCoords = first._transformCoordinates(matrix, new Array(6)),
				min = prevCoords.slice(0, 2),
				max = min.slice(),
				roots = new Array(2);

			function processSegment(segment) {
				segment._transformCoordinates(matrix, coords);
				for (var i = 0; i < 2; i++) {
					Curve._addBounds(
						prevCoords[i],
						prevCoords[i + 4],
						coords[i + 2],
						coords[i],
						i, strokePadding ? strokePadding[i] : 0, min, max, roots);
				}
				var tmp = prevCoords;
				prevCoords = coords;
				coords = tmp;
			}

			for (var i = 1, l = segments.length; i < l; i++)
				processSegment(segments[i]);
			if (closed)
				processSegment(first);
			return new Rectangle(min[0], min[1], max[0] - min[0], max[1] - min[1]);
		},

		getStrokeBounds: function(segments, closed, path, matrix, options) {
			var style = path.getStyle(),
				stroke = style.hasStroke(),
				strokeWidth = style.getStrokeWidth(),
				strokeMatrix = stroke && path._getStrokeMatrix(matrix, options),
				strokePadding = stroke && Path._getStrokePadding(strokeWidth,
					strokeMatrix),
				bounds = Path.getBounds(segments, closed, path, matrix, options,
					strokePadding);
			if (!stroke)
				return bounds;
			var strokeRadius = strokeWidth / 2,
				join = style.getStrokeJoin(),
				cap = style.getStrokeCap(),
				miterLimit = strokeRadius * style.getMiterLimit(),
				joinBounds = new Rectangle(new Size(strokePadding));

			function addPoint(point) {
				bounds = bounds.include(point);
			}

			function addRound(segment) {
				bounds = bounds.unite(
						joinBounds.setCenter(segment._point.transform(matrix)));
			}

			function addJoin(segment, join) {
				var handleIn = segment._handleIn,
					handleOut = segment._handleOut;
				if (join === 'round' || !handleIn.isZero() && !handleOut.isZero()
						&& handleIn.isCollinear(handleOut)) {
					addRound(segment);
				} else {
					Path._addBevelJoin(segment, join, strokeRadius, miterLimit,
							matrix, strokeMatrix, addPoint);
				}
			}

			function addCap(segment, cap) {
				if (cap === 'round') {
					addRound(segment);
				} else {
					Path._addSquareCap(segment, cap, strokeRadius, matrix,
							strokeMatrix, addPoint);
				}
			}

			var length = segments.length - (closed ? 0 : 1);
			for (var i = 1; i < length; i++)
				addJoin(segments[i], join);
			if (closed) {
				addJoin(segments[0], join);
			} else if (length > 0) {
				addCap(segments[0], cap);
				addCap(segments[segments.length - 1], cap);
			}
			return bounds;
		},

		_getStrokePadding: function(radius, matrix) {
			if (!matrix)
				return [radius, radius];
			var hor = new Point(radius, 0).transform(matrix),
				ver = new Point(0, radius).transform(matrix),
				phi = hor.getAngleInRadians(),
				a = hor.getLength(),
				b = ver.getLength();
			var sin = Math.sin(phi),
				cos = Math.cos(phi),
				tan = Math.tan(phi),
				tx = Math.atan2(b * tan, a),
				ty = Math.atan2(b, tan * a);
			return [Math.abs(a * Math.cos(tx) * cos + b * Math.sin(tx) * sin),
					Math.abs(b * Math.sin(ty) * cos + a * Math.cos(ty) * sin)];
		},

		_addBevelJoin: function(segment, join, radius, miterLimit, matrix,
				strokeMatrix, addPoint, isArea) {
			var curve2 = segment.getCurve(),
				curve1 = curve2.getPrevious(),
				point = curve2.getPointAtTime(0),
				normal1 = curve1.getNormalAtTime(1),
				normal2 = curve2.getNormalAtTime(0),
				step = normal1.getDirectedAngle(normal2) < 0 ? -radius : radius;
			normal1.setLength(step);
			normal2.setLength(step);
			if (matrix)
				matrix._transformPoint(point, point);
			if (strokeMatrix) {
				strokeMatrix._transformPoint(normal1, normal1);
				strokeMatrix._transformPoint(normal2, normal2);
			}
			if (isArea) {
				addPoint(point);
				addPoint(point.add(normal1));
			}
			if (join === 'miter') {
				var corner = new Line(point.add(normal1),
						new Point(-normal1.y, normal1.x), true
					).intersect(new Line(point.add(normal2),
						new Point(-normal2.y, normal2.x), true
					), true);
				if (corner && point.getDistance(corner) <= miterLimit) {
					addPoint(corner);
					if (!isArea)
						return;
				}
			}
			if (!isArea)
				addPoint(point.add(normal1));
			addPoint(point.add(normal2));
		},

		_addSquareCap: function(segment, cap, radius, matrix, strokeMatrix,
				addPoint, isArea) {
			var point = segment._point,
				loc = segment.getLocation(),
				normal = loc.getNormal().multiply(radius);
			if (matrix)
				matrix._transformPoint(point, point);
			if (strokeMatrix)
				strokeMatrix._transformPoint(normal, normal);
			if (isArea) {
				addPoint(point.subtract(normal));
				addPoint(point.add(normal));
			}
			if (cap === 'square') {
				point = point.add(normal.rotate(
						loc.getTime() === 0 ? -90 : 90));
			}
			addPoint(point.add(normal));
			addPoint(point.subtract(normal));
		},

		getHandleBounds: function(segments, closed, path, matrix, options) {
			var style = path.getStyle(),
				stroke = options.stroke && style.hasStroke(),
				strokePadding,
				joinPadding;
			if (stroke) {
				var strokeMatrix = path._getStrokeMatrix(matrix, options),
					strokeRadius = style.getStrokeWidth() / 2,
					joinRadius = strokeRadius;
				if (style.getStrokeJoin() === 'miter')
					joinRadius = strokeRadius * style.getMiterLimit();
				if (style.getStrokeCap() === 'square')
					joinRadius = Math.max(joinRadius, strokeRadius * Math.sqrt(2));
				strokePadding = Path._getStrokePadding(strokeRadius, strokeMatrix);
				joinPadding = Path._getStrokePadding(joinRadius, strokeMatrix);
			}
			var coords = new Array(6),
				x1 = Infinity,
				x2 = -x1,
				y1 = x1,
				y2 = x2;
			for (var i = 0, l = segments.length; i < l; i++) {
				var segment = segments[i];
				segment._transformCoordinates(matrix, coords);
				for (var j = 0; j < 6; j += 2) {
					var padding = j === 0 ? joinPadding : strokePadding,
						paddingX = padding ? padding[0] : 0,
						paddingY = padding ? padding[1] : 0,
						x = coords[j],
						y = coords[j + 1],
						xn = x - paddingX,
						xx = x + paddingX,
						yn = y - paddingY,
						yx = y + paddingY;
					if (xn < x1) x1 = xn;
					if (xx > x2) x2 = xx;
					if (yn < y1) y1 = yn;
					if (yx > y2) y2 = yx;
				}
			}
			return new Rectangle(x1, y1, x2 - x1, y2 - y1);
		}
	}});

	Path.inject({ statics: new function() {

		var kappa = 0.5522847498307936,
			ellipseSegments = [
				new Segment([-1, 0], [0, kappa ], [0, -kappa]),
				new Segment([0, -1], [-kappa, 0], [kappa, 0 ]),
				new Segment([1, 0], [0, -kappa], [0, kappa ]),
				new Segment([0, 1], [kappa, 0 ], [-kappa, 0])
			];

		function createPath(segments, closed, args) {
			var props = Base.getNamed(args),
				path = new Path(props && props.insert === false && Item.NO_INSERT);
			path._add(segments);
			path._closed = closed;
			return path.set(props);
		}

		function createEllipse(center, radius, args) {
			var segments = new Array(4);
			for (var i = 0; i < 4; i++) {
				var segment = ellipseSegments[i];
				segments[i] = new Segment(
					segment._point.multiply(radius).add(center),
					segment._handleIn.multiply(radius),
					segment._handleOut.multiply(radius)
				);
			}
			return createPath(segments, true, args);
		}

		return {
			Line: function() {
				return createPath([
					new Segment(Point.readNamed(arguments, 'from')),
					new Segment(Point.readNamed(arguments, 'to'))
				], false, arguments);
			},

			Circle: function() {
				var center = Point.readNamed(arguments, 'center'),
					radius = Base.readNamed(arguments, 'radius');
				return createEllipse(center, new Size(radius), arguments);
			},

			Rectangle: function() {
				var rect = Rectangle.readNamed(arguments, 'rectangle'),
					radius = Size.readNamed(arguments, 'radius', 0,
							{ readNull: true }),
					bl = rect.getBottomLeft(true),
					tl = rect.getTopLeft(true),
					tr = rect.getTopRight(true),
					br = rect.getBottomRight(true),
					segments;
				if (!radius || radius.isZero()) {
					segments = [
						new Segment(bl),
						new Segment(tl),
						new Segment(tr),
						new Segment(br)
					];
				} else {
					radius = Size.min(radius, rect.getSize(true).divide(2));
					var rx = radius.width,
						ry = radius.height,
						hx = rx * kappa,
						hy = ry * kappa;
					segments = [
						new Segment(bl.add(rx, 0), null, [-hx, 0]),
						new Segment(bl.subtract(0, ry), [0, hy]),
						new Segment(tl.add(0, ry), null, [0, -hy]),
						new Segment(tl.add(rx, 0), [-hx, 0], null),
						new Segment(tr.subtract(rx, 0), null, [hx, 0]),
						new Segment(tr.add(0, ry), [0, -hy], null),
						new Segment(br.subtract(0, ry), null, [0, hy]),
						new Segment(br.subtract(rx, 0), [hx, 0])
					];
				}
				return createPath(segments, true, arguments);
			},

			RoundRectangle: '#Rectangle',

			Ellipse: function() {
				var ellipse = Shape._readEllipse(arguments);
				return createEllipse(ellipse.center, ellipse.radius, arguments);
			},

			Oval: '#Ellipse',

			Arc: function() {
				var from = Point.readNamed(arguments, 'from'),
					through = Point.readNamed(arguments, 'through'),
					to = Point.readNamed(arguments, 'to'),
					props = Base.getNamed(arguments),
					path = new Path(props && props.insert === false
							&& Item.NO_INSERT);
				path.moveTo(from);
				path.arcTo(through, to);
				return path.set(props);
			},

			RegularPolygon: function() {
				var center = Point.readNamed(arguments, 'center'),
					sides = Base.readNamed(arguments, 'sides'),
					radius = Base.readNamed(arguments, 'radius'),
					step = 360 / sides,
					three = sides % 3 === 0,
					vector = new Point(0, three ? -radius : radius),
					offset = three ? -1 : 0.5,
					segments = new Array(sides);
				for (var i = 0; i < sides; i++)
					segments[i] = new Segment(center.add(
						vector.rotate((i + offset) * step)));
				return createPath(segments, true, arguments);
			},

			Star: function() {
				var center = Point.readNamed(arguments, 'center'),
					points = Base.readNamed(arguments, 'points') * 2,
					radius1 = Base.readNamed(arguments, 'radius1'),
					radius2 = Base.readNamed(arguments, 'radius2'),
					step = 360 / points,
					vector = new Point(0, -1),
					segments = new Array(points);
				for (var i = 0; i < points; i++)
					segments[i] = new Segment(center.add(vector.rotate(step * i)
							.multiply(i % 2 ? radius2 : radius1)));
				return createPath(segments, true, arguments);
			}
		};
	}});

	var CompoundPath = PathItem.extend({
		_class: 'CompoundPath',
		_serializeFields: {
			children: []
		},

		initialize: function CompoundPath(arg) {
			this._children = [];
			this._namedChildren = {};
			if (!this._initialize(arg)) {
				if (typeof arg === 'string') {
					this.setPathData(arg);
				} else {
					this.addChildren(Array.isArray(arg) ? arg : arguments);
				}
			}
		},

		insertChildren: function insertChildren(index, items, _preserve) {
			for (var i = items.length - 1; i >= 0; i--) {
				var item = items[i];
				if (item instanceof CompoundPath) {
					items = items.slice();
					items.splice.apply(items, [i, 1].concat(item.removeChildren()));
					item.remove();
				}
			}
			items = insertChildren.base.call(this, index, items, _preserve, Path);
			for (var i = 0, l = !_preserve && items && items.length; i < l; i++) {
				var item = items[i];
				if (item._clockwise === undefined)
					item.setClockwise(item._index === 0);
			}
			return items;
		},

		reduce: function reduce(options) {
			var children = this._children;
			for (var i = children.length - 1; i >= 0; i--) {
				var path = children[i].reduce(options);
				if (path.isEmpty())
					path.remove();
			}
			if (children.length === 0) {
				var path = new Path(Item.NO_INSERT);
				path.copyAttributes(this);
				path.insertAbove(this);
				this.remove();
				return path;
			}
			return reduce.base.call(this);
		},

		isClockwise: function() {
			var child = this.getFirstChild();
			return child && child.isClockwise();
		},

		setClockwise: function(clockwise) {
			if (this.isClockwise() ^ !!clockwise)
				this.reverse();
		},

		getFirstSegment: function() {
			var first = this.getFirstChild();
			return first && first.getFirstSegment();
		},

		getLastSegment: function() {
			var last = this.getLastChild();
			return last && last.getLastSegment();
		},

		getCurves: function() {
			var children = this._children,
				curves = [];
			for (var i = 0, l = children.length; i < l; i++)
				curves.push.apply(curves, children[i].getCurves());
			return curves;
		},

		getFirstCurve: function() {
			var first = this.getFirstChild();
			return first && first.getFirstCurve();
		},

		getLastCurve: function() {
			var last = this.getLastChild();
			return last && last.getFirstCurve();
		},

		getArea: function() {
			var children = this._children,
				area = 0;
			for (var i = 0, l = children.length; i < l; i++)
				area += children[i].getArea();
			return area;
		}
	}, {
		beans: true,

		getPathData: function(_matrix, _precision) {
			var children = this._children,
				paths = [];
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i],
					mx = child._matrix;
				paths.push(child.getPathData(_matrix && !mx.isIdentity()
						? _matrix.appended(mx) : _matrix, _precision));
			}
			return paths.join(' ');
		}
	}, {
		_hitTestChildren: function _hitTestChildren(point, options, viewMatrix) {
			return _hitTestChildren.base.call(this, point,
					options.class === Path || options.type === 'path' ? options
						: Base.set({}, options, { fill: false }),
					viewMatrix);
		},

		_draw: function(ctx, param, viewMatrix, strokeMatrix) {
			var children = this._children;
			if (children.length === 0)
				return;

			param = param.extend({ dontStart: true, dontFinish: true });
			ctx.beginPath();
			for (var i = 0, l = children.length; i < l; i++)
				children[i].draw(ctx, param, strokeMatrix);

			if (!param.clip) {
				this._setStyles(ctx, param, viewMatrix);
				var style = this._style;
				if (style.hasFill()) {
					ctx.fill(style.getFillRule());
					ctx.shadowColor = 'rgba(0,0,0,0)';
				}
				if (style.hasStroke())
					ctx.stroke();
			}
		},

		_drawSelected: function(ctx, matrix, selectionItems) {
			var children = this._children;
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i],
					mx = child._matrix;
				if (!selectionItems[child._id]) {
					child._drawSelected(ctx, mx.isIdentity() ? matrix
							: matrix.appended(mx));
				}
			}
		}
	},
	new function() {
		function getCurrentPath(that, check) {
			var children = that._children;
			if (check && children.length === 0)
				throw new Error('Use a moveTo() command first');
			return children[children.length - 1];
		}

		return Base.each(['lineTo', 'cubicCurveTo', 'quadraticCurveTo', 'curveTo',
				'arcTo', 'lineBy', 'cubicCurveBy', 'quadraticCurveBy', 'curveBy',
				'arcBy'],
			function(key) {
				this[key] = function() {
					var path = getCurrentPath(this, true);
					path[key].apply(path, arguments);
				};
			}, {
				moveTo: function() {
					var current = getCurrentPath(this),
						path = current && current.isEmpty() ? current
								: new Path(Item.NO_INSERT);
					if (path !== current)
						this.addChild(path);
					path.moveTo.apply(path, arguments);
				},

				moveBy: function() {
					var current = getCurrentPath(this, true),
						last = current && current.getLastSegment(),
						point = Point.read(arguments);
					this.moveTo(last ? point.add(last._point) : point);
				},

				closePath: function(tolerance) {
					getCurrentPath(this, true).closePath(tolerance);
				}
			}
		);
	}, Base.each(['reverse', 'flatten', 'simplify', 'smooth'], function(key) {
		this[key] = function(param) {
			var children = this._children,
				res;
			for (var i = 0, l = children.length; i < l; i++) {
				res = children[i][key](param) || res;
			}
			return res;
		};
	}, {}));

	PathItem.inject(new function() {
		var operators = {
			unite:     { 1: true },
			intersect: { 2: true },
			subtract:  { 1: true },
			exclude:   { 1: true }
		};

		function preparePath(path, resolve) {
			var res = path.clone(false).reduce({ simplify: true })
					.transform(null, true, true);
			return resolve ? res.resolveCrossings() : res;
		}

		function createResult(ctor, paths, reduce, path1, path2) {
			var result = new ctor(Item.NO_INSERT);
			result.addChildren(paths, true);
			if (reduce)
				result = result.reduce({ simplify: true });
			result.insertAbove(path2 && path1.isSibling(path2)
					&& path1.getIndex() < path2.getIndex() ? path2 : path1);
			result.copyAttributes(path1, true);
			return result;
		}

		function computeBoolean(path1, path2, operation) {
			var operator = operators[operation];
			operator[operation] = true;
			if (!path1._children && !path1._closed)
				return computeOpenBoolean(path1, path2, operator);
			var _path1 = preparePath(path1, true),
				_path2 = path2 && path1 !== path2 && preparePath(path2, true);
			if (_path2 && (operator.subtract || operator.exclude)
					^ (_path2.isClockwise() ^ _path1.isClockwise()))
				_path2.reverse();
			var crossings = divideLocations(
					CurveLocation.expand(_path1.getCrossings(_path2))),
				segments = [],
				monoCurves = [];

			function collect(paths) {
				for (var i = 0, l = paths.length; i < l; i++) {
					var path = paths[i];
					segments.push.apply(segments, path._segments);
					monoCurves.push.apply(monoCurves, path._getMonoCurves());
					path._overlapsOnly = path._validOverlapsOnly = true;
				}
			}

			collect(_path1._children || [_path1]);
			if (_path2)
				collect(_path2._children || [_path2]);
			for (var i = 0, l = crossings.length; i < l; i++) {
				propagateWinding(crossings[i]._segment, _path1, _path2, monoCurves,
						operator);
			}
			for (var i = 0, l = segments.length; i < l; i++) {
				var segment = segments[i],
					inter = segment._intersection;
				if (segment._winding == null) {
					propagateWinding(segment, _path1, _path2, monoCurves, operator);
				}
				if (!(inter && inter._overlap)) {
					var path = segment._path;
					path._overlapsOnly = false;
					if (operator[segment._winding])
						path._validOverlapsOnly = false;
				}
			}
			return createResult(CompoundPath, tracePaths(segments, operator), true,
						path1, path2);
		}

		function computeOpenBoolean(path1, path2, operator) {
			if (!path2 || !path2._children && !path2._closed
					|| !operator.subtract && !operator.intersect)
				return null;
			var _path1 = preparePath(path1, false),
				_path2 = preparePath(path2, false),
				crossings = _path1.getCrossings(_path2),
				sub = operator.subtract,
				paths = [];

			function addPath(path) {
				if (_path2.contains(path.getPointAt(path.getLength() / 2)) ^ sub) {
					paths.unshift(path);
					return true;
				}
			}

			for (var i = crossings.length - 1; i >= 0; i--) {
				var path = crossings[i].split();
				if (path) {
					if (addPath(path))
						path.getFirstSegment().setHandleIn(0, 0);
					_path1.getLastSegment().setHandleOut(0, 0);
				}
			}
			addPath(_path1);
			return createResult(Group, paths, false, path1, path2);
		}

		function linkIntersections(from, to) {
			var prev = from;
			while (prev) {
				if (prev === to)
					return;
				prev = prev._previous;
			}
			while (from._next && from._next !== to)
				from = from._next;
			if (!from._next) {
				while (to._previous)
					to = to._previous;
				from._next = to;
				to._previous = from;
			}
		}

		function divideLocations(locations, include) {
			var results = include && [],
				tMin = 4e-7,
				tMax = 1 - tMin,
				noHandles = false,
				clearCurves = [],
				prevCurve,
				prevTime;

			for (var i = locations.length - 1; i >= 0; i--) {
				var loc = locations[i];
				if (include) {
					if (!include(loc))
						continue;
					results.unshift(loc);
				}
				var curve = loc._curve,
					time = loc._time,
					origTime = time,
					segment;
				if (curve !== prevCurve) {
					noHandles = !curve.hasHandles();
				} else if (prevTime >= tMin && prevTime <= tMax ) {
					time /= prevTime;
				}
				if (time < tMin) {
					segment = curve._segment1;
				} else if (time > tMax) {
					segment = curve._segment2;
				} else {
					var newCurve = curve.divideAtTime(time, true);
					if (noHandles)
						clearCurves.push(curve, newCurve);
					segment = newCurve._segment1;
				}
				loc._setSegment(segment);
				var inter = segment._intersection,
					dest = loc._intersection;
				if (inter) {
					linkIntersections(inter, dest);
					var other = inter;
					while (other) {
						linkIntersections(other._intersection, inter);
						other = other._next;
					}
				} else {
					segment._intersection = dest;
				}
				prevCurve = curve;
				prevTime = origTime;
			}
			for (var i = 0, l = clearCurves.length; i < l; i++) {
				clearCurves[i].clearHandles();
			}
			return results || locations;
		}

		function getWinding(point, curves, horizontal) {
			var epsilon = 2e-7,
				px = point.x,
				py = point.y,
				windLeft = 0,
				windRight = 0,
				length = curves.length,
				roots = [],
				abs = Math.abs;
			if (horizontal) {
				var yTop = -Infinity,
					yBottom = Infinity,
					yBefore = py - epsilon,
					yAfter = py + epsilon;
				for (var i = 0; i < length; i++) {
					var values = curves[i].values,
						count = Curve.solveCubic(values, 0, px, roots, 0, 1);
					for (var j = count - 1; j >= 0; j--) {
						var y = Curve.getPoint(values, roots[j]).y;
						if (y < yBefore && y > yTop) {
							yTop = y;
						} else if (y > yAfter && y < yBottom) {
							yBottom = y;
						}
					}
				}
				yTop = (yTop + py) / 2;
				yBottom = (yBottom + py) / 2;
				if (yTop > -Infinity)
					windLeft = getWinding(new Point(px, yTop), curves).winding;
				if (yBottom < Infinity)
					windRight = getWinding(new Point(px, yBottom), curves).winding;
			} else {
				var xBefore = px - epsilon,
					xAfter = px + epsilon,
					prevWinding,
					prevXEnd,
					windLeftOnCurve = 0,
					windRightOnCurve = 0,
					isOnCurve = false;
				for (var i = 0; i < length; i++) {
					var curve = curves[i],
						winding = curve.winding,
						values = curve.values,
						yStart = values[1],
						yEnd = values[7];
					if (curve.last) {
						prevWinding = curve.last.winding;
						prevXEnd = curve.last.values[6];
						isOnCurve = false;
					}
					if (py >= yStart && py <= yEnd || py >= yEnd && py <= yStart) {
						if (winding) {
							var x = py === yStart ? values[0]
								: py === yEnd ? values[6]
								: Curve.solveCubic(values, 1, py, roots, 0, 1) === 1
								? Curve.getPoint(values, roots[0]).x
								: null;
							if (x != null) {
								if (x >= xBefore && x <= xAfter) {
									isOnCurve = true;
								} else if (
									(py !== yStart || winding !== prevWinding)
									&& !(py === yStart
										&& (px - x) * (px - prevXEnd) < 0)) {
									if (x < xBefore) {
										windLeft += winding;
									} else if (x > xAfter) {
										windRight += winding;
									}
								}
							}
							prevWinding = winding;
							prevXEnd = values[6];
						} else if ((px - values[0]) * (px - values[6]) <= 0) {
							isOnCurve = true;
						}
					}
					if (isOnCurve && (i >= length - 1 || curves[i + 1].last)) {
						windLeftOnCurve += 1;
						windRightOnCurve -= 1;
					}
				}
				if (windLeft === 0 && windRight === 0) {
					windLeft = windLeftOnCurve;
					windRight = windRightOnCurve;
				}
			}
			return {
				winding: Math.max(abs(windLeft), abs(windRight)),
				contour: !windLeft ^ !windRight
			};
		}

		function propagateWinding(segment, path1, path2, monoCurves, operator) {
			var chain = [],
				start = segment,
				totalLength = 0,
				winding;
			do {
				var curve = segment.getCurve(),
					length = curve.getLength();
				chain.push({ segment: segment, curve: curve, length: length });
				totalLength += length;
				segment = segment.getNext();
			} while (segment && !segment._intersection && segment !== start);
			var length = totalLength / 2;
			for (var j = 0, l = chain.length; j < l; j++) {
				var entry = chain[j],
					curveLength = entry.length;
				if (length <= curveLength) {
					var curve = entry.curve,
						path = curve._path,
						parent = path._parent,
						t = curve.getTimeAt(length),
						pt = curve.getPointAtTime(t),
						hor = Math.abs(curve.getTangentAtTime(t).y)
								< 1e-7;
					if (parent instanceof CompoundPath)
						path = parent;
					winding = !(operator.subtract && path2 && (
							path === path1 &&  path2._getWinding(pt, hor) ||
							path === path2 && !path1._getWinding(pt, hor)))
								? getWinding(pt, monoCurves, hor)
								: { winding: 0 };
					 break;
				}
				length -= curveLength;
			}
			for (var j = chain.length - 1; j >= 0; j--) {
				var seg = chain[j].segment;
				seg._winding = winding.winding;
				seg._contour = winding.contour;
			}
		}

		function tracePaths(segments, operator) {
			var paths = [],
				start,
				otherStart;

			function isValid(seg, excludeContour) {
				return !!(seg && !seg._visited && (!operator
						|| operator[seg._winding]
						|| !excludeContour && operator.unite && seg._contour));
			}

			function isStart(seg) {
				return seg === start || seg === otherStart;
			}

			function findBestIntersection(inter, exclude) {
				if (!inter._next)
					return inter;
				while (inter) {
					var seg = inter._segment,
						nextSeg = seg.getNext(),
						nextInter = nextSeg && nextSeg._intersection;
					if (seg !== exclude && (isStart(seg) || isStart(nextSeg)
						|| !seg._visited && !nextSeg._visited
						&& (!operator || isValid(seg) && (isValid(nextSeg)
							|| nextInter && isValid(nextInter._segment)))
						))
						return inter;
					inter = inter._next;
				}
				return null;
			}

			for (var i = 0, l = segments.length; i < l; i++) {
				var path = null,
					finished = false,
					seg = segments[i],
					inter = seg._intersection,
					handleIn;
				if (!seg._visited && seg._path._overlapsOnly) {
					var path1 = seg._path,
						path2 = inter._segment._path,
						segments1 = path1._segments,
						segments2 = path2._segments;
					if (Base.equals(segments1, segments2)) {
						if ((operator.unite || operator.intersect)
								&& path1.getArea()) {
							paths.push(path1.clone(false));
						}
						for (var j = 0, k = segments1.length; j < k; j++) {
							segments1[j]._visited = segments2[j]._visited = true;
						}
					}
				}
				if (!isValid(seg, true)
						|| !seg._path._validOverlapsOnly && inter && inter._overlap)
					continue;
				start = otherStart = null;
				while (true) {
					inter = inter && findBestIntersection(inter, seg) || inter;
					var other = inter && inter._segment;
					if (isStart(seg)) {
						finished = true;
					} else if (other) {
						if (isStart(other)) {
							finished = true;
							seg = other;
						} else if (isValid(other, isValid(seg, true))) {
							if (operator
									&& (operator.intersect || operator.subtract)) {
								seg._visited = true;
							}
							seg = other;
						}
					}
					if (finished || seg._visited) {
						seg._visited = true;
						break;
					}
					if (seg._path._validOverlapsOnly && !isValid(seg))
						break;
					if (!path) {
						path = new Path(Item.NO_INSERT);
						start = seg;
						otherStart = other;
					}
					var next = seg.getNext();
					path.add(new Segment(seg._point, handleIn,
							next && seg._handleOut));
					seg._visited = true;
					seg = next || seg._path.getFirstSegment();
					handleIn = next && next._handleIn;
					inter = seg._intersection;
				}
				if (finished) {
					path.firstSegment.setHandleIn(handleIn);
					path.setClosed(true);
				} else if (path) {
					var area = path.getArea(true);
					if (Math.abs(area) >= 2e-7) {
						console.error('Boolean operation resulted in open path',
								'segments =', path._segments.length,
								'length =', path.getLength(),
								'area=', area);
					}
					path = null;
				}
				if (path && (path._segments.length > 8
						|| !Numerical.isZero(path.getArea()))) {
					paths.push(path);
					path = null;
				}
			}
			return paths;
		}

		return {
			_getWinding: function(point, horizontal) {
				return getWinding(point, this._getMonoCurves(), horizontal).winding;
			},

			unite: function(path) {
				return computeBoolean(this, path, 'unite');
			},

			intersect: function(path) {
				return computeBoolean(this, path, 'intersect');
			},

			subtract: function(path) {
				return computeBoolean(this, path, 'subtract');
			},

			exclude: function(path) {
				return computeBoolean(this, path, 'exclude');
			},

			divide: function(path) {
				return createResult(Group, [this.subtract(path),
						this.intersect(path)], true, this, path);
			},

			resolveCrossings: function() {
				var children = this._children,
					paths = children || [this];

				function hasOverlap(seg) {
					var inter = seg && seg._intersection;
					return inter && inter._overlap;
				}

				var hasOverlaps = false,
					hasCrossings = false,
					intersections = this.getIntersections(null, function(inter) {
						return inter._overlap && (hasOverlaps = true)
								|| inter.isCrossing() && (hasCrossings = true);
					});
				intersections = CurveLocation.expand(intersections);
				if (hasOverlaps) {
					var overlaps = divideLocations(intersections, function(inter) {
						return inter._overlap;
					});
					for (var i = overlaps.length - 1; i >= 0; i--) {
						var seg = overlaps[i]._segment,
							prev = seg.getPrevious(),
							next = seg.getNext();
						if (seg._path && hasOverlap(prev) && hasOverlap(next)) {
							seg.remove();
							prev._handleOut.set(0, 0);
							next._handleIn.set(0, 0);
							var curve = prev.getCurve();
							if (curve.isStraight() && curve.getLength() === 0)
								prev.remove();
						}
					}
				}
				if (hasCrossings) {
					divideLocations(intersections, hasOverlaps && function(inter) {
						var curve1 = inter.getCurve(),
							curve2 = inter._intersection._curve,
							seg = inter._segment;
						if (curve1 && curve2 && curve1._path && curve2._path) {
							return true;
						} else if (seg) {
							seg._intersection = null;
						}
					});
					paths = tracePaths(Base.each(paths, function(path) {
						this.push.apply(this, path._segments);
					}, []));
				}
				var length = paths.length,
					item;
				if (length > 1) {
					paths = paths.slice().sort(function (a, b) {
						return b.getBounds().getArea() - a.getBounds().getArea();
					});
					var first = paths[0],
						items = [first],
						excluded = {},
						isNonZero = this.getFillRule() === 'nonzero',
						windings = isNonZero && Base.each(paths, function(path) {
							this.push(path.isClockwise() ? 1 : -1);
						}, []);
					for (var i = 1; i < length; i++) {
						var path = paths[i],
							point = path.getInteriorPoint(),
							isContained = false,
							container = null,
							exclude = false;
						for (var j = i - 1; j >= 0 && !container; j--) {
							if (paths[j].contains(point)) {
								if (isNonZero && !isContained) {
									windings[i] += windings[j];
									if (windings[i] && windings[j]) {
										exclude = excluded[i] = true;
										break;
									}
								}
								isContained = true;
								container = !excluded[j] && paths[j];
							}
						}
						if (!exclude) {
							path.setClockwise(container ? !container.isClockwise()
									: first.isClockwise());
							items.push(path);
						}
					}
					paths = items;
					length = items.length;
				}
				if (length > 1 && children) {
					if (paths !== children) {
						this.setChildren(paths, true);
					}
					item = this;
				} else if (length === 1 && !children) {
					if (paths[0] !== this)
						this.setSegments(paths[0].removeSegments());
					item = this;
				}
				if (!item) {
					item = new CompoundPath(Item.NO_INSERT);
					item.addChildren(paths, true);
					item = item.reduce();
					item.copyAttributes(this);
					this.replaceWith(item);
				}
				return item;
			}
		};
	});

	Path.inject({
		_getMonoCurves: function() {
			var monoCurves = this._monoCurves,
				last;

			function insertCurve(v) {
				var y0 = v[1],
					y1 = v[7],
					winding = Math.abs((y0 - y1) / (v[0] - v[6]))
							< 2e-7
						? 0
						: y0 > y1
							? -1
							: 1,
					curve = { values: v, winding: winding };
				monoCurves.push(curve);
				if (winding)
					last = curve;
			}

			function handleCurve(v) {
				if (Curve.getLength(v) === 0)
					return;
				var y0 = v[1],
					y1 = v[3],
					y2 = v[5],
					y3 = v[7];
				if (Curve.isStraight(v)
						|| y0 >= y1 === y1 >= y2 && y1 >= y2 === y2 >= y3) {
					insertCurve(v);
				} else {
					var a = 3 * (y1 - y2) - y0 + y3,
						b = 2 * (y0 + y2) - 4 * y1,
						c = y1 - y0,
						tMin = 4e-7,
						tMax = 1 - tMin,
						roots = [],
						n = Numerical.solveQuadratic(a, b, c, roots, tMin, tMax);
					if (n < 1) {
						insertCurve(v);
					} else {
						roots.sort();
						var t = roots[0],
							parts = Curve.subdivide(v, t);
						insertCurve(parts[0]);
						if (n > 1) {
							t = (roots[1] - t) / (1 - t);
							parts = Curve.subdivide(parts[1], t);
							insertCurve(parts[0]);
						}
						insertCurve(parts[1]);
					}
				}
			}

			if (!monoCurves) {
				monoCurves = this._monoCurves = [];
				var curves = this.getCurves(),
					segments = this._segments;
				for (var i = 0, l = curves.length; i < l; i++)
					handleCurve(curves[i].getValues());
				if (!this._closed && segments.length > 1) {
					var p1 = segments[segments.length - 1]._point,
						p2 = segments[0]._point,
						p1x = p1._x, p1y = p1._y,
						p2x = p2._x, p2y = p2._y;
					handleCurve([p1x, p1y, p1x, p1y, p2x, p2y, p2x, p2y]);
				}
				if (monoCurves.length > 0) {
					monoCurves[0].last = last;
				}
			}
			return monoCurves;
		},

		getInteriorPoint: function() {
			var bounds = this.getBounds(),
				point = bounds.getCenter(true);
			if (!this.contains(point)) {
				var curves = this._getMonoCurves(),
					roots = [],
					y = point.y,
					intercepts = [];
				for (var i = 0, l = curves.length; i < l; i++) {
					var values = curves[i].values;
					if (curves[i].winding === 1
							&& y > values[1] && y <= values[7]
							|| y >= values[7] && y < values[1]) {
						var count = Curve.solveCubic(values, 1, y, roots, 0, 1);
						for (var j = count - 1; j >= 0; j--) {
							intercepts.push(Curve.getPoint(values, roots[j]).x);
						}
					}
				}
				intercepts.sort(function(a, b) { return a - b; });
				point.x = (intercepts[0] + intercepts[1]) / 2;
			}
			return point;
		}
	});

	CompoundPath.inject({
		_getMonoCurves: function() {
			var children = this._children,
				monoCurves = [];
			for (var i = 0, l = children.length; i < l; i++)
				monoCurves.push.apply(monoCurves, children[i]._getMonoCurves());
			return monoCurves;
		}
	});

	var PathIterator = Base.extend({
		_class: 'PathIterator',

		initialize: function(path, flatness, maxRecursion, ignoreStraight, matrix) {
			var curves = [],
				parts = [],
				length = 0,
				minSpan = 1 / (maxRecursion || 32),
				segments = path._segments,
				segment1 = segments[0],
				segment2;

			function addCurve(segment1, segment2) {
				var curve = Curve.getValues(segment1, segment2, matrix);
				curves.push(curve);
				computeParts(curve, segment1._index, 0, 1);
			}

			function computeParts(curve, index, t1, t2) {
				if ((t2 - t1) > minSpan
						&& !(ignoreStraight && Curve.isStraight(curve))
						&& !Curve.isFlatEnough(curve, flatness || 0.25)) {
					var halves = Curve.subdivide(curve, 0.5),
						tMid = (t1 + t2) / 2;
					computeParts(halves[0], index, t1, tMid);
					computeParts(halves[1], index, tMid, t2);
				} else {
					var dx = curve[6] - curve[0],
						dy = curve[7] - curve[1],
						dist = Math.sqrt(dx * dx + dy * dy);
					if (dist > 0) {
						length += dist;
						parts.push({
							offset: length,
							curve: curve,
							index: index,
							time: t2,
						});
					}
				}
			}

			for (var i = 1, l = segments.length; i < l; i++) {
				segment2 = segments[i];
				addCurve(segment1, segment2);
				segment1 = segment2;
			}
			if (path._closed)
				addCurve(segment2, segments[0]);
			this.curves = curves;
			this.parts = parts;
			this.length = length;
			this.index = 0;
		},

		_get: function(offset) {
			var i, j = this.index;
			for (;;) {
				i = j;
				if (j === 0 || this.parts[--j].offset < offset)
					break;
			}
			for (var l = this.parts.length; i < l; i++) {
				var part = this.parts[i];
				if (part.offset >= offset) {
					this.index = i;
					var prev = this.parts[i - 1];
					var prevTime = prev && prev.index === part.index ? prev.time : 0,
						prevOffset = prev ? prev.offset : 0;
					return {
						index: part.index,
						time: prevTime + (part.time - prevTime)
							* (offset - prevOffset) / (part.offset - prevOffset)
					};
				}
			}
			var part = this.parts[this.parts.length - 1];
			return {
				index: part.index,
				time: 1
			};
		},

		drawPart: function(ctx, from, to) {
			var start = this._get(from),
				end = this._get(to);
			for (var i = start.index, l = end.index; i <= l; i++) {
				var curve = Curve.getPart(this.curves[i],
						i === start.index ? start.time : 0,
						i === end.index ? end.time : 1);
				if (i === start.index)
					ctx.moveTo(curve[0], curve[1]);
				ctx.bezierCurveTo.apply(ctx, curve.slice(2));
			}
		}
	}, Base.each(Curve._evaluateMethods,
		function(name) {
			this[name + 'At'] = function(offset) {
				var param = this._get(offset);
				return Curve[name](this.curves[param.index], param.time);
			};
		}, {})
	);

	var PathFitter = Base.extend({
		initialize: function(path) {
			var points = this.points = [],
				segments = path._segments,
				closed = path._closed;
			for (var i = 0, prev, l = segments.length; i < l; i++) {
				var point = segments[i].point;
				if (!prev || !prev.equals(point)) {
					points.push(prev = point.clone());
				}
			}
			if (closed) {
				points.unshift(points[points.length - 1]);
				points.push(points[1]);
			}
			this.closed = closed;
		},

		fit: function(error) {
			var points = this.points,
				length = points.length,
				segments = null;
			if (length > 0) {
				segments = [new Segment(points[0])];
				if (length > 1) {
					this.fitCubic(segments, error, 0, length - 1,
							points[1].subtract(points[0]),
							points[length - 2].subtract(points[length - 1]));
					if (this.closed) {
						segments.shift();
						segments.pop();
					}
				}
			}
			return segments;
		},

		fitCubic: function(segments, error, first, last, tan1, tan2) {
			var points = this.points;
			if (last - first === 1) {
				var pt1 = points[first],
					pt2 = points[last],
					dist = pt1.getDistance(pt2) / 3;
				this.addCurve(segments, [pt1, pt1.add(tan1.normalize(dist)),
						pt2.add(tan2.normalize(dist)), pt2]);
				return;
			}
			var uPrime = this.chordLengthParameterize(first, last),
				maxError = Math.max(error, error * error),
				split,
				parametersInOrder = true;
			for (var i = 0; i <= 4; i++) {
				var curve = this.generateBezier(first, last, uPrime, tan1, tan2);
				var max = this.findMaxError(first, last, curve, uPrime);
				if (max.error < error && parametersInOrder) {
					this.addCurve(segments, curve);
					return;
				}
				split = max.index;
				if (max.error >= maxError)
					break;
				parametersInOrder = this.reparameterize(first, last, uPrime, curve);
				maxError = max.error;
			}
			var tanCenter = points[split - 1].subtract(points[split + 1]);
			this.fitCubic(segments, error, first, split, tan1, tanCenter);
			this.fitCubic(segments, error, split, last, tanCenter.negate(), tan2);
		},

		addCurve: function(segments, curve) {
			var prev = segments[segments.length - 1];
			prev.setHandleOut(curve[1].subtract(curve[0]));
			segments.push(new Segment(curve[3], curve[2].subtract(curve[3])));
		},

		generateBezier: function(first, last, uPrime, tan1, tan2) {
			var epsilon = 1e-12,
				abs = Math.abs,
				points = this.points,
				pt1 = points[first],
				pt2 = points[last],
				C = [[0, 0], [0, 0]],
				X = [0, 0];

			for (var i = 0, l = last - first + 1; i < l; i++) {
				var u = uPrime[i],
					t = 1 - u,
					b = 3 * u * t,
					b0 = t * t * t,
					b1 = b * t,
					b2 = b * u,
					b3 = u * u * u,
					a1 = tan1.normalize(b1),
					a2 = tan2.normalize(b2),
					tmp = points[first + i]
						.subtract(pt1.multiply(b0 + b1))
						.subtract(pt2.multiply(b2 + b3));
				C[0][0] += a1.dot(a1);
				C[0][1] += a1.dot(a2);
				C[1][0] = C[0][1];
				C[1][1] += a2.dot(a2);
				X[0] += a1.dot(tmp);
				X[1] += a2.dot(tmp);
			}

			var detC0C1 = C[0][0] * C[1][1] - C[1][0] * C[0][1],
				alpha1, alpha2;
			if (abs(detC0C1) > epsilon) {
				var detC0X = C[0][0] * X[1]    - C[1][0] * X[0],
					detXC1 = X[0]    * C[1][1] - X[1]    * C[0][1];
				alpha1 = detXC1 / detC0C1;
				alpha2 = detC0X / detC0C1;
			} else {
				var c0 = C[0][0] + C[0][1],
					c1 = C[1][0] + C[1][1];
				if (abs(c0) > epsilon) {
					alpha1 = alpha2 = X[0] / c0;
				} else if (abs(c1) > epsilon) {
					alpha1 = alpha2 = X[1] / c1;
				} else {
					alpha1 = alpha2 = 0;
				}
			}

			var segLength = pt2.getDistance(pt1),
				eps = epsilon * segLength,
				handle1,
				handle2;
			if (alpha1 < eps || alpha2 < eps) {
				alpha1 = alpha2 = segLength / 3;
			} else {
				var line = pt2.subtract(pt1);
				handle1 = tan1.normalize(alpha1);
				handle2 = tan2.normalize(alpha2);
				if (handle1.dot(line) - handle2.dot(line) > segLength * segLength) {
					alpha1 = alpha2 = segLength / 3;
					handle1 = handle2 = null;
				}
			}

			return [pt1,
					pt1.add(handle1 || tan1.normalize(alpha1)),
					pt2.add(handle2 || tan2.normalize(alpha2)),
					pt2];
		},

		reparameterize: function(first, last, u, curve) {
			for (var i = first; i <= last; i++) {
				u[i - first] = this.findRoot(curve, this.points[i], u[i - first]);
			}
			for (var i = 1, l = u.length; i < l; i++) {
				if (u[i] <= u[i - 1])
					return false;
			}
			return true;
		},

		findRoot: function(curve, point, u) {
			var curve1 = [],
				curve2 = [];
			for (var i = 0; i <= 2; i++) {
				curve1[i] = curve[i + 1].subtract(curve[i]).multiply(3);
			}
			for (var i = 0; i <= 1; i++) {
				curve2[i] = curve1[i + 1].subtract(curve1[i]).multiply(2);
			}
			var pt = this.evaluate(3, curve, u),
				pt1 = this.evaluate(2, curve1, u),
				pt2 = this.evaluate(1, curve2, u),
				diff = pt.subtract(point),
				df = pt1.dot(pt1) + diff.dot(pt2);
			if (Math.abs(df) < 1e-6)
				return u;
			return u - diff.dot(pt1) / df;
		},

		evaluate: function(degree, curve, t) {
			var tmp = curve.slice();
			for (var i = 1; i <= degree; i++) {
				for (var j = 0; j <= degree - i; j++) {
					tmp[j] = tmp[j].multiply(1 - t).add(tmp[j + 1].multiply(t));
				}
			}
			return tmp[0];
		},

		chordLengthParameterize: function(first, last) {
			var u = [0];
			for (var i = first + 1; i <= last; i++) {
				u[i - first] = u[i - first - 1]
						+ this.points[i].getDistance(this.points[i - 1]);
			}
			for (var i = 1, m = last - first; i <= m; i++) {
				u[i] /= u[m];
			}
			return u;
		},

		findMaxError: function(first, last, curve, u) {
			var index = Math.floor((last - first + 1) / 2),
				maxDist = 0;
			for (var i = first + 1; i < last; i++) {
				var P = this.evaluate(3, curve, u[i - first]);
				var v = P.subtract(this.points[i]);
				var dist = v.x * v.x + v.y * v.y;
				if (dist >= maxDist) {
					maxDist = dist;
					index = i;
				}
			}
			return {
				error: maxDist,
				index: index
			};
		}
	});

	var TextItem = Item.extend({
		_class: 'TextItem',
		_applyMatrix: false,
		_canApplyMatrix: false,
		_serializeFields: {
			content: null
		},
		_boundsOptions: { stroke: false, handle: false },

		initialize: function TextItem(arg) {
			this._content = '';
			this._lines = [];
			var hasProps = arg && Base.isPlainObject(arg)
					&& arg.x === undefined && arg.y === undefined;
			this._initialize(hasProps && arg, !hasProps && Point.read(arguments));
		},

		_equals: function(item) {
			return this._content === item._content;
		},

		copyContent: function(source) {
			this.setContent(source._content);
		},

		getContent: function() {
			return this._content;
		},

		setContent: function(content) {
			this._content = '' + content;
			this._lines = this._content.split(/\r\n|\n|\r/mg);
			this._changed(265);
		},

		isEmpty: function() {
			return !this._content;
		},

		getCharacterStyle: '#getStyle',
		setCharacterStyle: '#setStyle',

		getParagraphStyle: '#getStyle',
		setParagraphStyle: '#setStyle'
	});

	var PointText = TextItem.extend({
		_class: 'PointText',

		initialize: function PointText() {
			TextItem.apply(this, arguments);
		},

		getPoint: function() {
			var point = this._matrix.getTranslation();
			return new LinkedPoint(point.x, point.y, this, 'setPoint');
		},

		setPoint: function() {
			var point = Point.read(arguments);
			this.translate(point.subtract(this._matrix.getTranslation()));
		},

		_draw: function(ctx, param, viewMatrix) {
			if (!this._content)
				return;
			this._setStyles(ctx, param, viewMatrix);
			var lines = this._lines,
				style = this._style,
				hasFill = style.hasFill(),
				hasStroke = style.hasStroke(),
				leading = style.getLeading(),
				shadowColor = ctx.shadowColor;
			ctx.font = style.getFontStyle();
			ctx.textAlign = style.getJustification();
			for (var i = 0, l = lines.length; i < l; i++) {
				ctx.shadowColor = shadowColor;
				var line = lines[i];
				if (hasFill) {
					ctx.fillText(line, 0, 0);
					ctx.shadowColor = 'rgba(0,0,0,0)';
				}
				if (hasStroke)
					ctx.strokeText(line, 0, 0);
				ctx.translate(0, leading);
			}
		},

		_getBounds: function(matrix, options) {
			var style = this._style,
				lines = this._lines,
				numLines = lines.length,
				justification = style.getJustification(),
				leading = style.getLeading(),
				width = this.getView().getTextWidth(style.getFontStyle(), lines),
				x = 0;
			if (justification !== 'left')
				x -= width / (justification === 'center' ? 2: 1);
			var bounds = new Rectangle(x,
						numLines ? - 0.75 * leading : 0,
						width, numLines * leading);
			return matrix ? matrix._transformBounds(bounds, bounds) : bounds;
		}
	});

	var Color = Base.extend(new function() {
		var types = {
			gray: ['gray'],
			rgb: ['red', 'green', 'blue'],
			hsb: ['hue', 'saturation', 'brightness'],
			hsl: ['hue', 'saturation', 'lightness'],
			gradient: ['gradient', 'origin', 'destination', 'highlight']
		};

		var componentParsers = {},
			colorCache = {},
			colorCtx;

		function fromCSS(string) {
			var match = string.match(/^#(\w{1,2})(\w{1,2})(\w{1,2})$/),
				components;
			if (match) {
				components = [0, 0, 0];
				for (var i = 0; i < 3; i++) {
					var value = match[i + 1];
					components[i] = parseInt(value.length == 1
							? value + value : value, 16) / 255;
				}
			} else if (match = string.match(/^rgba?\((.*)\)$/)) {
				components = match[1].split(',');
				for (var i = 0, l = components.length; i < l; i++) {
					var value = +components[i];
					components[i] = i < 3 ? value / 255 : value;
				}
			} else if (window) {
				var cached = colorCache[string];
				if (!cached) {
					if (!colorCtx) {
						colorCtx = CanvasProvider.getContext(1, 1);
						colorCtx.globalCompositeOperation = 'copy';
					}
					colorCtx.fillStyle = 'rgba(0,0,0,0)';
					colorCtx.fillStyle = string;
					colorCtx.fillRect(0, 0, 1, 1);
					var data = colorCtx.getImageData(0, 0, 1, 1).data;
					cached = colorCache[string] = [
						data[0] / 255,
						data[1] / 255,
						data[2] / 255
					];
				}
				components = cached.slice();
			} else {
				components = [0, 0, 0];
			}
			return components;
		}

		var hsbIndices = [
			[0, 3, 1],
			[2, 0, 1],
			[1, 0, 3],
			[1, 2, 0],
			[3, 1, 0],
			[0, 1, 2]
		];

		var converters = {
			'rgb-hsb': function(r, g, b) {
				var max = Math.max(r, g, b),
					min = Math.min(r, g, b),
					delta = max - min,
					h = delta === 0 ? 0
						:   ( max == r ? (g - b) / delta + (g < b ? 6 : 0)
							: max == g ? (b - r) / delta + 2
							:            (r - g) / delta + 4) * 60;
				return [h, max === 0 ? 0 : delta / max, max];
			},

			'hsb-rgb': function(h, s, b) {
				h = (((h / 60) % 6) + 6) % 6;
				var i = Math.floor(h),
					f = h - i,
					i = hsbIndices[i],
					v = [
						b,
						b * (1 - s),
						b * (1 - s * f),
						b * (1 - s * (1 - f))
					];
				return [v[i[0]], v[i[1]], v[i[2]]];
			},

			'rgb-hsl': function(r, g, b) {
				var max = Math.max(r, g, b),
					min = Math.min(r, g, b),
					delta = max - min,
					achromatic = delta === 0,
					h = achromatic ? 0
						:   ( max == r ? (g - b) / delta + (g < b ? 6 : 0)
							: max == g ? (b - r) / delta + 2
							:            (r - g) / delta + 4) * 60,
					l = (max + min) / 2,
					s = achromatic ? 0 : l < 0.5
							? delta / (max + min)
							: delta / (2 - max - min);
				return [h, s, l];
			},

			'hsl-rgb': function(h, s, l) {
				h = (((h / 360) % 1) + 1) % 1;
				if (s === 0)
					return [l, l, l];
				var t3s = [ h + 1 / 3, h, h - 1 / 3 ],
					t2 = l < 0.5 ? l * (1 + s) : l + s - l * s,
					t1 = 2 * l - t2,
					c = [];
				for (var i = 0; i < 3; i++) {
					var t3 = t3s[i];
					if (t3 < 0) t3 += 1;
					if (t3 > 1) t3 -= 1;
					c[i] = 6 * t3 < 1
						? t1 + (t2 - t1) * 6 * t3
						: 2 * t3 < 1
							? t2
							: 3 * t3 < 2
								? t1 + (t2 - t1) * ((2 / 3) - t3) * 6
								: t1;
				}
				return c;
			},

			'rgb-gray': function(r, g, b) {
				return [r * 0.2989 + g * 0.587 + b * 0.114];
			},

			'gray-rgb': function(g) {
				return [g, g, g];
			},

			'gray-hsb': function(g) {
				return [0, 0, g];
			},

			'gray-hsl': function(g) {
				return [0, 0, g];
			},

			'gradient-rgb': function() {
				return [];
			},

			'rgb-gradient': function() {
				return [];
			}

		};

		return Base.each(types, function(properties, type) {
			componentParsers[type] = [];
			Base.each(properties, function(name, index) {
				var part = Base.capitalize(name),
					hasOverlap = /^(hue|saturation)$/.test(name),
					parser = componentParsers[type][index] = name === 'gradient'
						? function(value) {
							var current = this._components[0];
							value = Gradient.read(Array.isArray(value) ? value
									: arguments, 0, { readNull: true });
							if (current !== value) {
								if (current)
									current._removeOwner(this);
								if (value)
									value._addOwner(this);
							}
							return value;
						}
						: type === 'gradient'
							? function() {
								return Point.read(arguments, 0, {
										readNull: name === 'highlight',
										clone: true
								});
							}
							: function(value) {
								return value == null || isNaN(value) ? 0 : value;
							};

				this['get' + part] = function() {
					return this._type === type
						|| hasOverlap && /^hs[bl]$/.test(this._type)
							? this._components[index]
							: this._convert(type)[index];
				};

				this['set' + part] = function(value) {
					if (this._type !== type
							&& !(hasOverlap && /^hs[bl]$/.test(this._type))) {
						this._components = this._convert(type);
						this._properties = types[type];
						this._type = type;
					}
					this._components[index] = parser.call(this, value);
					this._changed();
				};
			}, this);
		}, {
			_class: 'Color',
			_readIndex: true,

			initialize: function Color(arg) {
				var slice = Array.prototype.slice,
					args = arguments,
					reading = this.__read,
					read = 0,
					type,
					components,
					alpha,
					values;
				if (Array.isArray(arg)) {
					args = arg;
					arg = args[0];
				}
				var argType = arg != null && typeof arg;
				if (argType === 'string' && arg in types) {
					type = arg;
					arg = args[1];
					if (Array.isArray(arg)) {
						components = arg;
						alpha = args[2];
					} else {
						if (reading)
							read = 1;
						args = slice.call(args, 1);
						argType = typeof arg;
					}
				}
				if (!components) {
					values = argType === 'number'
							? args
							: argType === 'object' && arg.length != null
								? arg
								: null;
					if (values) {
						if (!type)
							type = values.length >= 3
									? 'rgb'
									: 'gray';
						var length = types[type].length;
						alpha = values[length];
						if (reading) {
							read += values === arguments
								? length + (alpha != null ? 1 : 0)
								: 1;
						}
						if (values.length > length)
							values = slice.call(values, 0, length);
					} else if (argType === 'string') {
						type = 'rgb';
						components = fromCSS(arg);
						if (components.length === 4) {
							alpha = components[3];
							components.length--;
						}
					} else if (argType === 'object') {
						if (arg.constructor === Color) {
							type = arg._type;
							components = arg._components.slice();
							alpha = arg._alpha;
							if (type === 'gradient') {
								for (var i = 1, l = components.length; i < l; i++) {
									var point = components[i];
									if (point)
										components[i] = point.clone();
								}
							}
						} else if (arg.constructor === Gradient) {
							type = 'gradient';
							values = args;
						} else {
							type = 'hue' in arg
								? 'lightness' in arg
									? 'hsl'
									: 'hsb'
								: 'gradient' in arg || 'stops' in arg
										|| 'radial' in arg
									? 'gradient'
									: 'gray' in arg
										? 'gray'
										: 'rgb';
							var properties = types[type],
								parsers = componentParsers[type];
							this._components = components = [];
							for (var i = 0, l = properties.length; i < l; i++) {
								var value = arg[properties[i]];
								if (value == null && i === 0 && type === 'gradient'
										&& 'stops' in arg) {
									value = {
										stops: arg.stops,
										radial: arg.radial
									};
								}
								value = parsers[i].call(this, value);
								if (value != null)
									components[i] = value;
							}
							alpha = arg.alpha;
						}
					}
					if (reading && type)
						read = 1;
				}
				this._type = type || 'rgb';
				if (!components) {
					this._components = components = [];
					var parsers = componentParsers[this._type];
					for (var i = 0, l = parsers.length; i < l; i++) {
						var value = parsers[i].call(this, values && values[i]);
						if (value != null)
							components[i] = value;
					}
				}
				this._components = components;
				this._properties = types[this._type];
				this._alpha = alpha;
				if (reading)
					this.__read = read;
			},

			_set: '#initialize',

			_serialize: function(options, dictionary) {
				var components = this.getComponents();
				return Base.serialize(
						/^(gray|rgb)$/.test(this._type)
							? components
							: [this._type].concat(components),
						options, true, dictionary);
			},

			_changed: function() {
				this._canvasStyle = null;
				if (this._owner)
					this._owner._changed(65);
			},

			_convert: function(type) {
				var converter;
				return this._type === type
						? this._components.slice()
						: (converter = converters[this._type + '-' + type])
							? converter.apply(this, this._components)
							: converters['rgb-' + type].apply(this,
								converters[this._type + '-rgb'].apply(this,
									this._components));
			},

			convert: function(type) {
				return new Color(type, this._convert(type), this._alpha);
			},

			getType: function() {
				return this._type;
			},

			setType: function(type) {
				this._components = this._convert(type);
				this._properties = types[type];
				this._type = type;
			},

			getComponents: function() {
				var components = this._components.slice();
				if (this._alpha != null)
					components.push(this._alpha);
				return components;
			},

			getAlpha: function() {
				return this._alpha != null ? this._alpha : 1;
			},

			setAlpha: function(alpha) {
				this._alpha = alpha == null ? null : Math.min(Math.max(alpha, 0), 1);
				this._changed();
			},

			hasAlpha: function() {
				return this._alpha != null;
			},

			equals: function(color) {
				var col = Base.isPlainValue(color, true)
						? Color.read(arguments)
						: color;
				return col === this || col && this._class === col._class
						&& this._type === col._type
						&& this._alpha === col._alpha
						&& Base.equals(this._components, col._components)
						|| false;
			},

			toString: function() {
				var properties = this._properties,
					parts = [],
					isGradient = this._type === 'gradient',
					f = Formatter.instance;
				for (var i = 0, l = properties.length; i < l; i++) {
					var value = this._components[i];
					if (value != null)
						parts.push(properties[i] + ': '
								+ (isGradient ? value : f.number(value)));
				}
				if (this._alpha != null)
					parts.push('alpha: ' + f.number(this._alpha));
				return '{ ' + parts.join(', ') + ' }';
			},

			toCSS: function(hex) {
				var components = this._convert('rgb'),
					alpha = hex || this._alpha == null ? 1 : this._alpha;
				function convert(val) {
					return Math.round((val < 0 ? 0 : val > 1 ? 1 : val) * 255);
				}
				components = [
					convert(components[0]),
					convert(components[1]),
					convert(components[2])
				];
				if (alpha < 1)
					components.push(alpha < 0 ? 0 : alpha);
				return hex
						? '#' + ((1 << 24) + (components[0] << 16)
							+ (components[1] << 8)
							+ components[2]).toString(16).slice(1)
						: (components.length == 4 ? 'rgba(' : 'rgb(')
							+ components.join(',') + ')';
			},

			toCanvasStyle: function(ctx) {
				if (this._canvasStyle)
					return this._canvasStyle;
				if (this._type !== 'gradient')
					return this._canvasStyle = this.toCSS();
				var components = this._components,
					gradient = components[0],
					stops = gradient._stops,
					origin = components[1],
					destination = components[2],
					canvasGradient;
				if (gradient._radial) {
					var radius = destination.getDistance(origin),
						highlight = components[3];
					if (highlight) {
						var vector = highlight.subtract(origin);
						if (vector.getLength() > radius)
							highlight = origin.add(vector.normalize(radius - 0.1));
					}
					var start = highlight || origin;
					canvasGradient = ctx.createRadialGradient(start.x, start.y,
							0, origin.x, origin.y, radius);
				} else {
					canvasGradient = ctx.createLinearGradient(origin.x, origin.y,
							destination.x, destination.y);
				}
				for (var i = 0, l = stops.length; i < l; i++) {
					var stop = stops[i];
					canvasGradient.addColorStop(stop._offset || i / (l - 1),
							stop._color.toCanvasStyle());
				}
				return this._canvasStyle = canvasGradient;
			},

			transform: function(matrix) {
				if (this._type === 'gradient') {
					var components = this._components;
					for (var i = 1, l = components.length; i < l; i++) {
						var point = components[i];
						matrix._transformPoint(point, point, true);
					}
					this._changed();
				}
			},

			statics: {
				_types: types,

				random: function() {
					var random = Math.random;
					return new Color(random(), random(), random());
				}
			}
		});
	},
	new function() {
		var operators = {
			add: function(a, b) {
				return a + b;
			},

			subtract: function(a, b) {
				return a - b;
			},

			multiply: function(a, b) {
				return a * b;
			},

			divide: function(a, b) {
				return a / b;
			}
		};

		return Base.each(operators, function(operator, name) {
			this[name] = function(color) {
				color = Color.read(arguments);
				var type = this._type,
					components1 = this._components,
					components2 = color._convert(type);
				for (var i = 0, l = components1.length; i < l; i++)
					components2[i] = operator(components1[i], components2[i]);
				return new Color(type, components2,
						this._alpha != null
								? operator(this._alpha, color.getAlpha())
								: null);
			};
		}, {
		});
	});

	var Gradient = Base.extend({
		_class: 'Gradient',

		initialize: function Gradient(stops, radial) {
			this._id = UID.get();
			if (stops && this._set(stops))
				stops = radial = null;
			if (!this._stops)
				this.setStops(stops || ['white', 'black']);
			if (this._radial == null) {
				this.setRadial(typeof radial === 'string' && radial === 'radial'
						|| radial || false);
			}
		},

		_serialize: function(options, dictionary) {
			return dictionary.add(this, function() {
				return Base.serialize([this._stops, this._radial],
						options, true, dictionary);
			});
		},

		_changed: function() {
			for (var i = 0, l = this._owners && this._owners.length; i < l; i++) {
				this._owners[i]._changed();
			}
		},

		_addOwner: function(color) {
			if (!this._owners)
				this._owners = [];
			this._owners.push(color);
		},

		_removeOwner: function(color) {
			var index = this._owners ? this._owners.indexOf(color) : -1;
			if (index != -1) {
				this._owners.splice(index, 1);
				if (this._owners.length === 0)
					this._owners = undefined;
			}
		},

		clone: function() {
			var stops = [];
			for (var i = 0, l = this._stops.length; i < l; i++) {
				stops[i] = this._stops[i].clone();
			}
			return new Gradient(stops, this._radial);
		},

		getStops: function() {
			return this._stops;
		},

		setStops: function(stops) {
			if (stops.length < 2) {
				throw new Error(
						'Gradient stop list needs to contain at least two stops.');
			}
			var _stops = this._stops;
			if (_stops) {
				for (var i = 0, l = _stops.length; i < l; i++)
					_stops[i]._owner = undefined;
			}
			_stops = this._stops = GradientStop.readAll(stops, 0, { clone: true });
			for (var i = 0, l = _stops.length; i < l; i++)
				_stops[i]._owner = this;
			this._changed();
		},

		getRadial: function() {
			return this._radial;
		},

		setRadial: function(radial) {
			this._radial = radial;
			this._changed();
		},

		equals: function(gradient) {
			if (gradient === this)
				return true;
			if (gradient && this._class === gradient._class) {
				var stops1 = this._stops,
					stops2 = gradient._stops,
					length = stops1.length;
				if (length === stops2.length) {
					for (var i = 0; i < length; i++) {
						if (!stops1[i].equals(stops2[i]))
							return false;
					}
					return true;
				}
			}
			return false;
		}
	});

	var GradientStop = Base.extend({
		_class: 'GradientStop',

		initialize: function GradientStop(arg0, arg1) {
			var color = arg0,
				offset = arg1;
			if (typeof arg0 === 'object' && arg1 === undefined) {
				if (Array.isArray(arg0) && typeof arg0[0] !== 'number') {
					color = arg0[0];
					offset = arg0[1];
				} else if ('color' in arg0 || 'offset' in arg0
						|| 'rampPoint' in arg0) {
					color = arg0.color;
					offset = arg0.offset || arg0.rampPoint || 0;
				}
			}
			this.setColor(color);
			this.setOffset(offset);
		},

		clone: function() {
			return new GradientStop(this._color.clone(), this._offset);
		},

		_serialize: function(options, dictionary) {
			var color = this._color,
				offset = this._offset;
			return Base.serialize(offset == null ? [color] : [color, offset],
					options, true, dictionary);
		},

		_changed: function() {
			if (this._owner)
				this._owner._changed(65);
		},

		getOffset: function() {
			return this._offset;
		},

		setOffset: function(offset) {
			this._offset = offset;
			this._changed();
		},

		getRampPoint: '#getOffset',
		setRampPoint: '#setOffset',

		getColor: function() {
			return this._color;
		},

		setColor: function() {
			var color = Color.read(arguments, 0, { clone: true });
			if (color)
				color._owner = this;
			this._color = color;
			this._changed();
		},

		equals: function(stop) {
			return stop === this || stop && this._class === stop._class
					&& this._color.equals(stop._color)
					&& this._offset == stop._offset
					|| false;
		}
	});

	var Style = Base.extend(new function() {
		var itemDefaults = {
			fillColor: null,
			fillRule: 'nonzero',
			strokeColor: null,
			strokeWidth: 1,
			strokeCap: 'butt',
			strokeJoin: 'miter',
			strokeScaling: true,
			miterLimit: 10,
			dashOffset: 0,
			dashArray: [],
			shadowColor: null,
			shadowBlur: 0,
			shadowOffset: new Point(),
			selectedColor: null
		},
		groupDefaults = Base.set({}, itemDefaults, {
			fontFamily: 'sans-serif',
			fontWeight: 'normal',
			fontSize: 12,
			leading: null,
			justification: 'left'
		}),
		textDefaults = Base.set({}, groupDefaults, {
			fillColor: new Color()
		}),
		flags = {
			strokeWidth: 97,
			strokeCap: 97,
			strokeJoin: 97,
			strokeScaling: 105,
			miterLimit: 97,
			fontFamily: 9,
			fontWeight: 9,
			fontSize: 9,
			font: 9,
			leading: 9,
			justification: 9
		},
		item = {
			beans: true
		},
		fields = {
			_class: 'Style',
			beans: true,

			initialize: function Style(style, owner, project) {
				this._values = {};
				this._owner = owner;
				this._project = owner && owner._project || project || paper.project;
				this._defaults = !owner || owner instanceof Group ? groupDefaults
						: owner instanceof TextItem ? textDefaults
						: itemDefaults;
				if (style)
					this.set(style);
			}
		};

		Base.each(groupDefaults, function(value, key) {
			var isColor = /Color$/.test(key),
				isPoint = key === 'shadowOffset',
				part = Base.capitalize(key),
				flag = flags[key],
				set = 'set' + part,
				get = 'get' + part;

			fields[set] = function(value) {
				var owner = this._owner,
					children = owner && owner._children;
				if (children && children.length > 0
						&& !(owner instanceof CompoundPath)) {
					for (var i = 0, l = children.length; i < l; i++)
						children[i]._style[set](value);
				} else if (key in this._defaults) {
					var old = this._values[key];
					if (old !== value) {
						if (isColor) {
							if (old && old._owner !== undefined)
								old._owner = undefined;
							if (value && value.constructor === Color) {
								if (value._owner)
									value = value.clone();
								value._owner = owner;
							}
						}
						this._values[key] = value;
						if (owner)
							owner._changed(flag || 65);
					}
				}
			};

			fields[get] = function(_dontMerge) {
				var owner = this._owner,
					children = owner && owner._children,
					value;
				if (key in this._defaults && (!children || children.length === 0
						|| _dontMerge || owner instanceof CompoundPath)) {
					var value = this._values[key];
					if (value === undefined) {
						value = this._defaults[key];
						if (value && value.clone)
							value = value.clone();
					} else {
						var ctor = isColor ? Color : isPoint ? Point : null;
						if (ctor && !(value && value.constructor === ctor)) {
							this._values[key] = value = ctor.read([value], 0,
									{ readNull: true, clone: true });
							if (value && isColor)
								value._owner = owner;
						}
					}
				} else if (children) {
					for (var i = 0, l = children.length; i < l; i++) {
						var childValue = children[i]._style[get]();
						if (i === 0) {
							value = childValue;
						} else if (!Base.equals(value, childValue)) {
							return undefined;
						}
					}
				}
				return value;
			};

			item[get] = function(_dontMerge) {
				return this._style[get](_dontMerge);
			};

			item[set] = function(value) {
				this._style[set](value);
			};
		});

		Base.each({
			Font: 'FontFamily',
			WindingRule: 'FillRule'
		}, function(value, key) {
			var get = 'get' + key,
				set = 'set' + key;
			fields[get] = item[get] = '#get' + value;
			fields[set] = item[set] = '#set' + value;
		});

		Item.inject(item);
		return fields;
	}, {
		set: function(style) {
			var isStyle = style instanceof Style,
				values = isStyle ? style._values : style;
			if (values) {
				for (var key in values) {
					if (key in this._defaults) {
						var value = values[key];
						this[key] = value && isStyle && value.clone
								? value.clone() : value;
					}
				}
			}
		},

		equals: function(style) {
			return style === this || style && this._class === style._class
					&& Base.equals(this._values, style._values)
					|| false;
		},

		hasFill: function() {
			var color = this.getFillColor();
			return !!color && color.alpha > 0;
		},

		hasStroke: function() {
			var color = this.getStrokeColor();
			return !!color && color.alpha > 0 && this.getStrokeWidth() > 0;
		},

		hasShadow: function() {
			var color = this.getShadowColor();
			return !!color && color.alpha > 0 && (this.getShadowBlur() > 0
					|| !this.getShadowOffset().isZero());
		},

		getView: function() {
			return this._project._view;
		},

		getFontStyle: function() {
			var fontSize = this.getFontSize();
			return this.getFontWeight()
					+ ' ' + fontSize + (/[a-z]/i.test(fontSize + '') ? ' ' : 'px ')
					+ this.getFontFamily();
		},

		getFont: '#getFontFamily',
		setFont: '#setFontFamily',

		getLeading: function getLeading() {
			var leading = getLeading.base.call(this),
				fontSize = this.getFontSize();
			if (/pt|em|%|px/.test(fontSize))
				fontSize = this.getView().getPixelSize(fontSize);
			return leading != null ? leading : fontSize * 1.2;
		}

	});

	var DomElement = new function() {
		function handlePrefix(el, name, set, value) {
			var prefixes = ['', 'webkit', 'moz', 'Moz', 'ms', 'o'],
				suffix = name[0].toUpperCase() + name.substring(1);
			for (var i = 0; i < 6; i++) {
				var prefix = prefixes[i],
					key = prefix ? prefix + suffix : name;
				if (key in el) {
					if (set) {
						el[key] = value;
					} else {
						return el[key];
					}
					break;
				}
			}
		}

		return {
			getStyles: function(el) {
				var doc = el && el.nodeType !== 9 ? el.ownerDocument : el,
					view = doc && doc.defaultView;
				return view && view.getComputedStyle(el, '');
			},

			getBounds: function(el, viewport) {
				var doc = el.ownerDocument,
					body = doc.body,
					html = doc.documentElement,
					rect;
				try {
					rect = el.getBoundingClientRect();
				} catch (e) {
					rect = { left: 0, top: 0, width: 0, height: 0 };
				}
				var x = rect.left - (html.clientLeft || body.clientLeft || 0),
					y = rect.top - (html.clientTop || body.clientTop || 0);
				if (!viewport) {
					var view = doc.defaultView;
					x += view.pageXOffset || html.scrollLeft || body.scrollLeft;
					y += view.pageYOffset || html.scrollTop || body.scrollTop;
				}
				return new Rectangle(x, y, rect.width, rect.height);
			},

			getViewportBounds: function(el) {
				var doc = el.ownerDocument,
					view = doc.defaultView,
					html = doc.documentElement;
				return new Rectangle(0, 0,
					view.innerWidth || html.clientWidth,
					view.innerHeight || html.clientHeight
				);
			},

			getOffset: function(el, viewport) {
				return DomElement.getBounds(el, viewport).getPoint();
			},

			getSize: function(el) {
				return DomElement.getBounds(el, true).getSize();
			},

			isInvisible: function(el) {
				return DomElement.getSize(el).equals(new Size(0, 0));
			},

			isInView: function(el) {
				return !DomElement.isInvisible(el)
						&& DomElement.getViewportBounds(el).intersects(
							DomElement.getBounds(el, true));
			},

			isInserted: function(el) {
				return document.body.contains(el);
			},

			getPrefixed: function(el, name) {
				return el && handlePrefix(el, name);
			},

			setPrefixed: function(el, name, value) {
				if (typeof name === 'object') {
					for (var key in name)
						handlePrefix(el, key, true, name[key]);
				} else {
					handlePrefix(el, name, true, value);
				}
			}
		};
	};

	var DomEvent = {
		add: function(el, events) {
			if (el) {
				for (var type in events) {
					var func = events[type],
						parts = type.split(/[\s,]+/g);
					for (var i = 0, l = parts.length; i < l; i++)
						el.addEventListener(parts[i], func, false);
				}
			}
		},

		remove: function(el, events) {
			if (el) {
				for (var type in events) {
					var func = events[type],
						parts = type.split(/[\s,]+/g);
					for (var i = 0, l = parts.length; i < l; i++)
						el.removeEventListener(parts[i], func, false);
				}
			}
		},

		getPoint: function(event) {
			var pos = event.targetTouches
					? event.targetTouches.length
						? event.targetTouches[0]
						: event.changedTouches[0]
					: event;
			return new Point(
				pos.pageX || pos.clientX + document.documentElement.scrollLeft,
				pos.pageY || pos.clientY + document.documentElement.scrollTop
			);
		},

		getTarget: function(event) {
			return event.target || event.srcElement;
		},

		getRelatedTarget: function(event) {
			return event.relatedTarget || event.toElement;
		},

		getOffset: function(event, target) {
			return DomEvent.getPoint(event).subtract(DomElement.getOffset(
					target || DomEvent.getTarget(event)));
		}
	};

	DomEvent.requestAnimationFrame = new function() {
		var nativeRequest = DomElement.getPrefixed(window, 'requestAnimationFrame'),
			requested = false,
			callbacks = [],
			timer;

		function handleCallbacks() {
			var functions = callbacks;
			callbacks = [];
			for (var i = 0, l = functions.length; i < l; i++)
				functions[i]();
			requested = nativeRequest && callbacks.length;
			if (requested)
				nativeRequest(handleCallbacks);
		}

		return function(callback) {
			callbacks.push(callback);
			if (nativeRequest) {
				if (!requested) {
					nativeRequest(handleCallbacks);
					requested = true;
				}
			} else if (!timer) {
				timer = setInterval(handleCallbacks, 1000 / 60);
			}
		};
	};

	var View = Base.extend(Emitter, {
		_class: 'View',

		initialize: function View(project, element) {

			function getSize(name) {
				return element[name] || parseInt(element.getAttribute(name), 10);
			}

			function getCanvasSize() {
				var size = DomElement.getSize(element);
				return size.isNaN() || size.isZero()
						? new Size(getSize('width'), getSize('height'))
						: size;
			}

			var size;
			if (window && element) {
				this._id = element.getAttribute('id');
				if (this._id == null)
					element.setAttribute('id', this._id = 'view-' + View._id++);
				DomEvent.add(element, this._viewEvents);
				var none = 'none';
				DomElement.setPrefixed(element.style, {
					userDrag: none,
					userSelect: none,
					touchCallout: none,
					contentZooming: none,
					tapHighlightColor: 'rgba(0,0,0,0)'
				});

				if (PaperScope.hasAttribute(element, 'resize')) {
					var that = this;
					DomEvent.add(window, this._windowEvents = {
						resize: function() {
							that.setViewSize(getCanvasSize());
						}
					});
				}

				size = getCanvasSize();

				if (PaperScope.hasAttribute(element, 'stats')
						&& typeof Stats !== 'undefined') {
					this._stats = new Stats();
					var stats = this._stats.domElement,
						style = stats.style,
						offset = DomElement.getOffset(element);
					style.position = 'absolute';
					style.left = offset.x + 'px';
					style.top = offset.y + 'px';
					document.body.appendChild(stats);
				}
			} else {
				size = new Size(element);
				element = null;
			}
			this._project = project;
			this._scope = project._scope;
			this._element = element;
			if (!this._pixelRatio)
				this._pixelRatio = window && window.devicePixelRatio || 1;
			this._setElementSize(size.width, size.height);
			this._viewSize = size;
			View._views.push(this);
			View._viewsById[this._id] = this;
			(this._matrix = new Matrix())._owner = this;
			this._zoom = 1;
			if (!View._focused)
				View._focused = this;
			this._frameItems = {};
			this._frameItemCount = 0;
			this._itemEvents = { native: {}, virtual: {} };
			this._autoUpdate = !paper.agent.node;
			this._needsUpdate = false;
		},

		remove: function() {
			if (!this._project)
				return false;
			if (View._focused === this)
				View._focused = null;
			View._views.splice(View._views.indexOf(this), 1);
			delete View._viewsById[this._id];
			var project = this._project;
			if (project._view === this)
				project._view = null;
			DomEvent.remove(this._element, this._viewEvents);
			DomEvent.remove(window, this._windowEvents);
			this._element = this._project = null;
			this.off('frame');
			this._animate = false;
			this._frameItems = {};
			return true;
		},

		_events: Base.each(
			Item._itemHandlers.concat(['onResize', 'onKeyDown', 'onKeyUp']),
			function(name) {
				this[name] = {};
			}, {
				onFrame: {
					install: function() {
						this.play();
					},

					uninstall: function() {
						this.pause();
					}
				}
			}
		),

		_animate: false,
		_time: 0,
		_count: 0,

		getAutoUpdate: function() {
			return this._autoUpdate;
		},

		setAutoUpdate: function(autoUpdate) {
			this._autoUpdate = autoUpdate;
			if (autoUpdate)
				this.requestUpdate();
		},

		update: function() {
		},

		draw: function() {
			this.update();
		},

		requestUpdate: function() {
			if (!this._requested) {
				var that = this;
				DomEvent.requestAnimationFrame(function() {
					that._requested = false;
					if (that._animate) {
						that.requestUpdate();
						var element = that._element;
						if ((!DomElement.getPrefixed(document, 'hidden')
								|| PaperScope.getAttribute(element, 'keepalive')
									=== 'true') && DomElement.isInView(element)) {
							that._handleFrame();
						}
					}
					if (that._autoUpdate)
						that.update();
				});
				this._requested = true;
			}
		},

		play: function() {
			this._animate = true;
			this.requestUpdate();
		},

		pause: function() {
			this._animate = false;
		},

		_handleFrame: function() {
			paper = this._scope;
			var now = Date.now() / 1000,
				delta = this._last ? now - this._last : 0;
			this._last = now;
			this.emit('frame', new Base({
				delta: delta,
				time: this._time += delta,
				count: this._count++
			}));
			if (this._stats)
				this._stats.update();
		},

		_animateItem: function(item, animate) {
			var items = this._frameItems;
			if (animate) {
				items[item._id] = {
					item: item,
					time: 0,
					count: 0
				};
				if (++this._frameItemCount === 1)
					this.on('frame', this._handleFrameItems);
			} else {
				delete items[item._id];
				if (--this._frameItemCount === 0) {
					this.off('frame', this._handleFrameItems);
				}
			}
		},

		_handleFrameItems: function(event) {
			for (var i in this._frameItems) {
				var entry = this._frameItems[i];
				entry.item.emit('frame', new Base(event, {
					time: entry.time += event.delta,
					count: entry.count++
				}));
			}
		},

		_changed: function() {
			this._project._changed(2049);
			this._bounds = null;
		},

		getElement: function() {
			return this._element;
		},

		getPixelRatio: function() {
			return this._pixelRatio;
		},

		getResolution: function() {
			return this._pixelRatio * 72;
		},

		getViewSize: function() {
			var size = this._viewSize;
			return new LinkedSize(size.width, size.height, this, 'setViewSize');
		},

		setViewSize: function() {
			var size = Size.read(arguments),
				width = size.width,
				height = size.height,
				delta = size.subtract(this._viewSize);
			if (delta.isZero())
				return;
			this._setElementSize(width, height);
			this._viewSize.set(width, height);
			this.emit('resize', {
				size: size,
				delta: delta
			});
			this._changed();
			if (this._autoUpdate)
				this.requestUpdate();
		},

		_setElementSize: function(width, height) {
			var element = this._element;
			if (element) {
				if (element.width !== width)
					element.width = width;
				if (element.height !== height)
					element.height = height;
			}
		},

		getBounds: function() {
			if (!this._bounds)
				this._bounds = this._matrix.inverted()._transformBounds(
						new Rectangle(new Point(), this._viewSize));
			return this._bounds;
		},

		getSize: function() {
			return this.getBounds().getSize();
		},

		getCenter: function() {
			return this.getBounds().getCenter();
		},

		setCenter: function() {
			var center = Point.read(arguments);
			this.translate(this.getCenter().subtract(center));
		},

		getZoom: function() {
			return this._zoom;
		},

		setZoom: function(zoom) {
			this.transform(new Matrix().scale(zoom / this._zoom,
				this.getCenter()));
			this._zoom = zoom;
		},

		getMatrix: function() {
			return this._matrix;
		},

		setMatrix: function() {
			var matrix = this._matrix;
			matrix.initialize.apply(matrix, arguments);
		},

		isVisible: function() {
			return DomElement.isInView(this._element);
		},

		isInserted: function() {
			return DomElement.isInserted(this._element);
		},

		getPixelSize: function(size) {
			var element = this._element,
				pixels;
			if (element) {
				var parent = element.parentNode,
					temp = document.createElement('div');
				temp.style.fontSize = size;
				parent.appendChild(temp);
				pixels = parseFloat(DomElement.getStyles(temp).fontSize);
				parent.removeChild(temp);
			} else {
				pixels = parseFloat(pixels);
			}
			return pixels;
		},

		getTextWidth: function(font, lines) {
			return 0;
		}
	}, Base.each(['rotate', 'scale', 'shear', 'skew'], function(key) {
		var rotate = key === 'rotate';
		this[key] = function() {
			var value = (rotate ? Base : Point).read(arguments),
				center = Point.read(arguments, 0, { readNull: true });
			return this.transform(new Matrix()[key](value,
					center || this.getCenter(true)));
		};
	}, {
		translate: function() {
			var mx = new Matrix();
			return this.transform(mx.translate.apply(mx, arguments));
		},

		transform: function(matrix) {
			this._matrix.append(matrix);
		},

		scrollBy: function() {
			this.translate(Point.read(arguments).negate());
		}
	}), {

		projectToView: function() {
			return this._matrix._transformPoint(Point.read(arguments));
		},

		viewToProject: function() {
			return this._matrix._inverseTransform(Point.read(arguments));
		},

		getEventPoint: function(event) {
			return this.viewToProject(DomEvent.getOffset(event, this._element));
		},

	}, {
		statics: {
			_views: [],
			_viewsById: {},
			_id: 0,

			create: function(project, element) {
				if (document && typeof element === 'string')
					element = document.getElementById(element);
				var ctor = window ? CanvasView : View;
				return new ctor(project, element);
			}
		}
	},
	new function() {
		if (!window)
			return;
		var prevFocus,
			tempFocus,
			dragging = false,
			mouseDown = false;

		function getView(event) {
			var target = DomEvent.getTarget(event);
			return target.getAttribute && View._viewsById[
					target.getAttribute('id')];
		}

		function updateFocus() {
			var view = View._focused;
			if (!view || !view.isVisible()) {
				for (var i = 0, l = View._views.length; i < l; i++) {
					if ((view = View._views[i]).isVisible()) {
						View._focused = tempFocus = view;
						break;
					}
				}
			}
		}

		function handleMouseMove(view, event, point) {
			view._handleMouseEvent('mousemove', event, point);
		}

		var navigator = window.navigator,
			mousedown, mousemove, mouseup;
		if (navigator.pointerEnabled || navigator.msPointerEnabled) {
			mousedown = 'pointerdown MSPointerDown';
			mousemove = 'pointermove MSPointerMove';
			mouseup = 'pointerup pointercancel MSPointerUp MSPointerCancel';
		} else {
			mousedown = 'touchstart';
			mousemove = 'touchmove';
			mouseup = 'touchend touchcancel';
			if (!('ontouchstart' in window && navigator.userAgent.match(
					/mobile|tablet|ip(ad|hone|od)|android|silk/i))) {
				mousedown += ' mousedown';
				mousemove += ' mousemove';
				mouseup += ' mouseup';
			}
		}

		var viewEvents = {},
			docEvents = {
				mouseout: function(event) {
					var view = View._focused,
						target = DomEvent.getRelatedTarget(event);
					if (view && (!target || target.nodeName === 'HTML')) {
						var offset = DomEvent.getOffset(event, view._element),
							x = offset.x,
							abs = Math.abs,
							ax = abs(x),
							max = 1 << 25,
							diff = ax - max;
						offset.x = abs(diff) < ax ? diff * (x < 0 ? -1 : 1) : x;
						handleMouseMove(view, event, view.viewToProject(offset));
					}
				},

				scroll: updateFocus
			};

		viewEvents[mousedown] = function(event) {
			var view = View._focused = getView(event);
			if (!dragging) {
				dragging = true;
				view._handleMouseEvent('mousedown', event);
			}
		};

		docEvents[mousemove] = function(event) {
			var view = View._focused;
			if (!mouseDown) {
				var target = getView(event);
				if (target) {
					if (view !== target) {
						if (view)
							handleMouseMove(view, event);
						if (!prevFocus)
							prevFocus = view;
						view = View._focused = tempFocus = target;
					}
				} else if (tempFocus && tempFocus === view) {
					if (prevFocus && !prevFocus.isInserted())
						prevFocus = null;
					view = View._focused = prevFocus;
					prevFocus = null;
					updateFocus();
				}
			}
			if (view)
				handleMouseMove(view, event);
		};

		docEvents[mousedown] = function() {
			mouseDown = true;
		};

		docEvents[mouseup] = function(event) {
			var view = View._focused;
			if (view && dragging)
				view._handleMouseEvent('mouseup', event);
			mouseDown = dragging = false;
		};

		DomEvent.add(document, docEvents);

		DomEvent.add(window, {
			load: updateFocus
		});

		var called = false,
			prevented = false,
			fallbacks = {
				doubleclick: 'click',
				mousedrag: 'mousemove'
			},
			wasInView = false,
			overView,
			downPoint,
			lastPoint,
			downItem,
			overItem,
			dragItem,
			clickItem,
			clickTime,
			dblClick;

		function emitMouseEvent(obj, target, type, event, point, prevPoint,
				stopItem) {
			var stopped = false,
				mouseEvent;

			function emit(obj, type) {
				if (obj.responds(type)) {
					if (!mouseEvent) {
						mouseEvent = new MouseEvent(type, event, point,
								target || obj,
								prevPoint ? point.subtract(prevPoint) : null);
					}
					if (obj.emit(type, mouseEvent)) {
						called = true;
						if (mouseEvent.prevented)
							prevented = true;
						if (mouseEvent.stopped)
							return stopped = true;
					}
				} else {
					var fallback = fallbacks[type];
					if (fallback)
						return emit(obj, fallback);
				}
			}

			while (obj && obj !== stopItem) {
				if (emit(obj, type))
					break;
				obj = obj._parent;
			}
			return stopped;
		}

		function emitMouseEvents(view, hitItem, type, event, point, prevPoint) {
			view._project.removeOn(type);
			prevented = called = false;
			return (dragItem && emitMouseEvent(dragItem, null, type, event,
						point, prevPoint)
				|| hitItem && hitItem !== dragItem
					&& !hitItem.isDescendant(dragItem)
					&& emitMouseEvent(hitItem, null, fallbacks[type] || type, event,
						point, prevPoint, dragItem)
				|| emitMouseEvent(view, dragItem || hitItem || view, type, event,
						point, prevPoint));
		}

		var itemEventsMap = {
			mousedown: {
				mousedown: 1,
				mousedrag: 1,
				click: 1,
				doubleclick: 1
			},
			mouseup: {
				mouseup: 1,
				mousedrag: 1,
				click: 1,
				doubleclick: 1
			},
			mousemove: {
				mousedrag: 1,
				mousemove: 1,
				mouseenter: 1,
				mouseleave: 1
			}
		};

		return {
			_viewEvents: viewEvents,

			_handleMouseEvent: function(type, event, point) {
				var itemEvents = this._itemEvents,
					hitItems = itemEvents.native[type],
					nativeMove = type === 'mousemove',
					tool = this._scope.tool,
					view = this;

				function responds(type) {
					return itemEvents.virtual[type] || view.responds(type)
							|| tool && tool.responds(type);
				}

				if (nativeMove && dragging && responds('mousedrag'))
					type = 'mousedrag';
				if (!point)
					point = this.getEventPoint(event);

				var inView = this.getBounds().contains(point),
					hit = hitItems && inView && view._project.hitTest(point, {
						tolerance: 0,
						fill: true,
						stroke: true
					}),
					hitItem = hit && hit.item || null,
					handle = false,
					mouse = {};
				mouse[type.substr(5)] = true;

				if (hitItems && hitItem !== overItem) {
					if (overItem) {
						emitMouseEvent(overItem, null, 'mouseleave', event, point);
					}
					if (hitItem) {
						emitMouseEvent(hitItem, null, 'mouseenter', event, point);
					}
					overItem = hitItem;
				}
				if (wasInView ^ inView) {
					emitMouseEvent(this, null, inView ? 'mouseenter' : 'mouseleave',
							event, point);
					overView = inView ? this : null;
					handle = true;
				}
				if ((inView || mouse.drag) && !point.equals(lastPoint)) {
					emitMouseEvents(this, hitItem, nativeMove ? type : 'mousemove',
							event, point, lastPoint);
					handle = true;
				}
				wasInView = inView;
				if (mouse.down && inView || mouse.up && downPoint) {
					emitMouseEvents(this, hitItem, type, event, point, downPoint);
					if (mouse.down) {
						dblClick = hitItem === clickItem
							&& (Date.now() - clickTime < 300);
						downItem = clickItem = hitItem;
						dragItem = !prevented && hitItem;
						downPoint = point;
					} else if (mouse.up) {
						if (!prevented && hitItem === downItem) {
							clickTime = Date.now();
							emitMouseEvents(this, hitItem, dblClick ? 'doubleclick'
									: 'click', event, point, downPoint);
							dblClick = false;
						}
						downItem = dragItem = null;
					}
					wasInView = false;
					handle = true;
				}
				lastPoint = point;
				if (handle && tool) {
					called = tool._handleMouseEvent(type, event, point, mouse)
						|| called;
				}

				if (called && !mouse.move || mouse.down && responds('mouseup'))
					event.preventDefault();
			},

			_handleKeyEvent: function(type, event, key, character) {
				var scope = this._scope,
					tool = scope.tool,
					keyEvent;

				function emit(obj) {
					if (obj.responds(type)) {
						paper = scope;
						obj.emit(type, keyEvent = keyEvent
								|| new KeyEvent(type, event, key, character));
					}
				}

				if (this.isVisible()) {
					emit(this);
					if (tool && tool.responds(type))
						emit(tool);
				}
			},

			_countItemEvent: function(type, sign) {
				var itemEvents = this._itemEvents,
					native = itemEvents.native,
					virtual = itemEvents.virtual;
				for (var key in itemEventsMap) {
					native[key] = (native[key] || 0)
							+ (itemEventsMap[key][type] || 0) * sign;
				}
				virtual[type] = (virtual[type] || 0) + sign;
			},

			statics: {
				updateFocus: updateFocus
			}
		};
	});

	var CanvasView = View.extend({
		_class: 'CanvasView',

		initialize: function CanvasView(project, canvas) {
			if (!(canvas instanceof window.HTMLCanvasElement)) {
				var size = Size.read(arguments, 1);
				if (size.isZero())
					throw new Error(
							'Cannot create CanvasView with the provided argument: '
							+ [].slice.call(arguments, 1));
				canvas = CanvasProvider.getCanvas(size);
			}
			var ctx = this._context = canvas.getContext('2d');
			ctx.save();
			this._pixelRatio = 1;
			if (!/^off|false$/.test(PaperScope.getAttribute(canvas, 'hidpi'))) {
				var deviceRatio = window.devicePixelRatio || 1,
					backingStoreRatio = DomElement.getPrefixed(ctx,
							'backingStorePixelRatio') || 1;
				this._pixelRatio = deviceRatio / backingStoreRatio;
			}
			View.call(this, project, canvas);
			this._needsUpdate = true;
		},

		remove: function remove() {
			this._context.restore();
			return remove.base.call(this);
		},

		_setElementSize: function _setElementSize(width, height) {
			var pixelRatio = this._pixelRatio;
			_setElementSize.base.call(this, width * pixelRatio, height * pixelRatio);
			if (pixelRatio !== 1) {
				var element = this._element,
					ctx = this._context;
				if (!PaperScope.hasAttribute(element, 'resize')) {
					var style = element.style;
					style.width = width + 'px';
					style.height = height + 'px';
				}
				ctx.restore();
				ctx.save();
				ctx.scale(pixelRatio, pixelRatio);
			}
		},

		getPixelSize: function getPixelSize(size) {
			var agent = paper.agent,
				pixels;
			if (agent && agent.firefox) {
				pixels = getPixelSize.base.call(this, size);
			} else {
				var ctx = this._context,
					prevFont = ctx.font;
				ctx.font = size + ' serif';
				pixels = parseFloat(ctx.font);
				ctx.font = prevFont;
			}
			return pixels;
		},

		getTextWidth: function(font, lines) {
			var ctx = this._context,
				prevFont = ctx.font,
				width = 0;
			ctx.font = font;
			for (var i = 0, l = lines.length; i < l; i++)
				width = Math.max(width, ctx.measureText(lines[i]).width);
			ctx.font = prevFont;
			return width;
		},

		update: function() {
			if (!this._needsUpdate)
				return false;
			var project = this._project,
				ctx = this._context,
				size = this._viewSize;
			ctx.clearRect(0, 0, size.width + 1, size.height + 1);
			if (project)
				project.draw(ctx, this._matrix, this._pixelRatio);
			this._needsUpdate = false;
			return true;
		}
	});

	var Event = Base.extend({
		_class: 'Event',

		initialize: function Event(event) {
			this.event = event;
			this.type = event && event.type;
		},

		prevented: false,
		stopped: false,

		preventDefault: function() {
			this.prevented = true;
			this.event.preventDefault();
		},

		stopPropagation: function() {
			this.stopped = true;
			this.event.stopPropagation();
		},

		stop: function() {
			this.stopPropagation();
			this.preventDefault();
		},

		getTimeStamp: function() {
			return this.event.timeStamp;
		},

		getModifiers: function() {
			return Key.modifiers;
		}
	});

	var KeyEvent = Event.extend({
		_class: 'KeyEvent',

		initialize: function KeyEvent(type, event, key, character) {
			this.type = type;
			this.event = event;
			this.key = key;
			this.character = character;
		},

		toString: function() {
			return "{ type: '" + this.type
					+ "', key: '" + this.key
					+ "', character: '" + this.character
					+ "', modifiers: " + this.getModifiers()
					+ " }";
		}
	});

	var Key = new function() {
		var keyLookup = {
				'\t': 'tab',
				' ': 'space',
				'\b': 'backspace',
				'\x7f': 'delete',
				'Spacebar': 'space',
				'Del': 'delete',
				'Win': 'meta',
				'Esc': 'escape'
			},

			charLookup = {
				'tab': '\t',
				'space': ' ',
				'enter': '\r'
			},

			keyMap = {},
			charMap = {},
			metaFixMap,
			downKey,

			modifiers = new Base({
				shift: false,
				control: false,
				alt: false,
				meta: false,
				capsLock: false,
				space: false
			}).inject({
				option: {
					get: function() {
						return this.alt;
					}
				},

				command: {
					get: function() {
						var agent = paper && paper.agent;
						return agent && agent.mac ? this.meta : this.control;
					}
				}
			});

		function getKey(event) {
			var key = event.key || event.keyIdentifier;
			key = /^U\+/.test(key)
					? String.fromCharCode(parseInt(key.substr(2), 16))
					: /^Arrow[A-Z]/.test(key) ? key.substr(5)
					: key === 'Unidentified' ? String.fromCharCode(event.keyCode)
					: key;
			return keyLookup[key] ||
					(key.length > 1 ? Base.hyphenate(key) : key.toLowerCase());
		}

		function handleKey(down, key, character, event) {
			var type = down ? 'keydown' : 'keyup',
				view = View._focused,
				name;
			keyMap[key] = down;
			if (down) {
				charMap[key] = character;
			} else {
				delete charMap[key];
			}
			if (key.length > 1 && (name = Base.camelize(key)) in modifiers) {
				modifiers[name] = down;
				var agent = paper && paper.agent;
				if (name === 'meta' && agent && agent.mac) {
					if (down) {
						metaFixMap = {};
					} else {
						for (var k in metaFixMap) {
							if (k in charMap)
								handleKey(false, k, metaFixMap[k], event);
						}
						metaFixMap = null;
					}
				}
			} else if (down && metaFixMap) {
				metaFixMap[key] = character;
			}
			if (view) {
				view._handleKeyEvent(down ? 'keydown' : 'keyup', event, key,
						character);
			}
		}

		DomEvent.add(document, {
			keydown: function(event) {
				var key = getKey(event),
					agent = paper && paper.agent;
				if (key.length > 1 || agent && (agent.chrome && (event.altKey
							|| agent.mac && event.metaKey
							|| !agent.mac && event.ctrlKey))) {
					handleKey(true, key,
							charLookup[key] || (key.length > 1 ? '' : key), event);
				} else {
					downKey = key;
				}
			},

			keypress: function(event) {
				if (downKey) {
					var key = getKey(event),
						code = event.charCode,
						character = code >= 32 ? String.fromCharCode(code)
							: key.length > 1 ? '' : key;
					if (key !== downKey) {
						key = character.toLowerCase();
					}
					handleKey(true, key, character, event);
					downKey = null;
				}
			},

			keyup: function(event) {
				var key = getKey(event);
				if (key in charMap)
					handleKey(false, key, charMap[key], event);
			}
		});

		DomEvent.add(window, {
			blur: function(event) {
				for (var key in charMap)
					handleKey(false, key, charMap[key], event);
			}
		});

		return {
			modifiers: modifiers,

			isDown: function(key) {
				return !!keyMap[key];
			}
		};
	};

	var MouseEvent = Event.extend({
		_class: 'MouseEvent',

		initialize: function MouseEvent(type, event, point, target, delta) {
			this.type = type;
			this.event = event;
			this.point = point;
			this.target = target;
			this.delta = delta;
		},

		toString: function() {
			return "{ type: '" + this.type
					+ "', point: " + this.point
					+ ', target: ' + this.target
					+ (this.delta ? ', delta: ' + this.delta : '')
					+ ', modifiers: ' + this.getModifiers()
					+ ' }';
		}
	});

	var ToolEvent = Event.extend({
		_class: 'ToolEvent',
		_item: null,

		initialize: function ToolEvent(tool, type, event) {
			this.tool = tool;
			this.type = type;
			this.event = event;
		},

		_choosePoint: function(point, toolPoint) {
			return point ? point : toolPoint ? toolPoint.clone() : null;
		},

		getPoint: function() {
			return this._choosePoint(this._point, this.tool._point);
		},

		setPoint: function(point) {
			this._point = point;
		},

		getLastPoint: function() {
			return this._choosePoint(this._lastPoint, this.tool._lastPoint);
		},

		setLastPoint: function(lastPoint) {
			this._lastPoint = lastPoint;
		},

		getDownPoint: function() {
			return this._choosePoint(this._downPoint, this.tool._downPoint);
		},

		setDownPoint: function(downPoint) {
			this._downPoint = downPoint;
		},

		getMiddlePoint: function() {
			if (!this._middlePoint && this.tool._lastPoint) {
				return this.tool._point.add(this.tool._lastPoint).divide(2);
			}
			return this._middlePoint;
		},

		setMiddlePoint: function(middlePoint) {
			this._middlePoint = middlePoint;
		},

		getDelta: function() {
			return !this._delta && this.tool._lastPoint
					? this.tool._point.subtract(this.tool._lastPoint)
					: this._delta;
		},

		setDelta: function(delta) {
			this._delta = delta;
		},

		getCount: function() {
			return this.tool[/^mouse(down|up)$/.test(this.type)
					? '_downCount' : '_moveCount'];
		},

		setCount: function(count) {
			this.tool[/^mouse(down|up)$/.test(this.type) ? 'downCount' : 'count']
				= count;
		},

		getItem: function() {
			if (!this._item) {
				var result = this.tool._scope.project.hitTest(this.getPoint());
				if (result) {
					var item = result.item,
						parent = item._parent;
					while (/^(Group|CompoundPath)$/.test(parent._class)) {
						item = parent;
						parent = parent._parent;
					}
					this._item = item;
				}
			}
			return this._item;
		},

		setItem: function(item) {
			this._item = item;
		},

		toString: function() {
			return '{ type: ' + this.type
					+ ', point: ' + this.getPoint()
					+ ', count: ' + this.getCount()
					+ ', modifiers: ' + this.getModifiers()
					+ ' }';
		}
	});

	var Tool = PaperScopeItem.extend({
		_class: 'Tool',
		_list: 'tools',
		_reference: 'tool',
		_events: ['onMouseDown', 'onMouseUp', 'onMouseDrag', 'onMouseMove',
				'onActivate', 'onDeactivate', 'onEditOptions', 'onKeyDown',
				'onKeyUp'],

		initialize: function Tool(props) {
			PaperScopeItem.call(this);
			this._moveCount = -1;
			this._downCount = -1;
			this._set(props);
		},

		getMinDistance: function() {
			return this._minDistance;
		},

		setMinDistance: function(minDistance) {
			this._minDistance = minDistance;
			if (minDistance != null && this._maxDistance != null
					&& minDistance > this._maxDistance) {
				this._maxDistance = minDistance;
			}
		},

		getMaxDistance: function() {
			return this._maxDistance;
		},

		setMaxDistance: function(maxDistance) {
			this._maxDistance = maxDistance;
			if (this._minDistance != null && maxDistance != null
					&& maxDistance < this._minDistance) {
				this._minDistance = maxDistance;
			}
		},

		getFixedDistance: function() {
			return this._minDistance == this._maxDistance
				? this._minDistance : null;
		},

		setFixedDistance: function(distance) {
			this._minDistance = this._maxDistance = distance;
		},

		_handleMouseEvent: function(type, event, point, mouse) {
			paper = this._scope;
			if (mouse.drag && !this.responds(type))
				type = 'mousemove';
			var move = mouse.move || mouse.drag,
				responds = this.responds(type),
				minDistance = this.minDistance,
				maxDistance = this.maxDistance,
				called = false,
				tool = this;
			function update(minDistance, maxDistance) {
				var pt = point,
					toolPoint = move ? tool._point : (tool._downPoint || pt);
				if (move) {
					if (tool._moveCount && pt.equals(toolPoint)) {
						return false;
					}
					if (toolPoint && (minDistance != null || maxDistance != null)) {
						var vector = pt.subtract(toolPoint),
							distance = vector.getLength();
						if (distance < (minDistance || 0))
							return false;
						if (maxDistance) {
							pt = toolPoint.add(vector.normalize(
									Math.min(distance, maxDistance)));
						}
					}
					tool._moveCount++;
				}
				tool._point = pt;
				tool._lastPoint = toolPoint || pt;
				if (mouse.down) {
					tool._moveCount = -1;
					tool._downPoint = pt;
					tool._downCount++;
				}
				return true;
			}

			function emit() {
				if (responds) {
					called = tool.emit(type, new ToolEvent(tool, type, event))
							|| called;
				}
			}

			if (mouse.down) {
				update();
				emit();
			} else if (mouse.up) {
				update(null, maxDistance);
				emit();
			} else if (responds) {
				while (update(minDistance, maxDistance))
					emit();
			}
			return called;
		}

	});

	var Http = {
		request: function(options) {
			var xhr = new window.XMLHttpRequest();
			xhr.open((options.method || 'get').toUpperCase(), options.url,
					Base.pick(options.async, true));
			if (options.mimeType)
				xhr.overrideMimeType(options.mimeType);
			xhr.onload = function() {
				var status = xhr.status;
				if (status === 0 || status === 200) {
					if (options.onLoad) {
						options.onLoad.call(xhr, xhr.responseText);
					}
				} else {
					xhr.onerror();
				}
			};
			xhr.onerror = function() {
				var status = xhr.status,
					message = 'Could not load "' + options.url + '" (Status: '
							+ status + ')';
				if (options.onError) {
					options.onError(message, status);
				} else {
					throw new Error(message);
				}
			};
			return xhr.send(null);
		}
	};

	var CanvasProvider = {
		canvases: [],

		getCanvas: function(width, height) {
			if (!window)
				return null;
			var canvas,
				clear = true;
			if (typeof width === 'object') {
				height = width.height;
				width = width.width;
			}
			if (this.canvases.length) {
				canvas = this.canvases.pop();
			} else {
				canvas = document.createElement('canvas');
				clear = false;
			}
			var ctx = canvas.getContext('2d');
			if (!ctx) {
				throw new Error('Canvas ' + canvas +
						' is unable toprovide a 2D context.');
			}
			if (canvas.width === width && canvas.height === height) {
				if (clear)
					ctx.clearRect(0, 0, width + 1, height + 1);
			} else {
				canvas.width = width;
				canvas.height = height;
			}
			ctx.save();
			return canvas;
		},

		getContext: function(width, height) {
			var canvas = this.getCanvas(width, height);
			return canvas ? canvas.getContext('2d') : null;
		},

		release: function(obj) {
			var canvas = obj && obj.canvas ? obj.canvas : obj;
			if (canvas && canvas.getContext) {
				canvas.getContext('2d').restore();
				this.canvases.push(canvas);
			}
		}
	};

	var BlendMode = new function() {
		var min = Math.min,
			max = Math.max,
			abs = Math.abs,
			sr, sg, sb, sa,
			br, bg, bb, ba,
			dr, dg, db;

		function getLum(r, g, b) {
			return 0.2989 * r + 0.587 * g + 0.114 * b;
		}

		function setLum(r, g, b, l) {
			var d = l - getLum(r, g, b);
			dr = r + d;
			dg = g + d;
			db = b + d;
			var l = getLum(dr, dg, db),
				mn = min(dr, dg, db),
				mx = max(dr, dg, db);
			if (mn < 0) {
				var lmn = l - mn;
				dr = l + (dr - l) * l / lmn;
				dg = l + (dg - l) * l / lmn;
				db = l + (db - l) * l / lmn;
			}
			if (mx > 255) {
				var ln = 255 - l,
					mxl = mx - l;
				dr = l + (dr - l) * ln / mxl;
				dg = l + (dg - l) * ln / mxl;
				db = l + (db - l) * ln / mxl;
			}
		}

		function getSat(r, g, b) {
			return max(r, g, b) - min(r, g, b);
		}

		function setSat(r, g, b, s) {
			var col = [r, g, b],
				mx = max(r, g, b),
				mn = min(r, g, b),
				md;
			mn = mn === r ? 0 : mn === g ? 1 : 2;
			mx = mx === r ? 0 : mx === g ? 1 : 2;
			md = min(mn, mx) === 0 ? max(mn, mx) === 1 ? 2 : 1 : 0;
			if (col[mx] > col[mn]) {
				col[md] = (col[md] - col[mn]) * s / (col[mx] - col[mn]);
				col[mx] = s;
			} else {
				col[md] = col[mx] = 0;
			}
			col[mn] = 0;
			dr = col[0];
			dg = col[1];
			db = col[2];
		}

		var modes = {
			multiply: function() {
				dr = br * sr / 255;
				dg = bg * sg / 255;
				db = bb * sb / 255;
			},

			screen: function() {
				dr = br + sr - (br * sr / 255);
				dg = bg + sg - (bg * sg / 255);
				db = bb + sb - (bb * sb / 255);
			},

			overlay: function() {
				dr = br < 128 ? 2 * br * sr / 255 : 255 - 2 * (255 - br) * (255 - sr) / 255;
				dg = bg < 128 ? 2 * bg * sg / 255 : 255 - 2 * (255 - bg) * (255 - sg) / 255;
				db = bb < 128 ? 2 * bb * sb / 255 : 255 - 2 * (255 - bb) * (255 - sb) / 255;
			},

			'soft-light': function() {
				var t = sr * br / 255;
				dr = t + br * (255 - (255 - br) * (255 - sr) / 255 - t) / 255;
				t = sg * bg / 255;
				dg = t + bg * (255 - (255 - bg) * (255 - sg) / 255 - t) / 255;
				t = sb * bb / 255;
				db = t + bb * (255 - (255 - bb) * (255 - sb) / 255 - t) / 255;
			},

			'hard-light': function() {
				dr = sr < 128 ? 2 * sr * br / 255 : 255 - 2 * (255 - sr) * (255 - br) / 255;
				dg = sg < 128 ? 2 * sg * bg / 255 : 255 - 2 * (255 - sg) * (255 - bg) / 255;
				db = sb < 128 ? 2 * sb * bb / 255 : 255 - 2 * (255 - sb) * (255 - bb) / 255;
			},

			'color-dodge': function() {
				dr = br === 0 ? 0 : sr === 255 ? 255 : min(255, 255 * br / (255 - sr));
				dg = bg === 0 ? 0 : sg === 255 ? 255 : min(255, 255 * bg / (255 - sg));
				db = bb === 0 ? 0 : sb === 255 ? 255 : min(255, 255 * bb / (255 - sb));
			},

			'color-burn': function() {
				dr = br === 255 ? 255 : sr === 0 ? 0 : max(0, 255 - (255 - br) * 255 / sr);
				dg = bg === 255 ? 255 : sg === 0 ? 0 : max(0, 255 - (255 - bg) * 255 / sg);
				db = bb === 255 ? 255 : sb === 0 ? 0 : max(0, 255 - (255 - bb) * 255 / sb);
			},

			darken: function() {
				dr = br < sr ? br : sr;
				dg = bg < sg ? bg : sg;
				db = bb < sb ? bb : sb;
			},

			lighten: function() {
				dr = br > sr ? br : sr;
				dg = bg > sg ? bg : sg;
				db = bb > sb ? bb : sb;
			},

			difference: function() {
				dr = br - sr;
				if (dr < 0)
					dr = -dr;
				dg = bg - sg;
				if (dg < 0)
					dg = -dg;
				db = bb - sb;
				if (db < 0)
					db = -db;
			},

			exclusion: function() {
				dr = br + sr * (255 - br - br) / 255;
				dg = bg + sg * (255 - bg - bg) / 255;
				db = bb + sb * (255 - bb - bb) / 255;
			},

			hue: function() {
				setSat(sr, sg, sb, getSat(br, bg, bb));
				setLum(dr, dg, db, getLum(br, bg, bb));
			},

			saturation: function() {
				setSat(br, bg, bb, getSat(sr, sg, sb));
				setLum(dr, dg, db, getLum(br, bg, bb));
			},

			luminosity: function() {
				setLum(br, bg, bb, getLum(sr, sg, sb));
			},

			color: function() {
				setLum(sr, sg, sb, getLum(br, bg, bb));
			},

			add: function() {
				dr = min(br + sr, 255);
				dg = min(bg + sg, 255);
				db = min(bb + sb, 255);
			},

			subtract: function() {
				dr = max(br - sr, 0);
				dg = max(bg - sg, 0);
				db = max(bb - sb, 0);
			},

			average: function() {
				dr = (br + sr) / 2;
				dg = (bg + sg) / 2;
				db = (bb + sb) / 2;
			},

			negation: function() {
				dr = 255 - abs(255 - sr - br);
				dg = 255 - abs(255 - sg - bg);
				db = 255 - abs(255 - sb - bb);
			}
		};

		var nativeModes = this.nativeModes = Base.each([
			'source-over', 'source-in', 'source-out', 'source-atop',
			'destination-over', 'destination-in', 'destination-out',
			'destination-atop', 'lighter', 'darker', 'copy', 'xor'
		], function(mode) {
			this[mode] = true;
		}, {});

		var ctx = CanvasProvider.getContext(1, 1);
		if (ctx) {
			Base.each(modes, function(func, mode) {
				var darken = mode === 'darken',
					ok = false;
				ctx.save();
				try {
					ctx.fillStyle = darken ? '#300' : '#a00';
					ctx.fillRect(0, 0, 1, 1);
					ctx.globalCompositeOperation = mode;
					if (ctx.globalCompositeOperation === mode) {
						ctx.fillStyle = darken ? '#a00' : '#300';
						ctx.fillRect(0, 0, 1, 1);
						ok = ctx.getImageData(0, 0, 1, 1).data[0] !== darken
								? 170 : 51;
					}
				} catch (e) {}
				ctx.restore();
				nativeModes[mode] = ok;
			});
			CanvasProvider.release(ctx);
		}

		this.process = function(mode, srcContext, dstContext, alpha, offset) {
			var srcCanvas = srcContext.canvas,
				normal = mode === 'normal';
			if (normal || nativeModes[mode]) {
				dstContext.save();
				dstContext.setTransform(1, 0, 0, 1, 0, 0);
				dstContext.globalAlpha = alpha;
				if (!normal)
					dstContext.globalCompositeOperation = mode;
				dstContext.drawImage(srcCanvas, offset.x, offset.y);
				dstContext.restore();
			} else {
				var process = modes[mode];
				if (!process)
					return;
				var dstData = dstContext.getImageData(offset.x, offset.y,
						srcCanvas.width, srcCanvas.height),
					dst = dstData.data,
					src = srcContext.getImageData(0, 0,
						srcCanvas.width, srcCanvas.height).data;
				for (var i = 0, l = dst.length; i < l; i += 4) {
					sr = src[i];
					br = dst[i];
					sg = src[i + 1];
					bg = dst[i + 1];
					sb = src[i + 2];
					bb = dst[i + 2];
					sa = src[i + 3];
					ba = dst[i + 3];
					process();
					var a1 = sa * alpha / 255,
						a2 = 1 - a1;
					dst[i] = a1 * dr + a2 * br;
					dst[i + 1] = a1 * dg + a2 * bg;
					dst[i + 2] = a1 * db + a2 * bb;
					dst[i + 3] = sa * alpha + a2 * ba;
				}
				dstContext.putImageData(dstData, offset.x, offset.y);
			}
		};
	};

	var SvgElement = new function() {
		var svg = 'http://www.w3.org/2000/svg',
			xmlns = 'http://www.w3.org/2000/xmlns',
			xlink = 'http://www.w3.org/1999/xlink',
			attributeNamespace = {
				href: xlink,
				xlink: xmlns,
				xmlns: xmlns + '/',
				'xmlns:xlink': xmlns + '/'
			};

		function create(tag, attributes, formatter) {
			return set(document.createElementNS(svg, tag), attributes, formatter);
		}

		function get(node, name) {
			var namespace = attributeNamespace[name],
				value = namespace
					? node.getAttributeNS(namespace, name)
					: node.getAttribute(name);
			return value === 'null' ? null : value;
		}

		function set(node, attributes, formatter) {
			for (var name in attributes) {
				var value = attributes[name],
					namespace = attributeNamespace[name];
				if (typeof value === 'number' && formatter)
					value = formatter.number(value);
				if (namespace) {
					node.setAttributeNS(namespace, name, value);
				} else {
					node.setAttribute(name, value);
				}
			}
			return node;
		}

		return {
			svg: svg,
			xmlns: xmlns,
			xlink: xlink,

			create: create,
			get: get,
			set: set
		};
	};

	var SvgStyles = Base.each({
		fillColor: ['fill', 'color'],
		fillRule: ['fill-rule', 'string'],
		strokeColor: ['stroke', 'color'],
		strokeWidth: ['stroke-width', 'number'],
		strokeCap: ['stroke-linecap', 'string'],
		strokeJoin: ['stroke-linejoin', 'string'],
		strokeScaling: ['vector-effect', 'lookup', {
			true: 'none',
			false: 'non-scaling-stroke'
		}, function(item, value) {
			return !value
					&& (item instanceof PathItem
						|| item instanceof Shape
						|| item instanceof TextItem);
		}],
		miterLimit: ['stroke-miterlimit', 'number'],
		dashArray: ['stroke-dasharray', 'array'],
		dashOffset: ['stroke-dashoffset', 'number'],
		fontFamily: ['font-family', 'string'],
		fontWeight: ['font-weight', 'string'],
		fontSize: ['font-size', 'number'],
		justification: ['text-anchor', 'lookup', {
			left: 'start',
			center: 'middle',
			right: 'end'
		}],
		opacity: ['opacity', 'number'],
		blendMode: ['mix-blend-mode', 'style']
	}, function(entry, key) {
		var part = Base.capitalize(key),
			lookup = entry[2];
		this[key] = {
			type: entry[1],
			property: key,
			attribute: entry[0],
			toSVG: lookup,
			fromSVG: lookup && Base.each(lookup, function(value, name) {
				this[value] = name;
			}, {}),
			exportFilter: entry[3],
			get: 'get' + part,
			set: 'set' + part
		};
	}, {});

	new function() {
		var formatter;

		function getTransform(matrix, coordinates, center) {
			var attrs = new Base(),
				trans = matrix.getTranslation();
			if (coordinates) {
				matrix = matrix._shiftless();
				var point = matrix._inverseTransform(trans);
				attrs[center ? 'cx' : 'x'] = point.x;
				attrs[center ? 'cy' : 'y'] = point.y;
				trans = null;
			}
			if (!matrix.isIdentity()) {
				var decomposed = matrix.decompose();
				if (decomposed) {
					var parts = [],
						angle = decomposed.rotation,
						scale = decomposed.scaling,
						skew = decomposed.skewing;
					if (trans && !trans.isZero())
						parts.push('translate(' + formatter.point(trans) + ')');
					if (angle)
						parts.push('rotate(' + formatter.number(angle) + ')');
					if (!Numerical.isZero(scale.x - 1)
							|| !Numerical.isZero(scale.y - 1))
						parts.push('scale(' + formatter.point(scale) +')');
					if (skew && skew.x)
						parts.push('skewX(' + formatter.number(skew.x) + ')');
					if (skew && skew.y)
						parts.push('skewY(' + formatter.number(skew.y) + ')');
					attrs.transform = parts.join(' ');
				} else {
					attrs.transform = 'matrix(' + matrix.getValues().join(',') + ')';
				}
			}
			return attrs;
		}

		function exportGroup(item, options) {
			var attrs = getTransform(item._matrix),
				children = item._children;
			var node = SvgElement.create('g', attrs, formatter);
			for (var i = 0, l = children.length; i < l; i++) {
				var child = children[i];
				var childNode = exportSVG(child, options);
				if (childNode) {
					if (child.isClipMask()) {
						var clip = SvgElement.create('clipPath');
						clip.appendChild(childNode);
						setDefinition(child, clip, 'clip');
						SvgElement.set(node, {
							'clip-path': 'url(#' + clip.id + ')'
						});
					} else {
						node.appendChild(childNode);
					}
				}
			}
			return node;
		}

		function exportRaster(item, options) {
			var attrs = getTransform(item._matrix, true),
				size = item.getSize(),
				image = item.getImage();
			attrs.x -= size.width / 2;
			attrs.y -= size.height / 2;
			attrs.width = size.width;
			attrs.height = size.height;
			attrs.href = options.embedImages === false && image && image.src
					|| item.toDataURL();
			return SvgElement.create('image', attrs, formatter);
		}

		function exportPath(item, options) {
			var matchShapes = options.matchShapes;
			if (matchShapes) {
				var shape = item.toShape(false);
				if (shape)
					return exportShape(shape, options);
			}
			var segments = item._segments,
				length = segments.length,
				type,
				attrs = getTransform(item._matrix);
			if (matchShapes && length >= 2 && !item.hasHandles()) {
				if (length > 2) {
					type = item._closed ? 'polygon' : 'polyline';
					var parts = [];
					for(var i = 0; i < length; i++)
						parts.push(formatter.point(segments[i]._point));
					attrs.points = parts.join(' ');
				} else {
					type = 'line';
					var start = segments[0]._point,
						end = segments[1]._point;
					attrs.set({
						x1: start.x,
						y1: start.y,
						x2: end.x,
						y2: end.y
					});
				}
			} else {
				type = 'path';
				attrs.d = item.getPathData(null, options.precision);
			}
			return SvgElement.create(type, attrs, formatter);
		}

		function exportShape(item) {
			var type = item._type,
				radius = item._radius,
				attrs = getTransform(item._matrix, true, type !== 'rectangle');
			if (type === 'rectangle') {
				type = 'rect';
				var size = item._size,
					width = size.width,
					height = size.height;
				attrs.x -= width / 2;
				attrs.y -= height / 2;
				attrs.width = width;
				attrs.height = height;
				if (radius.isZero())
					radius = null;
			}
			if (radius) {
				if (type === 'circle') {
					attrs.r = radius;
				} else {
					attrs.rx = radius.width;
					attrs.ry = radius.height;
				}
			}
			return SvgElement.create(type, attrs, formatter);
		}

		function exportCompoundPath(item, options) {
			var attrs = getTransform(item._matrix);
			var data = item.getPathData(null, options.precision);
			if (data)
				attrs.d = data;
			return SvgElement.create('path', attrs, formatter);
		}

		function exportSymbolItem(item, options) {
			var attrs = getTransform(item._matrix, true),
				definition = item._definition,
				node = getDefinition(definition, 'symbol'),
				definitionItem = definition._item,
				bounds = definitionItem.getBounds();
			if (!node) {
				node = SvgElement.create('symbol', {
					viewBox: formatter.rectangle(bounds)
				});
				node.appendChild(exportSVG(definitionItem, options));
				setDefinition(definition, node, 'symbol');
			}
			attrs.href = '#' + node.id;
			attrs.x += bounds.x;
			attrs.y += bounds.y;
			attrs.width = bounds.width;
			attrs.height = bounds.height;
			attrs.overflow = 'visible';
			return SvgElement.create('use', attrs, formatter);
		}

		function exportGradient(color) {
			var gradientNode = getDefinition(color, 'color');
			if (!gradientNode) {
				var gradient = color.getGradient(),
					radial = gradient._radial,
					origin = color.getOrigin(),
					destination = color.getDestination(),
					attrs;
				if (radial) {
					attrs = {
						cx: origin.x,
						cy: origin.y,
						r: origin.getDistance(destination)
					};
					var highlight = color.getHighlight();
					if (highlight) {
						attrs.fx = highlight.x;
						attrs.fy = highlight.y;
					}
				} else {
					attrs = {
						x1: origin.x,
						y1: origin.y,
						x2: destination.x,
						y2: destination.y
					};
				}
				attrs.gradientUnits = 'userSpaceOnUse';
				gradientNode = SvgElement.create((radial ? 'radial' : 'linear')
						+ 'Gradient', attrs, formatter);
				var stops = gradient._stops;
				for (var i = 0, l = stops.length; i < l; i++) {
					var stop = stops[i],
						stopColor = stop._color,
						alpha = stopColor.getAlpha();
					attrs = {
						offset: stop._offset || i / (l - 1)
					};
					if (stopColor)
						attrs['stop-color'] = stopColor.toCSS(true);
					if (alpha < 1)
						attrs['stop-opacity'] = alpha;
					gradientNode.appendChild(
							SvgElement.create('stop', attrs, formatter));
				}
				setDefinition(color, gradientNode, 'color');
			}
			return 'url(#' + gradientNode.id + ')';
		}

		function exportText(item) {
			var node = SvgElement.create('text', getTransform(item._matrix, true),
					formatter);
			node.textContent = item._content;
			return node;
		}

		var exporters = {
			Group: exportGroup,
			Layer: exportGroup,
			Raster: exportRaster,
			Path: exportPath,
			Shape: exportShape,
			CompoundPath: exportCompoundPath,
			SymbolItem: exportSymbolItem,
			PointText: exportText
		};

		function applyStyle(item, node, isRoot) {
			var attrs = {},
				parent = !isRoot && item.getParent(),
				style = [];

			if (item._name != null)
				attrs.id = item._name;

			Base.each(SvgStyles, function(entry) {
				var get = entry.get,
					type = entry.type,
					value = item[get]();
				if (entry.exportFilter
						? entry.exportFilter(item, value)
						: !parent || !Base.equals(parent[get](), value)) {
					if (type === 'color' && value != null) {
						var alpha = value.getAlpha();
						if (alpha < 1)
							attrs[entry.attribute + '-opacity'] = alpha;
					}
					if (type === 'style') {
						style.push(entry.attribute + ': ' + value);
					} else {
						attrs[entry.attribute] = value == null ? 'none'
								: type === 'color' ? value.gradient
									? exportGradient(value, item)
									: value.toCSS(true)
								: type === 'array' ? value.join(',')
								: type === 'lookup' ? entry.toSVG[value]
								: value;
					}
				}
			});

			if (style.length)
				attrs.style = style.join(';');

			if (attrs.opacity === 1)
				delete attrs.opacity;

			if (!item._visible)
				attrs.visibility = 'hidden';

			return SvgElement.set(node, attrs, formatter);
		}

		var definitions;
		function getDefinition(item, type) {
			if (!definitions)
				definitions = { ids: {}, svgs: {} };
			var id = item._id || item.__id || (item.__id = UID.get('svg'));
			return item && definitions.svgs[type + '-' + id];
		}

		function setDefinition(item, node, type) {
			if (!definitions)
				getDefinition();
			var typeId = definitions.ids[type] = (definitions.ids[type] || 0) + 1;
			node.id = type + '-' + typeId;
			definitions.svgs[type + '-' + (item._id || item.__id)] = node;
		}

		function exportDefinitions(node, options) {
			var svg = node,
				defs = null;
			if (definitions) {
				svg = node.nodeName.toLowerCase() === 'svg' && node;
				for (var i in definitions.svgs) {
					if (!defs) {
						if (!svg) {
							svg = SvgElement.create('svg');
							svg.appendChild(node);
						}
						defs = svg.insertBefore(SvgElement.create('defs'),
								svg.firstChild);
					}
					defs.appendChild(definitions.svgs[i]);
				}
				definitions = null;
			}
			return options.asString
					? new window.XMLSerializer().serializeToString(svg)
					: svg;
		}

		function exportSVG(item, options, isRoot) {
			var exporter = exporters[item._class],
				node = exporter && exporter(item, options);
			if (node) {
				var onExport = options.onExport;
				if (onExport)
					node = onExport(item, node, options) || node;
				var data = JSON.stringify(item._data);
				if (data && data !== '{}' && data !== 'null')
					node.setAttribute('data-paper-data', data);
			}
			return node && applyStyle(item, node, isRoot);
		}

		function setOptions(options) {
			if (!options)
				options = {};
			formatter = new Formatter(options.precision);
			return options;
		}

		Item.inject({
			exportSVG: function(options) {
				options = setOptions(options);
				return exportDefinitions(exportSVG(this, options, true), options);
			}
		});

		Project.inject({
			exportSVG: function(options) {
				options = setOptions(options);
				var children = this._children,
					view = this.getView(),
					bounds = Base.pick(options.bounds, 'view'),
					mx = options.matrix || bounds === 'view' && view._matrix,
					matrix = mx && Matrix.read([mx]),
					rect = bounds === 'view'
						? new Rectangle([0, 0], view.getViewSize())
						: bounds === 'content'
							? Item._getBounds(children, matrix, { stroke: true })
							: Rectangle.read([bounds], 0, { readNull: true }),
					attrs = {
						version: '1.1',
						xmlns: SvgElement.svg,
						'xmlns:xlink': SvgElement.xlink,
					};
				if (rect) {
					attrs.width = rect.width;
					attrs.height = rect.height;
					if (rect.x || rect.y)
						attrs.viewBox = formatter.rectangle(rect);
				}
				var node = SvgElement.create('svg', attrs, formatter),
					parent = node;
				if (matrix && !matrix.isIdentity()) {
					parent = node.appendChild(SvgElement.create('g',
							getTransform(matrix), formatter));
				}
				for (var i = 0, l = children.length; i < l; i++) {
					parent.appendChild(exportSVG(children[i], options, true));
				}
				return exportDefinitions(node, options);
			}
		});
	};

	new function() {

		var definitions = {},
			rootSize;

		function getValue(node, name, isString, allowNull, allowPercent) {
			var value = SvgElement.get(node, name),
				res = value == null
					? allowNull
						? null
						: isString ? '' : 0
					: isString
						? value
						: parseFloat(value);
			return /%\s*$/.test(value)
				? (res / 100) * (allowPercent ? 1
					: rootSize[/x|^width/.test(name) ? 'width' : 'height'])
				: res;
		}

		function getPoint(node, x, y, allowNull, allowPercent) {
			x = getValue(node, x || 'x', false, allowNull, allowPercent);
			y = getValue(node, y || 'y', false, allowNull, allowPercent);
			return allowNull && (x == null || y == null) ? null
					: new Point(x, y);
		}

		function getSize(node, w, h, allowNull, allowPercent) {
			w = getValue(node, w || 'width', false, allowNull, allowPercent);
			h = getValue(node, h || 'height', false, allowNull, allowPercent);
			return allowNull && (w == null || h == null) ? null
					: new Size(w, h);
		}

		function convertValue(value, type, lookup) {
			return value === 'none' ? null
					: type === 'number' ? parseFloat(value)
					: type === 'array' ?
						value ? value.split(/[\s,]+/g).map(parseFloat) : []
					: type === 'color' ? getDefinition(value) || value
					: type === 'lookup' ? lookup[value]
					: value;
		}

		function importGroup(node, type, options, isRoot) {
			var nodes = node.childNodes,
				isClip = type === 'clippath',
				isDefs = type === 'defs',
				item = new Group(),
				project = item._project,
				currentStyle = project._currentStyle,
				children = [];
			if (!isClip && !isDefs) {
				item = applyAttributes(item, node, isRoot);
				project._currentStyle = item._style.clone();
			}
			if (isRoot) {
				var defs = node.querySelectorAll('defs');
				for (var i = 0, l = defs.length; i < l; i++) {
					importNode(defs[i], options, false);
				}
			}
			for (var i = 0, l = nodes.length; i < l; i++) {
				var childNode = nodes[i],
					child;
				if (childNode.nodeType === 1
						&& !/^defs$/i.test(childNode.nodeName)
						&& (child = importNode(childNode, options, false))
						&& !(child instanceof SymbolDefinition))
					children.push(child);
			}
			item.addChildren(children);
			if (isClip)
				item = applyAttributes(item.reduce(), node, isRoot);
			project._currentStyle = currentStyle;
			if (isClip || isDefs) {
				item.remove();
				item = null;
			}
			return item;
		}

		function importPoly(node, type) {
			var coords = node.getAttribute('points').match(
						/[+-]?(?:\d*\.\d+|\d+\.?)(?:[eE][+-]?\d+)?/g),
				points = [];
			for (var i = 0, l = coords.length; i < l; i += 2)
				points.push(new Point(
						parseFloat(coords[i]),
						parseFloat(coords[i + 1])));
			var path = new Path(points);
			if (type === 'polygon')
				path.closePath();
			return path;
		}

		function importPath(node) {
			return PathItem.create(node.getAttribute('d'));
		}

		function importGradient(node, type) {
			var id = (getValue(node, 'href', true) || '').substring(1),
				radial = type === 'radialgradient',
				gradient;
			if (id) {
				gradient = definitions[id].getGradient();
				if (gradient._radial ^ radial) {
					gradient = gradient.clone();
					gradient._radial = radial;
				}
			} else {
				var nodes = node.childNodes,
					stops = [];
				for (var i = 0, l = nodes.length; i < l; i++) {
					var child = nodes[i];
					if (child.nodeType === 1)
						stops.push(applyAttributes(new GradientStop(), child));
				}
				gradient = new Gradient(stops, radial);
			}
			var origin, destination, highlight,
				scaleToBounds = getValue(node, 'gradientUnits', true) !==
					'userSpaceOnUse';
			if (radial) {
				origin = getPoint(node, 'cx', 'cy', false, scaleToBounds);
				destination = origin.add(
						getValue(node, 'r', false, false, scaleToBounds), 0);
				highlight = getPoint(node, 'fx', 'fy', true, scaleToBounds);
			} else {
				origin = getPoint(node, 'x1', 'y1', false, scaleToBounds);
				destination = getPoint(node, 'x2', 'y2', false, scaleToBounds);
			}
			var color = applyAttributes(
					new Color(gradient, origin, destination, highlight), node);
			color._scaleToBounds = scaleToBounds;
			return null;
		}

		var importers = {
			'#document': function (node, type, options, isRoot) {
				var nodes = node.childNodes;
				for (var i = 0, l = nodes.length; i < l; i++) {
					var child = nodes[i];
					if (child.nodeType === 1)
						return importNode(child, options, isRoot);
				}
			},
			g: importGroup,
			svg: importGroup,
			clippath: importGroup,
			polygon: importPoly,
			polyline: importPoly,
			path: importPath,
			lineargradient: importGradient,
			radialgradient: importGradient,

			image: function (node) {
				var raster = new Raster(getValue(node, 'href', true));
				raster.on('load', function() {
					var size = getSize(node);
					this.setSize(size);
					var center = this._matrix._transformPoint(
							getPoint(node).add(size.divide(2)));
					this.translate(center);
				});
				return raster;
			},

			symbol: function(node, type, options, isRoot) {
				return new SymbolDefinition(
						importGroup(node, type, options, isRoot), true);
			},

			defs: importGroup,

			use: function(node) {
				var id = (getValue(node, 'href', true) || '').substring(1),
					definition = definitions[id],
					point = getPoint(node);
				return definition
						? definition instanceof SymbolDefinition
							? definition.place(point)
							: definition.clone().translate(point)
						: null;
			},

			circle: function(node) {
				return new Shape.Circle(
						getPoint(node, 'cx', 'cy'),
						getValue(node, 'r'));
			},

			ellipse: function(node) {
				return new Shape.Ellipse({
					center: getPoint(node, 'cx', 'cy'),
					radius: getSize(node, 'rx', 'ry')
				});
			},

			rect: function(node) {
				return new Shape.Rectangle(new Rectangle(
							getPoint(node),
							getSize(node)
						), getSize(node, 'rx', 'ry'));
				},

			line: function(node) {
				return new Path.Line(
						getPoint(node, 'x1', 'y1'),
						getPoint(node, 'x2', 'y2'));
			},

			text: function(node) {
				var text = new PointText(getPoint(node).add(
						getPoint(node, 'dx', 'dy')));
				text.setContent(node.textContent.trim() || '');
				return text;
			}
		};

		function applyTransform(item, value, name, node) {
			if (item.transform) {
				var transforms = (node.getAttribute(name) || '').split(/\)\s*/g),
					matrix = new Matrix();
				for (var i = 0, l = transforms.length; i < l; i++) {
					var transform = transforms[i];
					if (!transform)
						break;
					var parts = transform.split(/\(\s*/),
						command = parts[0],
						v = parts[1].split(/[\s,]+/g);
					for (var j = 0, m = v.length; j < m; j++)
						v[j] = parseFloat(v[j]);
					switch (command) {
					case 'matrix':
						matrix.append(
								new Matrix(v[0], v[1], v[2], v[3], v[4], v[5]));
						break;
					case 'rotate':
						matrix.rotate(v[0], v[1], v[2]);
						break;
					case 'translate':
						matrix.translate(v[0], v[1]);
						break;
					case 'scale':
						matrix.scale(v);
						break;
					case 'skewX':
						matrix.skew(v[0], 0);
						break;
					case 'skewY':
						matrix.skew(0, v[0]);
						break;
					}
				}
				item.transform(matrix);
			}
		}

		function applyOpacity(item, value, name) {
			var key = name === 'fill-opacity' ? 'getFillColor' : 'getStrokeColor',
				color = item[key] && item[key]();
			if (color)
				color.setAlpha(parseFloat(value));
		}

		var attributes = Base.set(Base.each(SvgStyles, function(entry) {
			this[entry.attribute] = function(item, value) {
				if (item[entry.set]) {
					item[entry.set](convertValue(value, entry.type, entry.fromSVG));
					if (entry.type === 'color') {
						var color = item[entry.get]();
						if (color) {
							if (color._scaleToBounds) {
								var bounds = item.getBounds();
								color.transform(new Matrix()
									.translate(bounds.getPoint())
									.scale(bounds.getSize()));
							}
							if (item instanceof Shape) {
								color.transform(new Matrix().translate(
									item.getPosition(true).negate()));
							}
						}
					}
				}
			};
		}, {}), {
			id: function(item, value) {
				definitions[value] = item;
				if (item.setName)
					item.setName(value);
			},

			'clip-path': function(item, value) {
				var clip = getDefinition(value);
				if (clip) {
					clip = clip.clone();
					clip.setClipMask(true);
					if (item instanceof Group) {
						item.insertChild(0, clip);
					} else {
						return new Group(clip, item);
					}
				}
			},

			gradientTransform: applyTransform,
			transform: applyTransform,

			'fill-opacity': applyOpacity,
			'stroke-opacity': applyOpacity,

			visibility: function(item, value) {
				if (item.setVisible)
					item.setVisible(value === 'visible');
			},

			display: function(item, value) {
				if (item.setVisible)
					item.setVisible(value !== null);
			},

			'stop-color': function(item, value) {
				if (item.setColor)
					item.setColor(value);
			},

			'stop-opacity': function(item, value) {
				if (item._color)
					item._color.setAlpha(parseFloat(value));
			},

			offset: function(item, value) {
				if (item.setOffset) {
					var percent = value.match(/(.*)%$/);
					item.setOffset(percent ? percent[1] / 100 : parseFloat(value));
				}
			},

			viewBox: function(item, value, name, node, styles) {
				var rect = new Rectangle(convertValue(value, 'array')),
					size = getSize(node, null, null, true),
					group,
					matrix;
				if (item instanceof Group) {
					var scale = size ? size.divide(rect.getSize()) : 1,
					matrix = new Matrix().scale(scale)
							.translate(rect.getPoint().negate());
					group = item;
				} else if (item instanceof SymbolDefinition) {
					if (size)
						rect.setSize(size);
					group = item._item;
				}
				if (group)  {
					if (getAttribute(node, 'overflow', styles) !== 'visible') {
						var clip = new Shape.Rectangle(rect);
						clip.setClipMask(true);
						group.addChild(clip);
					}
					if (matrix)
						group.transform(matrix);
				}
			}
		});

		function getAttribute(node, name, styles) {
			var attr = node.attributes[name],
				value = attr && attr.value;
			if (!value) {
				var style = Base.camelize(name);
				value = node.style[style];
				if (!value && styles.node[style] !== styles.parent[style])
					value = styles.node[style];
			}
			return !value ? undefined
					: value === 'none' ? null
					: value;
		}

		function applyAttributes(item, node, isRoot) {
			var parent = node.parentNode,
				styles = {
					node: DomElement.getStyles(node) || {},
					parent: !isRoot && !/^defs$/i.test(parent.tagName)
							&& DomElement.getStyles(parent) || {}
				};
			Base.each(attributes, function(apply, name) {
				var value = getAttribute(node, name, styles);
				item = value !== undefined && apply(item, value, name, node, styles)
						|| item;
			});
			return item;
		}

		function getDefinition(value) {
			var match = value && value.match(/\((?:["'#]*)([^"')]+)/),
				res = match && definitions[match[1]
					.replace(window.location.href.split('#')[0] + '#', '')];
			if (res && res._scaleToBounds) {
				res = res.clone();
				res._scaleToBounds = true;
			}
			return res;
		}

		function importNode(node, options, isRoot) {
			var type = node.nodeName.toLowerCase(),
				isElement = type !== '#document',
				body = document.body,
				container,
				parent,
				next;
			if (isRoot && isElement) {
				rootSize = getSize(node, null, null, true)
						|| paper.getView().getSize();
				container = SvgElement.create('svg', {
					style: 'stroke-width: 1px; stroke-miterlimit: 10'
				});
				parent = node.parentNode;
				next = node.nextSibling;
				container.appendChild(node);
				body.appendChild(container);
			}
			var settings = paper.settings,
				applyMatrix = settings.applyMatrix,
				insertItems = settings.insertItems;
			settings.applyMatrix = false;
			settings.insertItems = false;
			var importer = importers[type],
				item = importer && importer(node, type, options, isRoot) || null;
			settings.insertItems = insertItems;
			settings.applyMatrix = applyMatrix;
			if (item) {
				if (isElement && !(item instanceof Group))
					item = applyAttributes(item, node, isRoot);
				var onImport = options.onImport,
					data = isElement && node.getAttribute('data-paper-data');
				if (onImport)
					item = onImport(node, item, options) || item;
				if (options.expandShapes && item instanceof Shape) {
					item.remove();
					item = item.toPath();
				}
				if (data)
					item._data = JSON.parse(data);
			}
			if (container) {
				body.removeChild(container);
				if (parent) {
					if (next) {
						parent.insertBefore(node, next);
					} else {
						parent.appendChild(node);
					}
				}
			}
			if (isRoot) {
				definitions = {};
				if (item && Base.pick(options.applyMatrix, applyMatrix))
					item.matrix.apply(true, true);
			}
			return item;
		}

		function importSVG(source, options, owner) {
			if (!source)
				return null;
			options = typeof options === 'function' ? { onLoad: options }
					: options || {};
			var scope = paper,
				item = null;

			function onLoad(svg) {
				try {
					var node = typeof svg === 'object' ? svg : new window.DOMParser()
							.parseFromString(svg, 'image/svg+xml');
					if (!node.nodeName) {
						node = null;
						throw new Error('Unsupported SVG source: ' + source);
					}
					paper = scope;
					item = importNode(node, options, true);
					if (!options || options.insert !== false) {
						owner._insertItem(undefined, item);
					}
					var onLoad = options.onLoad;
					if (onLoad)
						onLoad(item, svg);
				} catch (e) {
					onError(e);
				}
			}

			function onError(message, status) {
				var onError = options.onError;
				if (onError) {
					onError(message, status);
				} else {
					throw new Error(message);
				}
			}

			if (typeof source === 'string' && !/^.*</.test(source)) {
				var node = document.getElementById(source);
				if (node) {
					onLoad(node);
				} else {
					Http.request({
						url: source,
						async: true,
						onLoad: onLoad,
						onError: onError
					});
				}
			} else if (typeof File !== 'undefined' && source instanceof File) {
				var reader = new FileReader();
				reader.onload = function() {
					onLoad(reader.result);
				};
				reader.onerror = function() {
					onError(reader.error);
				};
				return reader.readAsText(source);
			} else {
				onLoad(source);
			}

			return item;
		}

		Item.inject({
			importSVG: function(node, options) {
				return importSVG(node, options, this);
			}
		});

		Project.inject({
			importSVG: function(node, options) {
				this.activate();
				return importSVG(node, options, this);
			}
		});
	};

	Base.exports.PaperScript = function() {
		var exports, define,
			scope = this;
	!function(e,r){return"object"==typeof exports&&"object"==typeof module?r(exports):"function"==typeof define&&define.amd?define(["exports"],r):void r(e.acorn||(e.acorn={}))}(this,function(e){"use strict";function r(e){fe=e||{};for(var r in he)Object.prototype.hasOwnProperty.call(fe,r)||(fe[r]=he[r]);me=fe.sourceFile||null}function t(e,r){var t=ve(de,e);r+=" ("+t.line+":"+t.column+")";var n=new SyntaxError(r);throw n.pos=e,n.loc=t,n.raisedAt=be,n}function n(e){function r(e){if(1==e.length)return t+="return str === "+JSON.stringify(e[0])+";";t+="switch(str){";for(var r=0;r<e.length;++r)t+="case "+JSON.stringify(e[r])+":";t+="return true}return false;"}e=e.split(" ");var t="",n=[];e:for(var a=0;a<e.length;++a){for(var o=0;o<n.length;++o)if(n[o][0].length==e[a].length){n[o].push(e[a]);continue e}n.push([e[a]])}if(n.length>3){n.sort(function(e,r){return r.length-e.length}),t+="switch(str.length){";for(var a=0;a<n.length;++a){var i=n[a];t+="case "+i[0].length+":",r(i)}t+="}"}else r(e);return new Function("str",t)}function a(){this.line=Ae,this.column=be-Se}function o(){Ae=1,be=Se=0,Ee=!0,u()}function i(e,r){ge=be,fe.locations&&(ke=new a),we=e,u(),Ce=r,Ee=e.beforeExpr}function s(){var e=fe.onComment&&fe.locations&&new a,r=be,n=de.indexOf("*/",be+=2);if(-1===n&&t(be-2,"Unterminated comment"),be=n+2,fe.locations){Kr.lastIndex=r;for(var o;(o=Kr.exec(de))&&o.index<be;)++Ae,Se=o.index+o[0].length}fe.onComment&&fe.onComment(!0,de.slice(r+2,n),r,be,e,fe.locations&&new a)}function c(){for(var e=be,r=fe.onComment&&fe.locations&&new a,t=de.charCodeAt(be+=2);pe>be&&10!==t&&13!==t&&8232!==t&&8233!==t;)++be,t=de.charCodeAt(be);fe.onComment&&fe.onComment(!1,de.slice(e+2,be),e,be,r,fe.locations&&new a)}function u(){for(;pe>be;){var e=de.charCodeAt(be);if(32===e)++be;else if(13===e){++be;var r=de.charCodeAt(be);10===r&&++be,fe.locations&&(++Ae,Se=be)}else if(10===e||8232===e||8233===e)++be,fe.locations&&(++Ae,Se=be);else if(e>8&&14>e)++be;else if(47===e){var r=de.charCodeAt(be+1);if(42===r)s();else{if(47!==r)break;c()}}else if(160===e)++be;else{if(!(e>=5760&&Jr.test(String.fromCharCode(e))))break;++be}}}function l(){var e=de.charCodeAt(be+1);return e>=48&&57>=e?E(!0):(++be,i(xr))}function f(){var e=de.charCodeAt(be+1);return Ee?(++be,k()):61===e?x(Er,2):x(wr,1)}function d(){var e=de.charCodeAt(be+1);return 61===e?x(Er,2):x(jr,1)}function p(e){var r=de.charCodeAt(be+1);return r===e?x(124===e?Ir:Lr,2):61===r?x(Er,2):x(124===e?Ur:Rr,1)}function m(){var e=de.charCodeAt(be+1);return 61===e?x(Er,2):x(Fr,1)}function h(e){var r=de.charCodeAt(be+1);return r===e?45==r&&62==de.charCodeAt(be+2)&&Gr.test(de.slice(Le,be))?(be+=3,c(),u(),g()):x(Ar,2):61===r?x(Er,2):x(qr,1)}function v(e){var r=de.charCodeAt(be+1),t=1;return r===e?(t=62===e&&62===de.charCodeAt(be+2)?3:2,61===de.charCodeAt(be+t)?x(Er,t+1):x(Tr,t)):33==r&&60==e&&45==de.charCodeAt(be+2)&&45==de.charCodeAt(be+3)?(be+=4,c(),u(),g()):(61===r&&(t=61===de.charCodeAt(be+2)?3:2),x(Vr,t))}function b(e){var r=de.charCodeAt(be+1);return 61===r?x(Or,61===de.charCodeAt(be+2)?3:2):x(61===e?Cr:Sr,1)}function y(e){switch(e){case 46:return l();case 40:return++be,i(hr);case 41:return++be,i(vr);case 59:return++be,i(yr);case 44:return++be,i(br);case 91:return++be,i(fr);case 93:return++be,i(dr);case 123:return++be,i(pr);case 125:return++be,i(mr);case 58:return++be,i(gr);case 63:return++be,i(kr);case 48:var r=de.charCodeAt(be+1);if(120===r||88===r)return C();case 49:case 50:case 51:case 52:case 53:case 54:case 55:case 56:case 57:return E(!1);case 34:case 39:return A(e);case 47:return f(e);case 37:case 42:return d();case 124:case 38:return p(e);case 94:return m();case 43:case 45:return h(e);case 60:case 62:return v(e);case 61:case 33:return b(e);case 126:return x(Sr,1)}return!1}function g(e){if(e?be=ye+1:ye=be,fe.locations&&(xe=new a),e)return k();if(be>=pe)return i(Be);var r=de.charCodeAt(be);if(Qr(r)||92===r)return L();var n=y(r);if(n===!1){var o=String.fromCharCode(r);if("\\"===o||$r.test(o))return L();t(be,"Unexpected character '"+o+"'")}return n}function x(e,r){var t=de.slice(be,be+r);be+=r,i(e,t)}function k(){for(var e,r,n="",a=be;;){be>=pe&&t(a,"Unterminated regular expression");var o=de.charAt(be);if(Gr.test(o)&&t(a,"Unterminated regular expression"),e)e=!1;else{if("["===o)r=!0;else if("]"===o&&r)r=!1;else if("/"===o&&!r)break;e="\\"===o}++be}var n=de.slice(a,be);++be;var s=I();s&&!/^[gmsiy]*$/.test(s)&&t(a,"Invalid regexp flag");try{var c=new RegExp(n,s)}catch(u){u instanceof SyntaxError&&t(a,u.message),t(u)}return i(qe,c)}function w(e,r){for(var t=be,n=0,a=0,o=null==r?1/0:r;o>a;++a){var i,s=de.charCodeAt(be);if(i=s>=97?s-97+10:s>=65?s-65+10:s>=48&&57>=s?s-48:1/0,i>=e)break;++be,n=n*e+i}return be===t||null!=r&&be-t!==r?null:n}function C(){be+=2;var e=w(16);return null==e&&t(ye+2,"Expected hexadecimal number"),Qr(de.charCodeAt(be))&&t(be,"Identifier directly after number"),i(Te,e)}function E(e){var r=be,n=!1,a=48===de.charCodeAt(be);e||null!==w(10)||t(r,"Invalid number"),46===de.charCodeAt(be)&&(++be,w(10),n=!0);var o=de.charCodeAt(be);69!==o&&101!==o||(o=de.charCodeAt(++be),43!==o&&45!==o||++be,null===w(10)&&t(r,"Invalid number"),n=!0),Qr(de.charCodeAt(be))&&t(be,"Identifier directly after number");var s,c=de.slice(r,be);return n?s=parseFloat(c):a&&1!==c.length?/[89]/.test(c)||Oe?t(r,"Invalid number"):s=parseInt(c,8):s=parseInt(c,10),i(Te,s)}function A(e){be++;for(var r="";;){be>=pe&&t(ye,"Unterminated string constant");var n=de.charCodeAt(be);if(n===e)return++be,i(je,r);if(92===n){n=de.charCodeAt(++be);var a=/^[0-7]+/.exec(de.slice(be,be+3));for(a&&(a=a[0]);a&&parseInt(a,8)>255;)a=a.slice(0,-1);if("0"===a&&(a=null),++be,a)Oe&&t(be-2,"Octal literal in strict mode"),r+=String.fromCharCode(parseInt(a,8)),be+=a.length-1;else switch(n){case 110:r+="\n";break;case 114:r+="\r";break;case 120:r+=String.fromCharCode(S(2));break;case 117:r+=String.fromCharCode(S(4));break;case 85:r+=String.fromCharCode(S(8));break;case 116:r+="	";break;case 98:r+="\b";break;case 118:r+="\x0B";break;case 102:r+="\f";break;case 48:r+="\x00";break;case 13:10===de.charCodeAt(be)&&++be;case 10:fe.locations&&(Se=be,++Ae);break;default:r+=String.fromCharCode(n)}}else 13!==n&&10!==n&&8232!==n&&8233!==n||t(ye,"Unterminated string constant"),r+=String.fromCharCode(n),++be}}function S(e){var r=w(16,e);return null===r&&t(ye,"Bad character escape sequence"),r}function I(){Br=!1;for(var e,r=!0,n=be;;){var a=de.charCodeAt(be);if(Yr(a))Br&&(e+=de.charAt(be)),++be;else{if(92!==a)break;Br||(e=de.slice(n,be)),Br=!0,117!=de.charCodeAt(++be)&&t(be,"Expecting Unicode escape sequence \\uXXXX"),++be;var o=S(4),i=String.fromCharCode(o);i||t(be-1,"Invalid Unicode escape"),(r?Qr(o):Yr(o))||t(be-4,"Invalid Unicode escape"),e+=i}r=!1}return Br?e:de.slice(n,be)}function L(){var e=I(),r=De;return!Br&&Wr(e)&&(r=lr[e]),i(r,e)}function U(){Ie=ye,Le=ge,Ue=ke,g()}function F(e){if(Oe=e,be=ye,fe.locations)for(;Se>be;)Se=de.lastIndexOf("\n",Se-2)+1,--Ae;u(),g()}function R(){this.type=null,this.start=ye,this.end=null}function O(){this.start=xe,this.end=null,null!==me&&(this.source=me)}function V(){var e=new R;return fe.locations&&(e.loc=new O),fe.directSourceFile&&(e.sourceFile=fe.directSourceFile),fe.ranges&&(e.range=[ye,0]),e}function T(e){var r=new R;return r.start=e.start,fe.locations&&(r.loc=new O,r.loc.start=e.loc.start),fe.ranges&&(r.range=[e.range[0],0]),r}function q(e,r){return e.type=r,e.end=Le,fe.locations&&(e.loc.end=Ue),fe.ranges&&(e.range[1]=Le),e}function j(e){return fe.ecmaVersion>=5&&"ExpressionStatement"===e.type&&"Literal"===e.expression.type&&"use strict"===e.expression.value}function D(e){return we===e?(U(),!0):void 0}function B(){return!fe.strictSemicolons&&(we===Be||we===mr||Gr.test(de.slice(Le,ye)))}function M(){D(yr)||B()||X()}function z(e){we===e?U():X()}function X(){t(ye,"Unexpected token")}function N(e){"Identifier"!==e.type&&"MemberExpression"!==e.type&&t(e.start,"Assigning to rvalue"),Oe&&"Identifier"===e.type&&Nr(e.name)&&t(e.start,"Assigning to "+e.name+" in strict mode")}function W(e){Ie=Le=be,fe.locations&&(Ue=new a),Fe=Oe=null,Re=[],g();var r=e||V(),t=!0;for(e||(r.body=[]);we!==Be;){var n=J();r.body.push(n),t&&j(n)&&F(!0),t=!1}return q(r,"Program")}function J(){(we===wr||we===Er&&"/="==Ce)&&g(!0);var e=we,r=V();switch(e){case Me:case Ne:U();var n=e===Me;D(yr)||B()?r.label=null:we!==De?X():(r.label=le(),M());for(var a=0;a<Re.length;++a){var o=Re[a];if(null==r.label||o.name===r.label.name){if(null!=o.kind&&(n||"loop"===o.kind))break;if(r.label&&n)break}}return a===Re.length&&t(r.start,"Unsyntactic "+e.keyword),q(r,n?"BreakStatement":"ContinueStatement");case We:return U(),M(),q(r,"DebuggerStatement");case Pe:return U(),Re.push(Zr),r.body=J(),Re.pop(),z(tr),r.test=P(),M(),q(r,"DoWhileStatement");case _e:if(U(),Re.push(Zr),z(hr),we===yr)return $(r,null);if(we===rr){var i=V();return U(),G(i,!0),q(i,"VariableDeclaration"),1===i.declarations.length&&D(ur)?_(r,i):$(r,i)}var i=K(!1,!0);return D(ur)?(N(i),_(r,i)):$(r,i);case Ge:return U(),ce(r,!0);case Ke:return U(),r.test=P(),r.consequent=J(),r.alternate=D(He)?J():null,q(r,"IfStatement");case Qe:return Fe||fe.allowReturnOutsideFunction||t(ye,"'return' outside of function"),U(),D(yr)||B()?r.argument=null:(r.argument=K(),M()),q(r,"ReturnStatement");case Ye:U(),r.discriminant=P(),r.cases=[],z(pr),Re.push(et);for(var s,c;we!=mr;)if(we===ze||we===Je){var u=we===ze;s&&q(s,"SwitchCase"),r.cases.push(s=V()),s.consequent=[],U(),u?s.test=K():(c&&t(Ie,"Multiple default clauses"),c=!0,s.test=null),z(gr)}else s||X(),s.consequent.push(J());return s&&q(s,"SwitchCase"),U(),Re.pop(),q(r,"SwitchStatement");case Ze:return U(),Gr.test(de.slice(Le,ye))&&t(Le,"Illegal newline after throw"),r.argument=K(),M(),q(r,"ThrowStatement");case er:if(U(),r.block=H(),r.handler=null,we===Xe){var l=V();U(),z(hr),l.param=le(),Oe&&Nr(l.param.name)&&t(l.param.start,"Binding "+l.param.name+" in strict mode"),z(vr),l.guard=null,l.body=H(),r.handler=q(l,"CatchClause")}return r.guardedHandlers=Ve,r.finalizer=D($e)?H():null,r.handler||r.finalizer||t(r.start,"Missing catch or finally clause"),q(r,"TryStatement");case rr:return U(),G(r),M(),q(r,"VariableDeclaration");case tr:return U(),r.test=P(),Re.push(Zr),r.body=J(),Re.pop(),q(r,"WhileStatement");case nr:return Oe&&t(ye,"'with' in strict mode"),U(),r.object=P(),r.body=J(),q(r,"WithStatement");case pr:return H();case yr:return U(),q(r,"EmptyStatement");default:var f=Ce,d=K();if(e===De&&"Identifier"===d.type&&D(gr)){for(var a=0;a<Re.length;++a)Re[a].name===f&&t(d.start,"Label '"+f+"' is already declared");var p=we.isLoop?"loop":we===Ye?"switch":null;return Re.push({name:f,kind:p}),r.body=J(),Re.pop(),r.label=d,q(r,"LabeledStatement")}return r.expression=d,M(),q(r,"ExpressionStatement")}}function P(){z(hr);var e=K();return z(vr),e}function H(e){var r,t=V(),n=!0,a=!1;for(t.body=[],z(pr);!D(mr);){var o=J();t.body.push(o),n&&e&&j(o)&&(r=a,F(a=!0)),n=!1}return a&&!r&&F(!1),q(t,"BlockStatement")}function $(e,r){return e.init=r,z(yr),e.test=we===yr?null:K(),z(yr),e.update=we===vr?null:K(),z(vr),e.body=J(),Re.pop(),q(e,"ForStatement")}function _(e,r){return e.left=r,e.right=K(),z(vr),e.body=J(),Re.pop(),q(e,"ForInStatement")}function G(e,r){for(e.declarations=[],e.kind="var";;){var n=V();if(n.id=le(),Oe&&Nr(n.id.name)&&t(n.id.start,"Binding "+n.id.name+" in strict mode"),n.init=D(Cr)?K(!0,r):null,e.declarations.push(q(n,"VariableDeclarator")),!D(br))break}return e}function K(e,r){var t=Q(r);if(!e&&we===br){var n=T(t);for(n.expressions=[t];D(br);)n.expressions.push(Q(r));return q(n,"SequenceExpression")}return t}function Q(e){var r=Y(e);if(we.isAssign){var t=T(r);return t.operator=Ce,t.left=r,U(),t.right=Q(e),N(r),q(t,"AssignmentExpression")}return r}function Y(e){var r=Z(e);if(D(kr)){var t=T(r);return t.test=r,t.consequent=K(!0),z(gr),t.alternate=K(!0,e),q(t,"ConditionalExpression")}return r}function Z(e){return ee(re(),-1,e)}function ee(e,r,t){var n=we.binop;if(null!=n&&(!t||we!==ur)&&n>r){var a=T(e);a.left=e,a.operator=Ce;var o=we;U(),a.right=ee(re(),n,t);var i=q(a,o===Ir||o===Lr?"LogicalExpression":"BinaryExpression");return ee(i,r,t)}return e}function re(){if(we.prefix){var e=V(),r=we.isUpdate;return e.operator=Ce,e.prefix=!0,Ee=!0,U(),e.argument=re(),r?N(e.argument):Oe&&"delete"===e.operator&&"Identifier"===e.argument.type&&t(e.start,"Deleting local variable in strict mode"),q(e,r?"UpdateExpression":"UnaryExpression")}for(var n=te();we.postfix&&!B();){var e=T(n);e.operator=Ce,e.prefix=!1,e.argument=n,N(n),U(),n=q(e,"UpdateExpression")}return n}function te(){return ne(ae())}function ne(e,r){if(D(xr)){var t=T(e);return t.object=e,t.property=le(!0),t.computed=!1,ne(q(t,"MemberExpression"),r)}if(D(fr)){var t=T(e);return t.object=e,t.property=K(),t.computed=!0,z(dr),ne(q(t,"MemberExpression"),r)}if(!r&&D(hr)){var t=T(e);return t.callee=e,t.arguments=ue(vr,!1),ne(q(t,"CallExpression"),r)}return e}function ae(){switch(we){case or:var e=V();return U(),q(e,"ThisExpression");case De:return le();case Te:case je:case qe:var e=V();return e.value=Ce,e.raw=de.slice(ye,ge),U(),q(e,"Literal");case ir:case sr:case cr:var e=V();return e.value=we.atomValue,e.raw=we.keyword,U(),q(e,"Literal");case hr:var r=xe,t=ye;U();var n=K();return n.start=t,n.end=ge,fe.locations&&(n.loc.start=r,n.loc.end=ke),fe.ranges&&(n.range=[t,ge]),z(vr),n;case fr:var e=V();return U(),e.elements=ue(dr,!0,!0),q(e,"ArrayExpression");case pr:return ie();case Ge:var e=V();return U(),ce(e,!1);case ar:return oe();default:X()}}function oe(){var e=V();return U(),e.callee=ne(ae(),!0),D(hr)?e.arguments=ue(vr,!1):e.arguments=Ve,q(e,"NewExpression")}function ie(){var e=V(),r=!0,n=!1;for(e.properties=[],U();!D(mr);){if(r)r=!1;else if(z(br),fe.allowTrailingCommas&&D(mr))break;var a,o={key:se()},i=!1;if(D(gr)?(o.value=K(!0),a=o.kind="init"):fe.ecmaVersion>=5&&"Identifier"===o.key.type&&("get"===o.key.name||"set"===o.key.name)?(i=n=!0,a=o.kind=o.key.name,o.key=se(),we!==hr&&X(),o.value=ce(V(),!1)):X(),"Identifier"===o.key.type&&(Oe||n))for(var s=0;s<e.properties.length;++s){var c=e.properties[s];if(c.key.name===o.key.name){var u=a==c.kind||i&&"init"===c.kind||"init"===a&&("get"===c.kind||"set"===c.kind);u&&!Oe&&"init"===a&&"init"===c.kind&&(u=!1),u&&t(o.key.start,"Redefinition of property")}}e.properties.push(o)}return q(e,"ObjectExpression")}function se(){return we===Te||we===je?ae():le(!0)}function ce(e,r){we===De?e.id=le():r?X():e.id=null,e.params=[];var n=!0;for(z(hr);!D(vr);)n?n=!1:z(br),e.params.push(le());var a=Fe,o=Re;if(Fe=!0,Re=[],e.body=H(!0),Fe=a,Re=o,Oe||e.body.body.length&&j(e.body.body[0]))for(var i=e.id?-1:0;i<e.params.length;++i){var s=0>i?e.id:e.params[i];if((Xr(s.name)||Nr(s.name))&&t(s.start,"Defining '"+s.name+"' in strict mode"),i>=0)for(var c=0;i>c;++c)s.name===e.params[c].name&&t(s.start,"Argument name clash in strict mode")}return q(e,r?"FunctionDeclaration":"FunctionExpression")}function ue(e,r,t){for(var n=[],a=!0;!D(e);){if(a)a=!1;else if(z(br),r&&fe.allowTrailingCommas&&D(e))break;t&&we===br?n.push(null):n.push(K(!0))}return n}function le(e){var r=V();return e&&"everywhere"==fe.forbidReserved&&(e=!1),we===De?(!e&&(fe.forbidReserved&&(3===fe.ecmaVersion?Mr:zr)(Ce)||Oe&&Xr(Ce))&&-1==de.slice(ye,ge).indexOf("\\")&&t(ye,"The keyword '"+Ce+"' is reserved"),r.name=Ce):e&&we.keyword?r.name=we.keyword:X(),Ee=!1,U(),q(r,"Identifier")}e.version="0.5.0";var fe,de,pe,me;e.parse=function(e,t){return de=String(e),pe=de.length,r(t),o(),W(fe.program)};var he=e.defaultOptions={ecmaVersion:5,strictSemicolons:!1,allowTrailingCommas:!0,forbidReserved:!1,allowReturnOutsideFunction:!1,locations:!1,onComment:null,ranges:!1,program:null,sourceFile:null,directSourceFile:null},ve=e.getLineInfo=function(e,r){for(var t=1,n=0;;){Kr.lastIndex=n;var a=Kr.exec(e);if(!(a&&a.index<r))break;++t,n=a.index+a[0].length}return{line:t,column:r-n}};e.tokenize=function(e,t){function n(e){return Le=ge,g(e),a.start=ye,a.end=ge,a.startLoc=xe,a.endLoc=ke,a.type=we,a.value=Ce,a}de=String(e),pe=de.length,r(t),o();var a={};return n.jumpTo=function(e,r){if(be=e,fe.locations){Ae=1,Se=Kr.lastIndex=0;for(var t;(t=Kr.exec(de))&&t.index<e;)++Ae,Se=t.index+t[0].length}Ee=r,u()},n};var be,ye,ge,xe,ke,we,Ce,Ee,Ae,Se,Ie,Le,Ue,Fe,Re,Oe,Ve=[],Te={type:"num"},qe={type:"regexp"},je={type:"string"},De={type:"name"},Be={type:"eof"},Me={keyword:"break"},ze={keyword:"case",beforeExpr:!0},Xe={keyword:"catch"},Ne={keyword:"continue"},We={keyword:"debugger"},Je={keyword:"default"},Pe={keyword:"do",isLoop:!0},He={keyword:"else",beforeExpr:!0},$e={keyword:"finally"},_e={keyword:"for",isLoop:!0},Ge={keyword:"function"},Ke={keyword:"if"},Qe={keyword:"return",beforeExpr:!0},Ye={keyword:"switch"},Ze={keyword:"throw",beforeExpr:!0},er={keyword:"try"},rr={keyword:"var"},tr={keyword:"while",isLoop:!0},nr={keyword:"with"},ar={keyword:"new",beforeExpr:!0},or={keyword:"this"},ir={keyword:"null",atomValue:null},sr={keyword:"true",atomValue:!0},cr={keyword:"false",atomValue:!1},ur={keyword:"in",binop:7,beforeExpr:!0},lr={"break":Me,"case":ze,"catch":Xe,"continue":Ne,"debugger":We,"default":Je,"do":Pe,"else":He,"finally":$e,"for":_e,"function":Ge,"if":Ke,"return":Qe,"switch":Ye,"throw":Ze,"try":er,"var":rr,"while":tr,"with":nr,"null":ir,"true":sr,"false":cr,"new":ar,"in":ur,"instanceof":{keyword:"instanceof",binop:7,beforeExpr:!0},"this":or,"typeof":{keyword:"typeof",prefix:!0,beforeExpr:!0},"void":{keyword:"void",prefix:!0,beforeExpr:!0},"delete":{keyword:"delete",prefix:!0,beforeExpr:!0}},fr={type:"[",beforeExpr:!0},dr={type:"]"},pr={type:"{",beforeExpr:!0},mr={type:"}"},hr={type:"(",beforeExpr:!0},vr={type:")"},br={type:",",beforeExpr:!0},yr={type:";",beforeExpr:!0},gr={type:":",beforeExpr:!0},xr={type:"."},kr={type:"?",beforeExpr:!0},wr={binop:10,beforeExpr:!0},Cr={isAssign:!0,beforeExpr:!0},Er={isAssign:!0,beforeExpr:!0},Ar={postfix:!0,prefix:!0,isUpdate:!0},Sr={prefix:!0,beforeExpr:!0},Ir={binop:1,beforeExpr:!0},Lr={binop:2,beforeExpr:!0},Ur={binop:3,beforeExpr:!0},Fr={binop:4,beforeExpr:!0},Rr={binop:5,beforeExpr:!0},Or={binop:6,beforeExpr:!0},Vr={binop:7,beforeExpr:!0},Tr={binop:8,beforeExpr:!0},qr={binop:9,prefix:!0,beforeExpr:!0},jr={binop:10,beforeExpr:!0};e.tokTypes={bracketL:fr,bracketR:dr,braceL:pr,braceR:mr,parenL:hr,parenR:vr,comma:br,semi:yr,colon:gr,dot:xr,question:kr,slash:wr,eq:Cr,name:De,eof:Be,num:Te,regexp:qe,string:je};for(var Dr in lr)e.tokTypes["_"+Dr]=lr[Dr];var Br,Mr=n("abstract boolean byte char class double enum export extends final float goto implements import int interface long native package private protected public short static super synchronized throws transient volatile"),zr=n("class enum extends super const export import"),Xr=n("implements interface let package private protected public static yield"),Nr=n("eval arguments"),Wr=n("break case catch continue debugger default do else finally for function if return switch throw try var while with null true false instanceof typeof void delete new in this"),Jr=/[\u1680\u180e\u2000-\u200a\u202f\u205f\u3000\ufeff]/,Pr="\xaa\xb5\xba\xc0-\xd6\xd8-\xf6\xf8-\u02c1\u02c6-\u02d1\u02e0-\u02e4\u02ec\u02ee\u0370-\u0374\u0376\u0377\u037a-\u037d\u0386\u0388-\u038a\u038c\u038e-\u03a1\u03a3-\u03f5\u03f7-\u0481\u048a-\u0527\u0531-\u0556\u0559\u0561-\u0587\u05d0-\u05ea\u05f0-\u05f2\u0620-\u064a\u066e\u066f\u0671-\u06d3\u06d5\u06e5\u06e6\u06ee\u06ef\u06fa-\u06fc\u06ff\u0710\u0712-\u072f\u074d-\u07a5\u07b1\u07ca-\u07ea\u07f4\u07f5\u07fa\u0800-\u0815\u081a\u0824\u0828\u0840-\u0858\u08a0\u08a2-\u08ac\u0904-\u0939\u093d\u0950\u0958-\u0961\u0971-\u0977\u0979-\u097f\u0985-\u098c\u098f\u0990\u0993-\u09a8\u09aa-\u09b0\u09b2\u09b6-\u09b9\u09bd\u09ce\u09dc\u09dd\u09df-\u09e1\u09f0\u09f1\u0a05-\u0a0a\u0a0f\u0a10\u0a13-\u0a28\u0a2a-\u0a30\u0a32\u0a33\u0a35\u0a36\u0a38\u0a39\u0a59-\u0a5c\u0a5e\u0a72-\u0a74\u0a85-\u0a8d\u0a8f-\u0a91\u0a93-\u0aa8\u0aaa-\u0ab0\u0ab2\u0ab3\u0ab5-\u0ab9\u0abd\u0ad0\u0ae0\u0ae1\u0b05-\u0b0c\u0b0f\u0b10\u0b13-\u0b28\u0b2a-\u0b30\u0b32\u0b33\u0b35-\u0b39\u0b3d\u0b5c\u0b5d\u0b5f-\u0b61\u0b71\u0b83\u0b85-\u0b8a\u0b8e-\u0b90\u0b92-\u0b95\u0b99\u0b9a\u0b9c\u0b9e\u0b9f\u0ba3\u0ba4\u0ba8-\u0baa\u0bae-\u0bb9\u0bd0\u0c05-\u0c0c\u0c0e-\u0c10\u0c12-\u0c28\u0c2a-\u0c33\u0c35-\u0c39\u0c3d\u0c58\u0c59\u0c60\u0c61\u0c85-\u0c8c\u0c8e-\u0c90\u0c92-\u0ca8\u0caa-\u0cb3\u0cb5-\u0cb9\u0cbd\u0cde\u0ce0\u0ce1\u0cf1\u0cf2\u0d05-\u0d0c\u0d0e-\u0d10\u0d12-\u0d3a\u0d3d\u0d4e\u0d60\u0d61\u0d7a-\u0d7f\u0d85-\u0d96\u0d9a-\u0db1\u0db3-\u0dbb\u0dbd\u0dc0-\u0dc6\u0e01-\u0e30\u0e32\u0e33\u0e40-\u0e46\u0e81\u0e82\u0e84\u0e87\u0e88\u0e8a\u0e8d\u0e94-\u0e97\u0e99-\u0e9f\u0ea1-\u0ea3\u0ea5\u0ea7\u0eaa\u0eab\u0ead-\u0eb0\u0eb2\u0eb3\u0ebd\u0ec0-\u0ec4\u0ec6\u0edc-\u0edf\u0f00\u0f40-\u0f47\u0f49-\u0f6c\u0f88-\u0f8c\u1000-\u102a\u103f\u1050-\u1055\u105a-\u105d\u1061\u1065\u1066\u106e-\u1070\u1075-\u1081\u108e\u10a0-\u10c5\u10c7\u10cd\u10d0-\u10fa\u10fc-\u1248\u124a-\u124d\u1250-\u1256\u1258\u125a-\u125d\u1260-\u1288\u128a-\u128d\u1290-\u12b0\u12b2-\u12b5\u12b8-\u12be\u12c0\u12c2-\u12c5\u12c8-\u12d6\u12d8-\u1310\u1312-\u1315\u1318-\u135a\u1380-\u138f\u13a0-\u13f4\u1401-\u166c\u166f-\u167f\u1681-\u169a\u16a0-\u16ea\u16ee-\u16f0\u1700-\u170c\u170e-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176c\u176e-\u1770\u1780-\u17b3\u17d7\u17dc\u1820-\u1877\u1880-\u18a8\u18aa\u18b0-\u18f5\u1900-\u191c\u1950-\u196d\u1970-\u1974\u1980-\u19ab\u19c1-\u19c7\u1a00-\u1a16\u1a20-\u1a54\u1aa7\u1b05-\u1b33\u1b45-\u1b4b\u1b83-\u1ba0\u1bae\u1baf\u1bba-\u1be5\u1c00-\u1c23\u1c4d-\u1c4f\u1c5a-\u1c7d\u1ce9-\u1cec\u1cee-\u1cf1\u1cf5\u1cf6\u1d00-\u1dbf\u1e00-\u1f15\u1f18-\u1f1d\u1f20-\u1f45\u1f48-\u1f4d\u1f50-\u1f57\u1f59\u1f5b\u1f5d\u1f5f-\u1f7d\u1f80-\u1fb4\u1fb6-\u1fbc\u1fbe\u1fc2-\u1fc4\u1fc6-\u1fcc\u1fd0-\u1fd3\u1fd6-\u1fdb\u1fe0-\u1fec\u1ff2-\u1ff4\u1ff6-\u1ffc\u2071\u207f\u2090-\u209c\u2102\u2107\u210a-\u2113\u2115\u2119-\u211d\u2124\u2126\u2128\u212a-\u212d\u212f-\u2139\u213c-\u213f\u2145-\u2149\u214e\u2160-\u2188\u2c00-\u2c2e\u2c30-\u2c5e\u2c60-\u2ce4\u2ceb-\u2cee\u2cf2\u2cf3\u2d00-\u2d25\u2d27\u2d2d\u2d30-\u2d67\u2d6f\u2d80-\u2d96\u2da0-\u2da6\u2da8-\u2dae\u2db0-\u2db6\u2db8-\u2dbe\u2dc0-\u2dc6\u2dc8-\u2dce\u2dd0-\u2dd6\u2dd8-\u2dde\u2e2f\u3005-\u3007\u3021-\u3029\u3031-\u3035\u3038-\u303c\u3041-\u3096\u309d-\u309f\u30a1-\u30fa\u30fc-\u30ff\u3105-\u312d\u3131-\u318e\u31a0-\u31ba\u31f0-\u31ff\u3400-\u4db5\u4e00-\u9fcc\ua000-\ua48c\ua4d0-\ua4fd\ua500-\ua60c\ua610-\ua61f\ua62a\ua62b\ua640-\ua66e\ua67f-\ua697\ua6a0-\ua6ef\ua717-\ua71f\ua722-\ua788\ua78b-\ua78e\ua790-\ua793\ua7a0-\ua7aa\ua7f8-\ua801\ua803-\ua805\ua807-\ua80a\ua80c-\ua822\ua840-\ua873\ua882-\ua8b3\ua8f2-\ua8f7\ua8fb\ua90a-\ua925\ua930-\ua946\ua960-\ua97c\ua984-\ua9b2\ua9cf\uaa00-\uaa28\uaa40-\uaa42\uaa44-\uaa4b\uaa60-\uaa76\uaa7a\uaa80-\uaaaf\uaab1\uaab5\uaab6\uaab9-\uaabd\uaac0\uaac2\uaadb-\uaadd\uaae0-\uaaea\uaaf2-\uaaf4\uab01-\uab06\uab09-\uab0e\uab11-\uab16\uab20-\uab26\uab28-\uab2e\uabc0-\uabe2\uac00-\ud7a3\ud7b0-\ud7c6\ud7cb-\ud7fb\uf900-\ufa6d\ufa70-\ufad9\ufb00-\ufb06\ufb13-\ufb17\ufb1d\ufb1f-\ufb28\ufb2a-\ufb36\ufb38-\ufb3c\ufb3e\ufb40\ufb41\ufb43\ufb44\ufb46-\ufbb1\ufbd3-\ufd3d\ufd50-\ufd8f\ufd92-\ufdc7\ufdf0-\ufdfb\ufe70-\ufe74\ufe76-\ufefc\uff21-\uff3a\uff41-\uff5a\uff66-\uffbe\uffc2-\uffc7\uffca-\uffcf\uffd2-\uffd7\uffda-\uffdc",Hr="\u0300-\u036f\u0483-\u0487\u0591-\u05bd\u05bf\u05c1\u05c2\u05c4\u05c5\u05c7\u0610-\u061a\u0620-\u0649\u0672-\u06d3\u06e7-\u06e8\u06fb-\u06fc\u0730-\u074a\u0800-\u0814\u081b-\u0823\u0825-\u0827\u0829-\u082d\u0840-\u0857\u08e4-\u08fe\u0900-\u0903\u093a-\u093c\u093e-\u094f\u0951-\u0957\u0962-\u0963\u0966-\u096f\u0981-\u0983\u09bc\u09be-\u09c4\u09c7\u09c8\u09d7\u09df-\u09e0\u0a01-\u0a03\u0a3c\u0a3e-\u0a42\u0a47\u0a48\u0a4b-\u0a4d\u0a51\u0a66-\u0a71\u0a75\u0a81-\u0a83\u0abc\u0abe-\u0ac5\u0ac7-\u0ac9\u0acb-\u0acd\u0ae2-\u0ae3\u0ae6-\u0aef\u0b01-\u0b03\u0b3c\u0b3e-\u0b44\u0b47\u0b48\u0b4b-\u0b4d\u0b56\u0b57\u0b5f-\u0b60\u0b66-\u0b6f\u0b82\u0bbe-\u0bc2\u0bc6-\u0bc8\u0bca-\u0bcd\u0bd7\u0be6-\u0bef\u0c01-\u0c03\u0c46-\u0c48\u0c4a-\u0c4d\u0c55\u0c56\u0c62-\u0c63\u0c66-\u0c6f\u0c82\u0c83\u0cbc\u0cbe-\u0cc4\u0cc6-\u0cc8\u0cca-\u0ccd\u0cd5\u0cd6\u0ce2-\u0ce3\u0ce6-\u0cef\u0d02\u0d03\u0d46-\u0d48\u0d57\u0d62-\u0d63\u0d66-\u0d6f\u0d82\u0d83\u0dca\u0dcf-\u0dd4\u0dd6\u0dd8-\u0ddf\u0df2\u0df3\u0e34-\u0e3a\u0e40-\u0e45\u0e50-\u0e59\u0eb4-\u0eb9\u0ec8-\u0ecd\u0ed0-\u0ed9\u0f18\u0f19\u0f20-\u0f29\u0f35\u0f37\u0f39\u0f41-\u0f47\u0f71-\u0f84\u0f86-\u0f87\u0f8d-\u0f97\u0f99-\u0fbc\u0fc6\u1000-\u1029\u1040-\u1049\u1067-\u106d\u1071-\u1074\u1082-\u108d\u108f-\u109d\u135d-\u135f\u170e-\u1710\u1720-\u1730\u1740-\u1750\u1772\u1773\u1780-\u17b2\u17dd\u17e0-\u17e9\u180b-\u180d\u1810-\u1819\u1920-\u192b\u1930-\u193b\u1951-\u196d\u19b0-\u19c0\u19c8-\u19c9\u19d0-\u19d9\u1a00-\u1a15\u1a20-\u1a53\u1a60-\u1a7c\u1a7f-\u1a89\u1a90-\u1a99\u1b46-\u1b4b\u1b50-\u1b59\u1b6b-\u1b73\u1bb0-\u1bb9\u1be6-\u1bf3\u1c00-\u1c22\u1c40-\u1c49\u1c5b-\u1c7d\u1cd0-\u1cd2\u1d00-\u1dbe\u1e01-\u1f15\u200c\u200d\u203f\u2040\u2054\u20d0-\u20dc\u20e1\u20e5-\u20f0\u2d81-\u2d96\u2de0-\u2dff\u3021-\u3028\u3099\u309a\ua640-\ua66d\ua674-\ua67d\ua69f\ua6f0-\ua6f1\ua7f8-\ua800\ua806\ua80b\ua823-\ua827\ua880-\ua881\ua8b4-\ua8c4\ua8d0-\ua8d9\ua8f3-\ua8f7\ua900-\ua909\ua926-\ua92d\ua930-\ua945\ua980-\ua983\ua9b3-\ua9c0\uaa00-\uaa27\uaa40-\uaa41\uaa4c-\uaa4d\uaa50-\uaa59\uaa7b\uaae0-\uaae9\uaaf2-\uaaf3\uabc0-\uabe1\uabec\uabed\uabf0-\uabf9\ufb20-\ufb28\ufe00-\ufe0f\ufe20-\ufe26\ufe33\ufe34\ufe4d-\ufe4f\uff10-\uff19\uff3f",$r=new RegExp("["+Pr+"]"),_r=new RegExp("["+Pr+Hr+"]"),Gr=/[\n\r\u2028\u2029]/,Kr=/\r\n|[\n\r\u2028\u2029]/g,Qr=e.isIdentifierStart=function(e){return 65>e?36===e:91>e?!0:97>e?95===e:123>e?!0:e>=170&&$r.test(String.fromCharCode(e))},Yr=e.isIdentifierChar=function(e){return 48>e?36===e:58>e?!0:65>e?!1:91>e?!0:97>e?95===e:123>e?!0:e>=170&&_r.test(String.fromCharCode(e))},Zr={kind:"loop"},et={kind:"switch"}});

		var binaryOperators = {
			'+': '__add',
			'-': '__subtract',
			'*': '__multiply',
			'/': '__divide',
			'%': '__modulo',
			'==': '__equals',
			'!=': '__equals'
		};

		var unaryOperators = {
			'-': '__negate',
			'+': null
		};

		var fields = Base.each(
			['add', 'subtract', 'multiply', 'divide', 'modulo', 'equals', 'negate'],
			function(name) {
				this['__' + name] = '#' + name;
			},
			{}
		);
		Point.inject(fields);
		Size.inject(fields);
		Color.inject(fields);

		function __$__(left, operator, right) {
			var handler = binaryOperators[operator];
			if (left && left[handler]) {
				var res = left[handler](right);
				return operator === '!=' ? !res : res;
			}
			switch (operator) {
			case '+': return left + right;
			case '-': return left - right;
			case '*': return left * right;
			case '/': return left / right;
			case '%': return left % right;
			case '==': return left == right;
			case '!=': return left != right;
			}
		}

		function $__(operator, value) {
			var handler = unaryOperators[operator];
			if (handler && value && value[handler])
				return value[handler]();
			switch (operator) {
			case '+': return +value;
			case '-': return -value;
			}
		}

		function parse(code, options) {
			return scope.acorn.parse(code, options);
		}

		function compile(code, options) {
			if (!code)
				return '';
			options = options || {};

			var insertions = [];

			function getOffset(offset) {
				for (var i = 0, l = insertions.length; i < l; i++) {
					var insertion = insertions[i];
					if (insertion[0] >= offset)
						break;
					offset += insertion[1];
				}
				return offset;
			}

			function getCode(node) {
				return code.substring(getOffset(node.range[0]),
						getOffset(node.range[1]));
			}

			function getBetween(left, right) {
				return code.substring(getOffset(left.range[1]),
						getOffset(right.range[0]));
			}

			function replaceCode(node, str) {
				var start = getOffset(node.range[0]),
					end = getOffset(node.range[1]),
					insert = 0;
				for (var i = insertions.length - 1; i >= 0; i--) {
					if (start > insertions[i][0]) {
						insert = i + 1;
						break;
					}
				}
				insertions.splice(insert, 0, [start, str.length - end + start]);
				code = code.substring(0, start) + str + code.substring(end);
			}

			function walkAST(node, parent) {
				if (!node)
					return;
				for (var key in node) {
					if (key === 'range' || key === 'loc')
						continue;
					var value = node[key];
					if (Array.isArray(value)) {
						for (var i = 0, l = value.length; i < l; i++)
							walkAST(value[i], node);
					} else if (value && typeof value === 'object') {
						walkAST(value, node);
					}
				}
				switch (node.type) {
				case 'UnaryExpression':
					if (node.operator in unaryOperators
							&& node.argument.type !== 'Literal') {
						var arg = getCode(node.argument);
						replaceCode(node, '$__("' + node.operator + '", '
								+ arg + ')');
					}
					break;
				case 'BinaryExpression':
					if (node.operator in binaryOperators
							&& node.left.type !== 'Literal') {
						var left = getCode(node.left),
							right = getCode(node.right),
							between = getBetween(node.left, node.right),
							operator = node.operator;
						replaceCode(node, '__$__(' + left + ','
								+ between.replace(new RegExp('\\' + operator),
									'"' + operator + '"')
								+ ', ' + right + ')');
					}
					break;
				case 'UpdateExpression':
				case 'AssignmentExpression':
					var parentType = parent && parent.type;
					if (!(
							parentType === 'ForStatement'
							|| parentType === 'BinaryExpression'
								&& /^[=!<>]/.test(parent.operator)
							|| parentType === 'MemberExpression' && parent.computed
					)) {
						if (node.type === 'UpdateExpression') {
							var arg = getCode(node.argument),
								exp = '__$__(' + arg + ', "' + node.operator[0]
										+ '", 1)',
								str = arg + ' = ' + exp;
							if (!node.prefix
									&& (parentType === 'AssignmentExpression'
										|| parentType === 'VariableDeclarator')) {
								if (getCode(parent.left || parent.id) === arg)
									str = exp;
								str = arg + '; ' + str;
							}
							replaceCode(node, str);
						} else {
							if (/^.=$/.test(node.operator)
									&& node.left.type !== 'Literal') {
								var left = getCode(node.left),
									right = getCode(node.right);
								replaceCode(node, left + ' = __$__(' + left + ', "'
										+ node.operator[0] + '", ' + right + ')');
							}
						}
					}
					break;
				}
			}

			function encodeVLQ(value) {
				var res = '',
					base64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
				value = (Math.abs(value) << 1) + (value < 0 ? 1 : 0);
				while (value || !res) {
					var next = value & (32 - 1);
					value >>= 5;
					if (value)
						next |= 32;
					res += base64[next];
				}
				return res;
			}

			var url = options.url || '',
				agent = paper.agent,
				version = agent.versionNumber,
				offsetCode = false,
				sourceMaps = options.sourceMaps,
				source = options.source || code,
				lineBreaks = /\r\n|\n|\r/mg,
				offset = options.offset || 0,
				map;
			if (sourceMaps && (agent.chrome && version >= 30
					|| agent.webkit && version >= 537.76
					|| agent.firefox && version >= 23
					|| agent.node)) {
				if (agent.node) {
					offset -= 2;
				} else if (window && url && !window.location.href.indexOf(url)) {
					var html = document.getElementsByTagName('html')[0].innerHTML;
					offset = html.substr(0, html.indexOf(code) + 1).match(
							lineBreaks).length + 1;
				}
				offsetCode = offset > 0 && !(
						agent.chrome && version >= 36 ||
						agent.safari && version >= 600 ||
						agent.firefox && version >= 40 ||
						agent.node);
				var mappings = ['AA' + encodeVLQ(offsetCode ? 0 : offset) + 'A'];
				mappings.length = (code.match(lineBreaks) || []).length + 1
						+ (offsetCode ? offset : 0);
				map = {
					version: 3,
					file: url,
					names:[],
					mappings: mappings.join(';AACA'),
					sourceRoot: '',
					sources: [url],
					sourcesContent: [source]
				};
			}
			walkAST(parse(code, { ranges: true }));
			if (map) {
				if (offsetCode) {
					code = new Array(offset + 1).join('\n') + code;
				}
				if (/^(inline|both)$/.test(sourceMaps)) {
					code += "\n//# sourceMappingURL=data:application/json;base64,"
							+ window.btoa(unescape(encodeURIComponent(
								JSON.stringify(map))));
				}
				code += "\n//# sourceURL=" + (url || 'paperscript');
			}
			return {
				url: url,
				source: source,
				code: code,
				map: map
			};
		}

		function execute(code, scope, options) {
			paper = scope;
			var view = scope.getView(),
				tool = /\btool\.\w+|\s+on(?:Key|Mouse)(?:Up|Down|Move|Drag)\b/
						.test(code) && !/\bnew\s+Tool\b/.test(code)
							? new Tool() : null,
				toolHandlers = tool ? tool._events : [],
				handlers = ['onFrame', 'onResize'].concat(toolHandlers),
				params = [],
				args = [],
				func,
				compiled = typeof code === 'object' ? code : compile(code, options);
			code = compiled.code;
			function expose(scope, hidden) {
				for (var key in scope) {
					if ((hidden || !/^_/.test(key)) && new RegExp('([\\b\\s\\W]|^)'
							+ key.replace(/\$/g, '\\$') + '\\b').test(code)) {
						params.push(key);
						args.push(scope[key]);
					}
				}
			}
			expose({ __$__: __$__, $__: $__, paper: scope, view: view, tool: tool },
					true);
			expose(scope);
			handlers = Base.each(handlers, function(key) {
				if (new RegExp('\\s+' + key + '\\b').test(code)) {
					params.push(key);
					this.push(key + ': ' + key);
				}
			}, []).join(', ');
			if (handlers)
				code += '\nreturn { ' + handlers + ' };';
			var agent = paper.agent;
			if (document && (agent.chrome
					|| agent.firefox && agent.versionNumber < 40)) {
				var script = document.createElement('script'),
					head = document.head || document.getElementsByTagName('head')[0];
				if (agent.firefox)
					code = '\n' + code;
				script.appendChild(document.createTextNode(
					'paper._execute = function(' + params + ') {' + code + '\n}'
				));
				head.appendChild(script);
				func = paper._execute;
				delete paper._execute;
				head.removeChild(script);
			} else {
				func = Function(params, code);
			}
			var res = func.apply(scope, args) || {};
			Base.each(toolHandlers, function(key) {
				var value = res[key];
				if (value)
					tool[key] = value;
			});
			if (view) {
				if (res.onResize)
					view.setOnResize(res.onResize);
				view.emit('resize', {
					size: view.size,
					delta: new Point()
				});
				if (res.onFrame)
					view.setOnFrame(res.onFrame);
				view.requestUpdate();
			}
			return compiled;
		}

		function loadScript(script) {
			if (/^text\/(?:x-|)paperscript$/.test(script.type)
					&& PaperScope.getAttribute(script, 'ignore') !== 'true') {
				var canvasId = PaperScope.getAttribute(script, 'canvas'),
					canvas = document.getElementById(canvasId),
					src = script.src || script.getAttribute('data-src'),
					async = PaperScope.hasAttribute(script, 'async'),
					scopeAttribute = 'data-paper-scope';
				if (!canvas)
					throw new Error('Unable to find canvas with id "'
							+ canvasId + '"');
				var scope = PaperScope.get(canvas.getAttribute(scopeAttribute))
							|| new PaperScope().setup(canvas);
				canvas.setAttribute(scopeAttribute, scope._id);
				if (src) {
					Http.request({
						url: src,
						async: async,
						mimeType: 'text/plain',
						onLoad: function(code) {
							execute(code, scope, src);
						}
					});
				} else {
					execute(script.innerHTML, scope, script.baseURI);
				}
				script.setAttribute('data-paper-ignore', 'true');
				return scope;
			}
		}

		function loadAll() {
			Base.each(document && document.getElementsByTagName('script'),
					loadScript);
		}

		function load(script) {
			return script ? loadScript(script) : loadAll();
		}

		if (window) {
			if (document.readyState === 'complete') {
				setTimeout(loadAll);
			} else {
				DomEvent.add(window, { load: loadAll });
			}
		}

		return {
			compile: compile,
			execute: execute,
			load: load,
			parse: parse
		};

	}.call(this);

	paper = new (PaperScope.inject(Base.exports, {
		enumerable: true,
		Base: Base,
		Numerical: Numerical,
		Key: Key,
		DomEvent: DomEvent,
		DomElement: DomElement,
		document: document,
		window: window,
		Symbol: SymbolDefinition,
		PlacedSymbol: SymbolItem
	}))();

	if (paper.agent.node)
		__webpack_require__(5)(paper);

	if (true) {
		!(__WEBPACK_AMD_DEFINE_FACTORY__ = (paper), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	} else if (typeof module === 'object' && module) {
		module.exports = paper;
	}

	return paper;
	}.call(this, typeof self === 'object' ? self : null);

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 4 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 5 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var paper = __webpack_require__(3);
	var getFormFields = __webpack_require__(7);

	var api = __webpack_require__(8);
	var ui = __webpack_require__(10);

	// variable to hold chosen palette color
	var pixelColor = void 0;

	// variable to hold exported svg
	var content = void 0;

	var onPaperSetup = function onPaperSetup() {
	  // Get reference to canvas object:
	  // let canvas = document.getElementById('myCanvas');
	  // Create empty project and view for the canvas:
	  paper.setup('drawing');

	  // set canvas to 256 x 256 pixels
	  var canvasDimension = 256;

	  paper.view.viewSize = (canvasDimension, canvasDimension);

	  // define the grid
	  var drawGridRects = function drawGridRects(gridWidth, gridHeight, canvasSize) {
	    var widthPixels = canvasSize.width / gridWidth;
	    var heightPixels = canvasSize.height / gridHeight;
	    for (var i = 0; i < gridWidth; i++) {
	      for (var j = 0; j < gridHeight; j++) {
	        var paperPixel = new paper.Path.Circle(canvasSize.left + (i + 0.5) * widthPixels, canvasSize.top + (j + 0.5) * heightPixels, widthPixels / 2); //, heightPixels);
	        paperPixel.strokeColor = '#cccccc';
	        paperPixel.fillColor = 'white';
	      }
	    }
	  };

	  // creates the grid
	  drawGridRects(16, 16, paper.view.bounds);

	  // function to change fillColor of drawing canvas items
	  paper.view.onClick = function (event) {
	    if (!pixelColor) {
	      return;
	    }
	    var i = paper.project.hitTest(event.point).item.index;
	    paper.project.activeLayer.children[i].fillColor = pixelColor;
	  };

	  // draws the view
	  paper.view.draw();
	};

	var onGetPaletteColor = function onGetPaletteColor(event) {
	  pixelColor = $(event.target).css('background-color');
	};

	var onGetAllPosts = function onGetAllPosts(event) {
	  event.preventDefault();

	  api.indexPosts().done(ui.displayPosts).fail(ui.failure);
	};

	var onGetSinglePost = function onGetSinglePost(event) {
	  event.preventDefault();

	  var title = getFormFields(event.target).title;
	  var id = $('.title:contains(' + title + ')').data('id');

	  api.showPost(id).done(ui.displayPosts).fail(ui.failure);
	};

	var onCreatePost = function onCreatePost(event) {
	  event.preventDefault();

	  var title = getFormFields(event.target).title;
	  content = paper.project.exportJSON({ asString: true });

	  var data = {
	    "post": {
	      "title": title,
	      "content": content
	    }
	  };

	  api.createPost(data).then(ui.success).then(api.indexPosts).then(ui.displayPosts).catch(ui.failure);
	};

	var onMoveToCanvas = function onMoveToCanvas(event) {
	  event.preventDefault();

	  var id = $(event.target).data('id');
	  var content = $('#feed-canvas-' + id).data('content');
	  paper.projects[0].importJSON(content);
	  $('#drawing').data('id', id);
	  $('#drawing').data('content', content);
	};

	var onUpdatePost = function onUpdatePost(event) {
	  event.preventDefault();

	  var id = $('#drawing').data('id');
	  var content = paper.project.exportJSON({ asString: true });

	  var data = {
	    "post": {
	      "content": content
	    }
	  };

	  api.updatePost(id, data).then(ui.success).then(api.indexPosts).then(ui.displayPosts).catch(ui.failure);
	};

	var onDeletePost = function onDeletePost(event) {
	  event.preventDefault();

	  var id = $(event.target).data('id');

	  api.deletePost(id).done(ui.deleteSuccess(id)).fail(ui.failure);
	};

	var addHandlers = function addHandlers() {
	  onPaperSetup();
	  $('.palette-item').on('click', onGetPaletteColor);
	  $('.get-posts').on('click', onGetAllPosts);
	  $('.get-single-post').on('submit', onGetSinglePost);
	  $('.create-post').on('submit', onCreatePost);
	  $(document).on('click', '.move-to-canvas', onMoveToCanvas);
	  $('.update-post').on('click', onUpdatePost);
	  $(document).on('click', '.delete-post', onDeletePost);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 7 */
/***/ function(module, exports) {

	'use strict';

	var addFormField = function addFormField(target, names, value) {
	  var name = names.shift();
	  var next = names[0];
	  if (next === '') {
	    // name is an array
	    target[name] = target[name] || [];
	    target[name].push(value);
	  } else if (next) {
	    // name is a parent key
	    target[name] = target[name] || {};
	    addFormField(target[name], names, value);
	  } else {
	    // name is the key for value
	    target[name] = value;
	  }

	  return target;
	};

	var getFormFields = function getFormFields(form) {
	  var target = {};

	  var elements = form.elements || [];
	  for (var i = 0; i < elements.length; i++) {
	    var e = elements[i];
	    if (!e.hasAttribute('name')) {
	      continue;
	    }

	    var type = 'TEXT';
	    switch (e.nodeName.toUpperCase()) {
	      case 'SELECT':
	        type = e.hasAttribute('multiple') ? 'MULTIPLE' : type;
	        break;
	      case 'INPUT':
	        type = e.getAttribute('type').toUpperCase();
	        break;
	    }

	    var names = e.getAttribute('name').split('[').map(function (k) {
	      return k.replace(/]$/, '');
	    });

	    if (type === 'MULTIPLE') {
	      for (var _i = 0; _i < e.length; _i++) {
	        if (e[_i].selected) {
	          addFormField(target, names.slice(), e[_i].value);
	        }
	      }
	    } else if (type !== 'RADIO' && type !== 'CHECKBOX' || e.checked) {
	      addFormField(target, names, e.value);
	    }
	  }

	  return target;
	};

	module.exports = getFormFields;

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var app = __webpack_require__(9);

	var indexPosts = function indexPosts() {
	  return $.ajax({
	    url: app.host + '/posts',
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    }
	  });
	};

	var showPost = function showPost(data) {
	  return $.ajax({
	    url: app.host + '/posts/' + data,
	    method: 'GET',
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    }
	  });
	};

	var createPost = function createPost(data) {
	  return new Promise(function (resolve, reject) {
	    return $.ajax({
	      url: app.host + '/posts',
	      method: 'POST',
	      data: data,
	      headers: {
	        Authorization: 'Token token=' + app.user.token
	      },
	      success: function success(response) {
	        resolve(response);
	      },
	      error: function error(_error) {
	        reject(_error);
	      }
	    });
	  });
	};

	var updatePost = function updatePost(id, data) {
	  return new Promise(function (resolve, reject) {
	    return $.ajax({
	      url: app.host + '/posts/' + id,
	      method: 'PATCH',
	      data: data,
	      headers: {
	        Authorization: 'Token token=' + app.user.token
	      },
	      success: function success(response) {
	        resolve(response);
	      },
	      error: function error(_error2) {
	        reject(_error2);
	      }
	    });
	  });
	};

	var deletePost = function deletePost(data) {
	  return $.ajax({
	    url: app.host + '/posts/' + data,
	    method: 'DELETE',
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    }
	  });
	};

	module.exports = {
	  indexPosts: indexPosts,
	  showPost: showPost,
	  createPost: createPost,
	  updatePost: updatePost,
	  deletePost: deletePost
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 9 */
/***/ function(module, exports) {

	'use strict';

	var app = {
	  host: 'https://dot-matrix.herokuapp.com'
	  // host: 'http://localhost:3000'
	};

	module.exports = app;

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var app = __webpack_require__(9);
	var paper = __webpack_require__(3);

	var success = function success(data) {
	  if (data) {
	    console.log(data);
	  } else {
	    console.log('Success');
	  }
	};

	var failure = function failure(error) {
	  console.error(error);
	};

	var displayPosts = function displayPosts(data) {
	  $('form').trigger('reset');
	  $('.get-single-post').show();

	  if (data.post) {
	    $('.get-single-post').hide();
	    data.posts = [data.post];
	  }

	  app.posts = data.posts;

	  paper.projects.forEach(function (project, i) {
	    if (i !== 0) {
	      project.remove();
	    }
	  });

	  $('.feed').html('');
	  var postListingTemplate = __webpack_require__(11);
	  $('.feed').append(postListingTemplate(data));

	  data.posts.forEach(function (post) {

	    paper.setup('feed-canvas-' + post.id);

	    paper.project.clear();
	    var canvasDimension = 256;
	    paper.view.viewSize = (canvasDimension, canvasDimension);

	    paper.project.importJSON($('#feed-canvas-' + post.id).data('content'));
	  });

	  paper.projects[0].activate();
	};

	var deleteSuccess = function deleteSuccess(data) {

	  paper.projects.forEach(function (project) {
	    console.log(project._view._id);

	    if (project._view._id === 'feed-canvas-' + data) {
	      project.remove();
	    }
	  });

	  $('.post[data-id="' + data + '"]').remove();
	};

	module.exports = {
	  success: success,
	  failure: failure,
	  displayPosts: displayPosts,
	  deleteSuccess: deleteSuccess
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var Handlebars = __webpack_require__(12);
	function __default(obj) { return obj && (obj.__esModule ? obj["default"] : obj); }
	module.exports = (Handlebars["default"] || Handlebars).template({"1":function(container,depth0,helpers,partials,data) {
	    var helper, alias1=depth0 != null ? depth0 : {}, alias2=helpers.helperMissing, alias3="function", alias4=container.escapeExpression;

	  return "  <div class=\"col-xs-12 post\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">\n    <div class=\"row\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">\n      <h2 class=\"title\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">"
	    + alias4(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"title","hash":{},"data":data}) : helper)))
	    + "</h2>\n      <canvas id=\"feed-canvas-"
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + "\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + " data-content="
	    + alias4(((helper = (helper = helpers.content || (depth0 != null ? depth0.content : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"content","hash":{},"data":data}) : helper)))
	    + "></canvas>\n    </div>\n    <div class=\"row\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">\n      <div class=\"col-xs-1\">\n      </div>\n      <div class=\"col-xs-10\">\n        <button class=\"btn btn-primary drawing-actions move-to-canvas\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">Move this to the canvas</button>\n        <button class=\"btn btn-danger drawing-actions delete-post\" data-id="
	    + alias4(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data}) : helper)))
	    + ">Delete</button>\n      </div>\n      <div class=\"col-xs-1\">\n      </div>\n    </div>\n  </div>\n";
	},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
	    var stack1;

	  return ((stack1 = helpers.each.call(depth0 != null ? depth0 : {},(depth0 != null ? depth0.posts : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "");
	},"useData":true});

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	// Create a simple path alias to allow browserify to resolve
	// the runtime on a supported path.
	module.exports = __webpack_require__(13)['default'];


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _handlebarsBase = __webpack_require__(14);

	var base = _interopRequireWildcard(_handlebarsBase);

	// Each of these augment the Handlebars object. No need to setup here.
	// (This is done to easily share code between commonjs and browse envs)

	var _handlebarsSafeString = __webpack_require__(28);

	var _handlebarsSafeString2 = _interopRequireDefault(_handlebarsSafeString);

	var _handlebarsException = __webpack_require__(16);

	var _handlebarsException2 = _interopRequireDefault(_handlebarsException);

	var _handlebarsUtils = __webpack_require__(15);

	var Utils = _interopRequireWildcard(_handlebarsUtils);

	var _handlebarsRuntime = __webpack_require__(29);

	var runtime = _interopRequireWildcard(_handlebarsRuntime);

	var _handlebarsNoConflict = __webpack_require__(30);

	var _handlebarsNoConflict2 = _interopRequireDefault(_handlebarsNoConflict);

	// For compatibility and usage outside of module systems, make the Handlebars object a namespace
	function create() {
	  var hb = new base.HandlebarsEnvironment();

	  Utils.extend(hb, base);
	  hb.SafeString = _handlebarsSafeString2['default'];
	  hb.Exception = _handlebarsException2['default'];
	  hb.Utils = Utils;
	  hb.escapeExpression = Utils.escapeExpression;

	  hb.VM = runtime;
	  hb.template = function (spec) {
	    return runtime.template(spec, hb);
	  };

	  return hb;
	}

	var inst = create();
	inst.create = create;

	_handlebarsNoConflict2['default'](inst);

	inst['default'] = inst;

	exports['default'] = inst;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL2xpYi9oYW5kbGViYXJzLnJ1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7OEJBQXNCLG1CQUFtQjs7SUFBN0IsSUFBSTs7Ozs7b0NBSU8sMEJBQTBCOzs7O21DQUMzQix3QkFBd0I7Ozs7K0JBQ3ZCLG9CQUFvQjs7SUFBL0IsS0FBSzs7aUNBQ1Esc0JBQXNCOztJQUFuQyxPQUFPOztvQ0FFSSwwQkFBMEI7Ozs7O0FBR2pELFNBQVMsTUFBTSxHQUFHO0FBQ2hCLE1BQUksRUFBRSxHQUFHLElBQUksSUFBSSxDQUFDLHFCQUFxQixFQUFFLENBQUM7O0FBRTFDLE9BQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQ3ZCLElBQUUsQ0FBQyxVQUFVLG9DQUFhLENBQUM7QUFDM0IsSUFBRSxDQUFDLFNBQVMsbUNBQVksQ0FBQztBQUN6QixJQUFFLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztBQUNqQixJQUFFLENBQUMsZ0JBQWdCLEdBQUcsS0FBSyxDQUFDLGdCQUFnQixDQUFDOztBQUU3QyxJQUFFLENBQUMsRUFBRSxHQUFHLE9BQU8sQ0FBQztBQUNoQixJQUFFLENBQUMsUUFBUSxHQUFHLFVBQVMsSUFBSSxFQUFFO0FBQzNCLFdBQU8sT0FBTyxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsRUFBRSxDQUFDLENBQUM7R0FDbkMsQ0FBQzs7QUFFRixTQUFPLEVBQUUsQ0FBQztDQUNYOztBQUVELElBQUksSUFBSSxHQUFHLE1BQU0sRUFBRSxDQUFDO0FBQ3BCLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDOztBQUVyQixrQ0FBVyxJQUFJLENBQUMsQ0FBQzs7QUFFakIsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLElBQUksQ0FBQzs7cUJBRVIsSUFBSSIsImZpbGUiOiJoYW5kbGViYXJzLnJ1bnRpbWUuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBiYXNlIGZyb20gJy4vaGFuZGxlYmFycy9iYXNlJztcblxuLy8gRWFjaCBvZiB0aGVzZSBhdWdtZW50IHRoZSBIYW5kbGViYXJzIG9iamVjdC4gTm8gbmVlZCB0byBzZXR1cCBoZXJlLlxuLy8gKFRoaXMgaXMgZG9uZSB0byBlYXNpbHkgc2hhcmUgY29kZSBiZXR3ZWVuIGNvbW1vbmpzIGFuZCBicm93c2UgZW52cylcbmltcG9ydCBTYWZlU3RyaW5nIGZyb20gJy4vaGFuZGxlYmFycy9zYWZlLXN0cmluZyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vaGFuZGxlYmFycy9leGNlcHRpb24nO1xuaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi9oYW5kbGViYXJzL3V0aWxzJztcbmltcG9ydCAqIGFzIHJ1bnRpbWUgZnJvbSAnLi9oYW5kbGViYXJzL3J1bnRpbWUnO1xuXG5pbXBvcnQgbm9Db25mbGljdCBmcm9tICcuL2hhbmRsZWJhcnMvbm8tY29uZmxpY3QnO1xuXG4vLyBGb3IgY29tcGF0aWJpbGl0eSBhbmQgdXNhZ2Ugb3V0c2lkZSBvZiBtb2R1bGUgc3lzdGVtcywgbWFrZSB0aGUgSGFuZGxlYmFycyBvYmplY3QgYSBuYW1lc3BhY2VcbmZ1bmN0aW9uIGNyZWF0ZSgpIHtcbiAgbGV0IGhiID0gbmV3IGJhc2UuSGFuZGxlYmFyc0Vudmlyb25tZW50KCk7XG5cbiAgVXRpbHMuZXh0ZW5kKGhiLCBiYXNlKTtcbiAgaGIuU2FmZVN0cmluZyA9IFNhZmVTdHJpbmc7XG4gIGhiLkV4Y2VwdGlvbiA9IEV4Y2VwdGlvbjtcbiAgaGIuVXRpbHMgPSBVdGlscztcbiAgaGIuZXNjYXBlRXhwcmVzc2lvbiA9IFV0aWxzLmVzY2FwZUV4cHJlc3Npb247XG5cbiAgaGIuVk0gPSBydW50aW1lO1xuICBoYi50ZW1wbGF0ZSA9IGZ1bmN0aW9uKHNwZWMpIHtcbiAgICByZXR1cm4gcnVudGltZS50ZW1wbGF0ZShzcGVjLCBoYik7XG4gIH07XG5cbiAgcmV0dXJuIGhiO1xufVxuXG5sZXQgaW5zdCA9IGNyZWF0ZSgpO1xuaW5zdC5jcmVhdGUgPSBjcmVhdGU7XG5cbm5vQ29uZmxpY3QoaW5zdCk7XG5cbmluc3RbJ2RlZmF1bHQnXSA9IGluc3Q7XG5cbmV4cG9ydCBkZWZhdWx0IGluc3Q7XG4iXX0=


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.HandlebarsEnvironment = HandlebarsEnvironment;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(15);

	var _exception = __webpack_require__(16);

	var _exception2 = _interopRequireDefault(_exception);

	var _helpers = __webpack_require__(17);

	var _decorators = __webpack_require__(25);

	var _logger = __webpack_require__(27);

	var _logger2 = _interopRequireDefault(_logger);

	var VERSION = '4.0.5';
	exports.VERSION = VERSION;
	var COMPILER_REVISION = 7;

	exports.COMPILER_REVISION = COMPILER_REVISION;
	var REVISION_CHANGES = {
	  1: '<= 1.0.rc.2', // 1.0.rc.2 is actually rev2 but doesn't report it
	  2: '== 1.0.0-rc.3',
	  3: '== 1.0.0-rc.4',
	  4: '== 1.x.x',
	  5: '== 2.0.0-alpha.x',
	  6: '>= 2.0.0-beta.1',
	  7: '>= 4.0.0'
	};

	exports.REVISION_CHANGES = REVISION_CHANGES;
	var objectType = '[object Object]';

	function HandlebarsEnvironment(helpers, partials, decorators) {
	  this.helpers = helpers || {};
	  this.partials = partials || {};
	  this.decorators = decorators || {};

	  _helpers.registerDefaultHelpers(this);
	  _decorators.registerDefaultDecorators(this);
	}

	HandlebarsEnvironment.prototype = {
	  constructor: HandlebarsEnvironment,

	  logger: _logger2['default'],
	  log: _logger2['default'].log,

	  registerHelper: function registerHelper(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple helpers');
	      }
	      _utils.extend(this.helpers, name);
	    } else {
	      this.helpers[name] = fn;
	    }
	  },
	  unregisterHelper: function unregisterHelper(name) {
	    delete this.helpers[name];
	  },

	  registerPartial: function registerPartial(name, partial) {
	    if (_utils.toString.call(name) === objectType) {
	      _utils.extend(this.partials, name);
	    } else {
	      if (typeof partial === 'undefined') {
	        throw new _exception2['default']('Attempting to register a partial called "' + name + '" as undefined');
	      }
	      this.partials[name] = partial;
	    }
	  },
	  unregisterPartial: function unregisterPartial(name) {
	    delete this.partials[name];
	  },

	  registerDecorator: function registerDecorator(name, fn) {
	    if (_utils.toString.call(name) === objectType) {
	      if (fn) {
	        throw new _exception2['default']('Arg not supported with multiple decorators');
	      }
	      _utils.extend(this.decorators, name);
	    } else {
	      this.decorators[name] = fn;
	    }
	  },
	  unregisterDecorator: function unregisterDecorator(name) {
	    delete this.decorators[name];
	  }
	};

	var log = _logger2['default'].log;

	exports.log = log;
	exports.createFrame = _utils.createFrame;
	exports.logger = _logger2['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2Jhc2UuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7cUJBQTRDLFNBQVM7O3lCQUMvQixhQUFhOzs7O3VCQUNFLFdBQVc7OzBCQUNSLGNBQWM7O3NCQUNuQyxVQUFVOzs7O0FBRXRCLElBQU0sT0FBTyxHQUFHLE9BQU8sQ0FBQzs7QUFDeEIsSUFBTSxpQkFBaUIsR0FBRyxDQUFDLENBQUM7OztBQUU1QixJQUFNLGdCQUFnQixHQUFHO0FBQzlCLEdBQUMsRUFBRSxhQUFhO0FBQ2hCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxlQUFlO0FBQ2xCLEdBQUMsRUFBRSxVQUFVO0FBQ2IsR0FBQyxFQUFFLGtCQUFrQjtBQUNyQixHQUFDLEVBQUUsaUJBQWlCO0FBQ3BCLEdBQUMsRUFBRSxVQUFVO0NBQ2QsQ0FBQzs7O0FBRUYsSUFBTSxVQUFVLEdBQUcsaUJBQWlCLENBQUM7O0FBRTlCLFNBQVMscUJBQXFCLENBQUMsT0FBTyxFQUFFLFFBQVEsRUFBRSxVQUFVLEVBQUU7QUFDbkUsTUFBSSxDQUFDLE9BQU8sR0FBRyxPQUFPLElBQUksRUFBRSxDQUFDO0FBQzdCLE1BQUksQ0FBQyxRQUFRLEdBQUcsUUFBUSxJQUFJLEVBQUUsQ0FBQztBQUMvQixNQUFJLENBQUMsVUFBVSxHQUFHLFVBQVUsSUFBSSxFQUFFLENBQUM7O0FBRW5DLGtDQUF1QixJQUFJLENBQUMsQ0FBQztBQUM3Qix3Q0FBMEIsSUFBSSxDQUFDLENBQUM7Q0FDakM7O0FBRUQscUJBQXFCLENBQUMsU0FBUyxHQUFHO0FBQ2hDLGFBQVcsRUFBRSxxQkFBcUI7O0FBRWxDLFFBQU0scUJBQVE7QUFDZCxLQUFHLEVBQUUsb0JBQU8sR0FBRzs7QUFFZixnQkFBYyxFQUFFLHdCQUFTLElBQUksRUFBRSxFQUFFLEVBQUU7QUFDakMsUUFBSSxnQkFBUyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssVUFBVSxFQUFFO0FBQ3RDLFVBQUksRUFBRSxFQUFFO0FBQUUsY0FBTSwyQkFBYyx5Q0FBeUMsQ0FBQyxDQUFDO09BQUU7QUFDM0Usb0JBQU8sSUFBSSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQztLQUM1QixNQUFNO0FBQ0wsVUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7S0FDekI7R0FDRjtBQUNELGtCQUFnQixFQUFFLDBCQUFTLElBQUksRUFBRTtBQUMvQixXQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDM0I7O0FBRUQsaUJBQWUsRUFBRSx5QkFBUyxJQUFJLEVBQUUsT0FBTyxFQUFFO0FBQ3ZDLFFBQUksZ0JBQVMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLFVBQVUsRUFBRTtBQUN0QyxvQkFBTyxJQUFJLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQzdCLE1BQU07QUFDTCxVQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsRUFBRTtBQUNsQyxjQUFNLHlFQUEwRCxJQUFJLG9CQUFpQixDQUFDO09BQ3ZGO0FBQ0QsVUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsR0FBRyxPQUFPLENBQUM7S0FDL0I7R0FDRjtBQUNELG1CQUFpQixFQUFFLDJCQUFTLElBQUksRUFBRTtBQUNoQyxXQUFPLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDNUI7O0FBRUQsbUJBQWlCLEVBQUUsMkJBQVMsSUFBSSxFQUFFLEVBQUUsRUFBRTtBQUNwQyxRQUFJLGdCQUFTLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxVQUFVLEVBQUU7QUFDdEMsVUFBSSxFQUFFLEVBQUU7QUFBRSxjQUFNLDJCQUFjLDRDQUE0QyxDQUFDLENBQUM7T0FBRTtBQUM5RSxvQkFBTyxJQUFJLENBQUMsVUFBVSxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQy9CLE1BQU07QUFDTCxVQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztLQUM1QjtHQUNGO0FBQ0QscUJBQW1CLEVBQUUsNkJBQVMsSUFBSSxFQUFFO0FBQ2xDLFdBQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUM5QjtDQUNGLENBQUM7O0FBRUssSUFBSSxHQUFHLEdBQUcsb0JBQU8sR0FBRyxDQUFDOzs7UUFFcEIsV0FBVztRQUFFLE1BQU0iLCJmaWxlIjoiYmFzZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Y3JlYXRlRnJhbWUsIGV4dGVuZCwgdG9TdHJpbmd9IGZyb20gJy4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuL2V4Y2VwdGlvbic7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdEhlbHBlcnN9IGZyb20gJy4vaGVscGVycyc7XG5pbXBvcnQge3JlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnN9IGZyb20gJy4vZGVjb3JhdG9ycyc7XG5pbXBvcnQgbG9nZ2VyIGZyb20gJy4vbG9nZ2VyJztcblxuZXhwb3J0IGNvbnN0IFZFUlNJT04gPSAnNC4wLjUnO1xuZXhwb3J0IGNvbnN0IENPTVBJTEVSX1JFVklTSU9OID0gNztcblxuZXhwb3J0IGNvbnN0IFJFVklTSU9OX0NIQU5HRVMgPSB7XG4gIDE6ICc8PSAxLjAucmMuMicsIC8vIDEuMC5yYy4yIGlzIGFjdHVhbGx5IHJldjIgYnV0IGRvZXNuJ3QgcmVwb3J0IGl0XG4gIDI6ICc9PSAxLjAuMC1yYy4zJyxcbiAgMzogJz09IDEuMC4wLXJjLjQnLFxuICA0OiAnPT0gMS54LngnLFxuICA1OiAnPT0gMi4wLjAtYWxwaGEueCcsXG4gIDY6ICc+PSAyLjAuMC1iZXRhLjEnLFxuICA3OiAnPj0gNC4wLjAnXG59O1xuXG5jb25zdCBvYmplY3RUeXBlID0gJ1tvYmplY3QgT2JqZWN0XSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBIYW5kbGViYXJzRW52aXJvbm1lbnQoaGVscGVycywgcGFydGlhbHMsIGRlY29yYXRvcnMpIHtcbiAgdGhpcy5oZWxwZXJzID0gaGVscGVycyB8fCB7fTtcbiAgdGhpcy5wYXJ0aWFscyA9IHBhcnRpYWxzIHx8IHt9O1xuICB0aGlzLmRlY29yYXRvcnMgPSBkZWNvcmF0b3JzIHx8IHt9O1xuXG4gIHJlZ2lzdGVyRGVmYXVsdEhlbHBlcnModGhpcyk7XG4gIHJlZ2lzdGVyRGVmYXVsdERlY29yYXRvcnModGhpcyk7XG59XG5cbkhhbmRsZWJhcnNFbnZpcm9ubWVudC5wcm90b3R5cGUgPSB7XG4gIGNvbnN0cnVjdG9yOiBIYW5kbGViYXJzRW52aXJvbm1lbnQsXG5cbiAgbG9nZ2VyOiBsb2dnZXIsXG4gIGxvZzogbG9nZ2VyLmxvZyxcblxuICByZWdpc3RlckhlbHBlcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgaGVscGVycycpOyB9XG4gICAgICBleHRlbmQodGhpcy5oZWxwZXJzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5oZWxwZXJzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVySGVscGVyOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuaGVscGVyc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUsIHBhcnRpYWwpIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgZXh0ZW5kKHRoaXMucGFydGlhbHMsIG5hbWUpO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZiAodHlwZW9mIHBhcnRpYWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oYEF0dGVtcHRpbmcgdG8gcmVnaXN0ZXIgYSBwYXJ0aWFsIGNhbGxlZCBcIiR7bmFtZX1cIiBhcyB1bmRlZmluZWRgKTtcbiAgICAgIH1cbiAgICAgIHRoaXMucGFydGlhbHNbbmFtZV0gPSBwYXJ0aWFsO1xuICAgIH1cbiAgfSxcbiAgdW5yZWdpc3RlclBhcnRpYWw6IGZ1bmN0aW9uKG5hbWUpIHtcbiAgICBkZWxldGUgdGhpcy5wYXJ0aWFsc1tuYW1lXTtcbiAgfSxcblxuICByZWdpc3RlckRlY29yYXRvcjogZnVuY3Rpb24obmFtZSwgZm4pIHtcbiAgICBpZiAodG9TdHJpbmcuY2FsbChuYW1lKSA9PT0gb2JqZWN0VHlwZSkge1xuICAgICAgaWYgKGZuKSB7IHRocm93IG5ldyBFeGNlcHRpb24oJ0FyZyBub3Qgc3VwcG9ydGVkIHdpdGggbXVsdGlwbGUgZGVjb3JhdG9ycycpOyB9XG4gICAgICBleHRlbmQodGhpcy5kZWNvcmF0b3JzLCBuYW1lKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5kZWNvcmF0b3JzW25hbWVdID0gZm47XG4gICAgfVxuICB9LFxuICB1bnJlZ2lzdGVyRGVjb3JhdG9yOiBmdW5jdGlvbihuYW1lKSB7XG4gICAgZGVsZXRlIHRoaXMuZGVjb3JhdG9yc1tuYW1lXTtcbiAgfVxufTtcblxuZXhwb3J0IGxldCBsb2cgPSBsb2dnZXIubG9nO1xuXG5leHBvcnQge2NyZWF0ZUZyYW1lLCBsb2dnZXJ9O1xuIl19


/***/ },
/* 15 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;
	exports.extend = extend;
	exports.indexOf = indexOf;
	exports.escapeExpression = escapeExpression;
	exports.isEmpty = isEmpty;
	exports.createFrame = createFrame;
	exports.blockParams = blockParams;
	exports.appendContextPath = appendContextPath;
	var escape = {
	  '&': '&amp;',
	  '<': '&lt;',
	  '>': '&gt;',
	  '"': '&quot;',
	  "'": '&#x27;',
	  '`': '&#x60;',
	  '=': '&#x3D;'
	};

	var badChars = /[&<>"'`=]/g,
	    possible = /[&<>"'`=]/;

	function escapeChar(chr) {
	  return escape[chr];
	}

	function extend(obj /* , ...source */) {
	  for (var i = 1; i < arguments.length; i++) {
	    for (var key in arguments[i]) {
	      if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
	        obj[key] = arguments[i][key];
	      }
	    }
	  }

	  return obj;
	}

	var toString = Object.prototype.toString;

	exports.toString = toString;
	// Sourced from lodash
	// https://github.com/bestiejs/lodash/blob/master/LICENSE.txt
	/* eslint-disable func-style */
	var isFunction = function isFunction(value) {
	  return typeof value === 'function';
	};
	// fallback for older versions of Chrome and Safari
	/* istanbul ignore next */
	if (isFunction(/x/)) {
	  exports.isFunction = isFunction = function (value) {
	    return typeof value === 'function' && toString.call(value) === '[object Function]';
	  };
	}
	exports.isFunction = isFunction;

	/* eslint-enable func-style */

	/* istanbul ignore next */
	var isArray = Array.isArray || function (value) {
	  return value && typeof value === 'object' ? toString.call(value) === '[object Array]' : false;
	};

	exports.isArray = isArray;
	// Older IE versions do not directly support indexOf so we must implement our own, sadly.

	function indexOf(array, value) {
	  for (var i = 0, len = array.length; i < len; i++) {
	    if (array[i] === value) {
	      return i;
	    }
	  }
	  return -1;
	}

	function escapeExpression(string) {
	  if (typeof string !== 'string') {
	    // don't escape SafeStrings, since they're already safe
	    if (string && string.toHTML) {
	      return string.toHTML();
	    } else if (string == null) {
	      return '';
	    } else if (!string) {
	      return string + '';
	    }

	    // Force a string conversion as this will be done by the append regardless and
	    // the regex test will do this transparently behind the scenes, causing issues if
	    // an object's to string has escaped characters in it.
	    string = '' + string;
	  }

	  if (!possible.test(string)) {
	    return string;
	  }
	  return string.replace(badChars, escapeChar);
	}

	function isEmpty(value) {
	  if (!value && value !== 0) {
	    return true;
	  } else if (isArray(value) && value.length === 0) {
	    return true;
	  } else {
	    return false;
	  }
	}

	function createFrame(object) {
	  var frame = extend({}, object);
	  frame._parent = object;
	  return frame;
	}

	function blockParams(params, ids) {
	  params.path = ids;
	  return params;
	}

	function appendContextPath(contextPath, id) {
	  return (contextPath ? contextPath + '.' : '') + id;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3V0aWxzLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQSxJQUFNLE1BQU0sR0FBRztBQUNiLEtBQUcsRUFBRSxPQUFPO0FBQ1osS0FBRyxFQUFFLE1BQU07QUFDWCxLQUFHLEVBQUUsTUFBTTtBQUNYLEtBQUcsRUFBRSxRQUFRO0FBQ2IsS0FBRyxFQUFFLFFBQVE7QUFDYixLQUFHLEVBQUUsUUFBUTtBQUNiLEtBQUcsRUFBRSxRQUFRO0NBQ2QsQ0FBQzs7QUFFRixJQUFNLFFBQVEsR0FBRyxZQUFZO0lBQ3ZCLFFBQVEsR0FBRyxXQUFXLENBQUM7O0FBRTdCLFNBQVMsVUFBVSxDQUFDLEdBQUcsRUFBRTtBQUN2QixTQUFPLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztDQUNwQjs7QUFFTSxTQUFTLE1BQU0sQ0FBQyxHQUFHLG9CQUFtQjtBQUMzQyxPQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN6QyxTQUFLLElBQUksR0FBRyxJQUFJLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUM1QixVQUFJLE1BQU0sQ0FBQyxTQUFTLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxDQUFDLEVBQUU7QUFDM0QsV0FBRyxDQUFDLEdBQUcsQ0FBQyxHQUFHLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUM5QjtLQUNGO0dBQ0Y7O0FBRUQsU0FBTyxHQUFHLENBQUM7Q0FDWjs7QUFFTSxJQUFJLFFBQVEsR0FBRyxNQUFNLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQzs7Ozs7O0FBS2hELElBQUksVUFBVSxHQUFHLG9CQUFTLEtBQUssRUFBRTtBQUMvQixTQUFPLE9BQU8sS0FBSyxLQUFLLFVBQVUsQ0FBQztDQUNwQyxDQUFDOzs7QUFHRixJQUFJLFVBQVUsQ0FBQyxHQUFHLENBQUMsRUFBRTtBQUNuQixVQUlNLFVBQVUsR0FKaEIsVUFBVSxHQUFHLFVBQVMsS0FBSyxFQUFFO0FBQzNCLFdBQU8sT0FBTyxLQUFLLEtBQUssVUFBVSxJQUFJLFFBQVEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssbUJBQW1CLENBQUM7R0FDcEYsQ0FBQztDQUNIO1FBQ08sVUFBVSxHQUFWLFVBQVU7Ozs7O0FBSVgsSUFBTSxPQUFPLEdBQUcsS0FBSyxDQUFDLE9BQU8sSUFBSSxVQUFTLEtBQUssRUFBRTtBQUN0RCxTQUFPLEFBQUMsS0FBSyxJQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsR0FBSSxRQUFRLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLGdCQUFnQixHQUFHLEtBQUssQ0FBQztDQUNqRyxDQUFDOzs7OztBQUdLLFNBQVMsT0FBTyxDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7QUFDcEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsR0FBRyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLEdBQUcsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUNoRCxRQUFJLEtBQUssQ0FBQyxDQUFDLENBQUMsS0FBSyxLQUFLLEVBQUU7QUFDdEIsYUFBTyxDQUFDLENBQUM7S0FDVjtHQUNGO0FBQ0QsU0FBTyxDQUFDLENBQUMsQ0FBQztDQUNYOztBQUdNLFNBQVMsZ0JBQWdCLENBQUMsTUFBTSxFQUFFO0FBQ3ZDLE1BQUksT0FBTyxNQUFNLEtBQUssUUFBUSxFQUFFOztBQUU5QixRQUFJLE1BQU0sSUFBSSxNQUFNLENBQUMsTUFBTSxFQUFFO0FBQzNCLGFBQU8sTUFBTSxDQUFDLE1BQU0sRUFBRSxDQUFDO0tBQ3hCLE1BQU0sSUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ3pCLGFBQU8sRUFBRSxDQUFDO0tBQ1gsTUFBTSxJQUFJLENBQUMsTUFBTSxFQUFFO0FBQ2xCLGFBQU8sTUFBTSxHQUFHLEVBQUUsQ0FBQztLQUNwQjs7Ozs7QUFLRCxVQUFNLEdBQUcsRUFBRSxHQUFHLE1BQU0sQ0FBQztHQUN0Qjs7QUFFRCxNQUFJLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsRUFBRTtBQUFFLFdBQU8sTUFBTSxDQUFDO0dBQUU7QUFDOUMsU0FBTyxNQUFNLENBQUMsT0FBTyxDQUFDLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQztDQUM3Qzs7QUFFTSxTQUFTLE9BQU8sQ0FBQyxLQUFLLEVBQUU7QUFDN0IsTUFBSSxDQUFDLEtBQUssSUFBSSxLQUFLLEtBQUssQ0FBQyxFQUFFO0FBQ3pCLFdBQU8sSUFBSSxDQUFDO0dBQ2IsTUFBTSxJQUFJLE9BQU8sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxLQUFLLENBQUMsRUFBRTtBQUMvQyxXQUFPLElBQUksQ0FBQztHQUNiLE1BQU07QUFDTCxXQUFPLEtBQUssQ0FBQztHQUNkO0NBQ0Y7O0FBRU0sU0FBUyxXQUFXLENBQUMsTUFBTSxFQUFFO0FBQ2xDLE1BQUksS0FBSyxHQUFHLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDL0IsT0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLENBQUM7QUFDdkIsU0FBTyxLQUFLLENBQUM7Q0FDZDs7QUFFTSxTQUFTLFdBQVcsQ0FBQyxNQUFNLEVBQUUsR0FBRyxFQUFFO0FBQ3ZDLFFBQU0sQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDO0FBQ2xCLFNBQU8sTUFBTSxDQUFDO0NBQ2Y7O0FBRU0sU0FBUyxpQkFBaUIsQ0FBQyxXQUFXLEVBQUUsRUFBRSxFQUFFO0FBQ2pELFNBQU8sQ0FBQyxXQUFXLEdBQUcsV0FBVyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUEsR0FBSSxFQUFFLENBQUM7Q0FDcEQiLCJmaWxlIjoidXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBlc2NhcGUgPSB7XG4gICcmJzogJyZhbXA7JyxcbiAgJzwnOiAnJmx0OycsXG4gICc+JzogJyZndDsnLFxuICAnXCInOiAnJnF1b3Q7JyxcbiAgXCInXCI6ICcmI3gyNzsnLFxuICAnYCc6ICcmI3g2MDsnLFxuICAnPSc6ICcmI3gzRDsnXG59O1xuXG5jb25zdCBiYWRDaGFycyA9IC9bJjw+XCInYD1dL2csXG4gICAgICBwb3NzaWJsZSA9IC9bJjw+XCInYD1dLztcblxuZnVuY3Rpb24gZXNjYXBlQ2hhcihjaHIpIHtcbiAgcmV0dXJuIGVzY2FwZVtjaHJdO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZXh0ZW5kKG9iai8qICwgLi4uc291cmNlICovKSB7XG4gIGZvciAobGV0IGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgZm9yIChsZXQga2V5IGluIGFyZ3VtZW50c1tpXSkge1xuICAgICAgaWYgKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbChhcmd1bWVudHNbaV0sIGtleSkpIHtcbiAgICAgICAgb2JqW2tleV0gPSBhcmd1bWVudHNbaV1ba2V5XTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICByZXR1cm4gb2JqO1xufVxuXG5leHBvcnQgbGV0IHRvU3RyaW5nID0gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZztcblxuLy8gU291cmNlZCBmcm9tIGxvZGFzaFxuLy8gaHR0cHM6Ly9naXRodWIuY29tL2Jlc3RpZWpzL2xvZGFzaC9ibG9iL21hc3Rlci9MSUNFTlNFLnR4dFxuLyogZXNsaW50LWRpc2FibGUgZnVuYy1zdHlsZSAqL1xubGV0IGlzRnVuY3Rpb24gPSBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gdHlwZW9mIHZhbHVlID09PSAnZnVuY3Rpb24nO1xufTtcbi8vIGZhbGxiYWNrIGZvciBvbGRlciB2ZXJzaW9ucyBvZiBDaHJvbWUgYW5kIFNhZmFyaVxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmlmIChpc0Z1bmN0aW9uKC94LykpIHtcbiAgaXNGdW5jdGlvbiA9IGZ1bmN0aW9uKHZhbHVlKSB7XG4gICAgcmV0dXJuIHR5cGVvZiB2YWx1ZSA9PT0gJ2Z1bmN0aW9uJyAmJiB0b1N0cmluZy5jYWxsKHZhbHVlKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfTtcbn1cbmV4cG9ydCB7aXNGdW5jdGlvbn07XG4vKiBlc2xpbnQtZW5hYmxlIGZ1bmMtc3R5bGUgKi9cblxuLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbmV4cG9ydCBjb25zdCBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbih2YWx1ZSkge1xuICByZXR1cm4gKHZhbHVlICYmIHR5cGVvZiB2YWx1ZSA9PT0gJ29iamVjdCcpID8gdG9TdHJpbmcuY2FsbCh2YWx1ZSkgPT09ICdbb2JqZWN0IEFycmF5XScgOiBmYWxzZTtcbn07XG5cbi8vIE9sZGVyIElFIHZlcnNpb25zIGRvIG5vdCBkaXJlY3RseSBzdXBwb3J0IGluZGV4T2Ygc28gd2UgbXVzdCBpbXBsZW1lbnQgb3VyIG93biwgc2FkbHkuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXhPZihhcnJheSwgdmFsdWUpIHtcbiAgZm9yIChsZXQgaSA9IDAsIGxlbiA9IGFycmF5Lmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKGFycmF5W2ldID09PSB2YWx1ZSkge1xuICAgICAgcmV0dXJuIGk7XG4gICAgfVxuICB9XG4gIHJldHVybiAtMTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gZXNjYXBlRXhwcmVzc2lvbihzdHJpbmcpIHtcbiAgaWYgKHR5cGVvZiBzdHJpbmcgIT09ICdzdHJpbmcnKSB7XG4gICAgLy8gZG9uJ3QgZXNjYXBlIFNhZmVTdHJpbmdzLCBzaW5jZSB0aGV5J3JlIGFscmVhZHkgc2FmZVxuICAgIGlmIChzdHJpbmcgJiYgc3RyaW5nLnRvSFRNTCkge1xuICAgICAgcmV0dXJuIHN0cmluZy50b0hUTUwoKTtcbiAgICB9IGVsc2UgaWYgKHN0cmluZyA9PSBudWxsKSB7XG4gICAgICByZXR1cm4gJyc7XG4gICAgfSBlbHNlIGlmICghc3RyaW5nKSB7XG4gICAgICByZXR1cm4gc3RyaW5nICsgJyc7XG4gICAgfVxuXG4gICAgLy8gRm9yY2UgYSBzdHJpbmcgY29udmVyc2lvbiBhcyB0aGlzIHdpbGwgYmUgZG9uZSBieSB0aGUgYXBwZW5kIHJlZ2FyZGxlc3MgYW5kXG4gICAgLy8gdGhlIHJlZ2V4IHRlc3Qgd2lsbCBkbyB0aGlzIHRyYW5zcGFyZW50bHkgYmVoaW5kIHRoZSBzY2VuZXMsIGNhdXNpbmcgaXNzdWVzIGlmXG4gICAgLy8gYW4gb2JqZWN0J3MgdG8gc3RyaW5nIGhhcyBlc2NhcGVkIGNoYXJhY3RlcnMgaW4gaXQuXG4gICAgc3RyaW5nID0gJycgKyBzdHJpbmc7XG4gIH1cblxuICBpZiAoIXBvc3NpYmxlLnRlc3Qoc3RyaW5nKSkgeyByZXR1cm4gc3RyaW5nOyB9XG4gIHJldHVybiBzdHJpbmcucmVwbGFjZShiYWRDaGFycywgZXNjYXBlQ2hhcik7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0VtcHR5KHZhbHVlKSB7XG4gIGlmICghdmFsdWUgJiYgdmFsdWUgIT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIGlmIChpc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5sZW5ndGggPT09IDApIHtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGNyZWF0ZUZyYW1lKG9iamVjdCkge1xuICBsZXQgZnJhbWUgPSBleHRlbmQoe30sIG9iamVjdCk7XG4gIGZyYW1lLl9wYXJlbnQgPSBvYmplY3Q7XG4gIHJldHVybiBmcmFtZTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJsb2NrUGFyYW1zKHBhcmFtcywgaWRzKSB7XG4gIHBhcmFtcy5wYXRoID0gaWRzO1xuICByZXR1cm4gcGFyYW1zO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gYXBwZW5kQ29udGV4dFBhdGgoY29udGV4dFBhdGgsIGlkKSB7XG4gIHJldHVybiAoY29udGV4dFBhdGggPyBjb250ZXh0UGF0aCArICcuJyA6ICcnKSArIGlkO1xufVxuIl19


/***/ },
/* 16 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	var errorProps = ['description', 'fileName', 'lineNumber', 'message', 'name', 'number', 'stack'];

	function Exception(message, node) {
	  var loc = node && node.loc,
	      line = undefined,
	      column = undefined;
	  if (loc) {
	    line = loc.start.line;
	    column = loc.start.column;

	    message += ' - ' + line + ':' + column;
	  }

	  var tmp = Error.prototype.constructor.call(this, message);

	  // Unfortunately errors are not enumerable in Chrome (at least), so `for prop in tmp` doesn't work.
	  for (var idx = 0; idx < errorProps.length; idx++) {
	    this[errorProps[idx]] = tmp[errorProps[idx]];
	  }

	  /* istanbul ignore else */
	  if (Error.captureStackTrace) {
	    Error.captureStackTrace(this, Exception);
	  }

	  if (loc) {
	    this.lineNumber = line;
	    this.column = column;
	  }
	}

	Exception.prototype = new Error();

	exports['default'] = Exception;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2V4Y2VwdGlvbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBQ0EsSUFBTSxVQUFVLEdBQUcsQ0FBQyxhQUFhLEVBQUUsVUFBVSxFQUFFLFlBQVksRUFBRSxTQUFTLEVBQUUsTUFBTSxFQUFFLFFBQVEsRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFbkcsU0FBUyxTQUFTLENBQUMsT0FBTyxFQUFFLElBQUksRUFBRTtBQUNoQyxNQUFJLEdBQUcsR0FBRyxJQUFJLElBQUksSUFBSSxDQUFDLEdBQUc7TUFDdEIsSUFBSSxZQUFBO01BQ0osTUFBTSxZQUFBLENBQUM7QUFDWCxNQUFJLEdBQUcsRUFBRTtBQUNQLFFBQUksR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztBQUN0QixVQUFNLEdBQUcsR0FBRyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUM7O0FBRTFCLFdBQU8sSUFBSSxLQUFLLEdBQUcsSUFBSSxHQUFHLEdBQUcsR0FBRyxNQUFNLENBQUM7R0FDeEM7O0FBRUQsTUFBSSxHQUFHLEdBQUcsS0FBSyxDQUFDLFNBQVMsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzs7O0FBRzFELE9BQUssSUFBSSxHQUFHLEdBQUcsQ0FBQyxFQUFFLEdBQUcsR0FBRyxVQUFVLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxFQUFFO0FBQ2hELFFBQUksQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxHQUFHLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7R0FDOUM7OztBQUdELE1BQUksS0FBSyxDQUFDLGlCQUFpQixFQUFFO0FBQzNCLFNBQUssQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUM7R0FDMUM7O0FBRUQsTUFBSSxHQUFHLEVBQUU7QUFDUCxRQUFJLENBQUMsVUFBVSxHQUFHLElBQUksQ0FBQztBQUN2QixRQUFJLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztHQUN0QjtDQUNGOztBQUVELFNBQVMsQ0FBQyxTQUFTLEdBQUcsSUFBSSxLQUFLLEVBQUUsQ0FBQzs7cUJBRW5CLFNBQVMiLCJmaWxlIjoiZXhjZXB0aW9uLmpzIiwic291cmNlc0NvbnRlbnQiOlsiXG5jb25zdCBlcnJvclByb3BzID0gWydkZXNjcmlwdGlvbicsICdmaWxlTmFtZScsICdsaW5lTnVtYmVyJywgJ21lc3NhZ2UnLCAnbmFtZScsICdudW1iZXInLCAnc3RhY2snXTtcblxuZnVuY3Rpb24gRXhjZXB0aW9uKG1lc3NhZ2UsIG5vZGUpIHtcbiAgbGV0IGxvYyA9IG5vZGUgJiYgbm9kZS5sb2MsXG4gICAgICBsaW5lLFxuICAgICAgY29sdW1uO1xuICBpZiAobG9jKSB7XG4gICAgbGluZSA9IGxvYy5zdGFydC5saW5lO1xuICAgIGNvbHVtbiA9IGxvYy5zdGFydC5jb2x1bW47XG5cbiAgICBtZXNzYWdlICs9ICcgLSAnICsgbGluZSArICc6JyArIGNvbHVtbjtcbiAgfVxuXG4gIGxldCB0bXAgPSBFcnJvci5wcm90b3R5cGUuY29uc3RydWN0b3IuY2FsbCh0aGlzLCBtZXNzYWdlKTtcblxuICAvLyBVbmZvcnR1bmF0ZWx5IGVycm9ycyBhcmUgbm90IGVudW1lcmFibGUgaW4gQ2hyb21lIChhdCBsZWFzdCksIHNvIGBmb3IgcHJvcCBpbiB0bXBgIGRvZXNuJ3Qgd29yay5cbiAgZm9yIChsZXQgaWR4ID0gMDsgaWR4IDwgZXJyb3JQcm9wcy5sZW5ndGg7IGlkeCsrKSB7XG4gICAgdGhpc1tlcnJvclByb3BzW2lkeF1dID0gdG1wW2Vycm9yUHJvcHNbaWR4XV07XG4gIH1cblxuICAvKiBpc3RhbmJ1bCBpZ25vcmUgZWxzZSAqL1xuICBpZiAoRXJyb3IuY2FwdHVyZVN0YWNrVHJhY2UpIHtcbiAgICBFcnJvci5jYXB0dXJlU3RhY2tUcmFjZSh0aGlzLCBFeGNlcHRpb24pO1xuICB9XG5cbiAgaWYgKGxvYykge1xuICAgIHRoaXMubGluZU51bWJlciA9IGxpbmU7XG4gICAgdGhpcy5jb2x1bW4gPSBjb2x1bW47XG4gIH1cbn1cblxuRXhjZXB0aW9uLnByb3RvdHlwZSA9IG5ldyBFcnJvcigpO1xuXG5leHBvcnQgZGVmYXVsdCBFeGNlcHRpb247XG4iXX0=


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.registerDefaultHelpers = registerDefaultHelpers;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _helpersBlockHelperMissing = __webpack_require__(18);

	var _helpersBlockHelperMissing2 = _interopRequireDefault(_helpersBlockHelperMissing);

	var _helpersEach = __webpack_require__(19);

	var _helpersEach2 = _interopRequireDefault(_helpersEach);

	var _helpersHelperMissing = __webpack_require__(20);

	var _helpersHelperMissing2 = _interopRequireDefault(_helpersHelperMissing);

	var _helpersIf = __webpack_require__(21);

	var _helpersIf2 = _interopRequireDefault(_helpersIf);

	var _helpersLog = __webpack_require__(22);

	var _helpersLog2 = _interopRequireDefault(_helpersLog);

	var _helpersLookup = __webpack_require__(23);

	var _helpersLookup2 = _interopRequireDefault(_helpersLookup);

	var _helpersWith = __webpack_require__(24);

	var _helpersWith2 = _interopRequireDefault(_helpersWith);

	function registerDefaultHelpers(instance) {
	  _helpersBlockHelperMissing2['default'](instance);
	  _helpersEach2['default'](instance);
	  _helpersHelperMissing2['default'](instance);
	  _helpersIf2['default'](instance);
	  _helpersLog2['default'](instance);
	  _helpersLookup2['default'](instance);
	  _helpersWith2['default'](instance);
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7eUNBQXVDLGdDQUFnQzs7OzsyQkFDOUMsZ0JBQWdCOzs7O29DQUNQLDBCQUEwQjs7Ozt5QkFDckMsY0FBYzs7OzswQkFDYixlQUFlOzs7OzZCQUNaLGtCQUFrQjs7OzsyQkFDcEIsZ0JBQWdCOzs7O0FBRWxDLFNBQVMsc0JBQXNCLENBQUMsUUFBUSxFQUFFO0FBQy9DLHlDQUEyQixRQUFRLENBQUMsQ0FBQztBQUNyQywyQkFBYSxRQUFRLENBQUMsQ0FBQztBQUN2QixvQ0FBc0IsUUFBUSxDQUFDLENBQUM7QUFDaEMseUJBQVcsUUFBUSxDQUFDLENBQUM7QUFDckIsMEJBQVksUUFBUSxDQUFDLENBQUM7QUFDdEIsNkJBQWUsUUFBUSxDQUFDLENBQUM7QUFDekIsMkJBQWEsUUFBUSxDQUFDLENBQUM7Q0FDeEIiLCJmaWxlIjoiaGVscGVycy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCByZWdpc3RlckJsb2NrSGVscGVyTWlzc2luZyBmcm9tICcuL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcnO1xuaW1wb3J0IHJlZ2lzdGVyRWFjaCBmcm9tICcuL2hlbHBlcnMvZWFjaCc7XG5pbXBvcnQgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nIGZyb20gJy4vaGVscGVycy9oZWxwZXItbWlzc2luZyc7XG5pbXBvcnQgcmVnaXN0ZXJJZiBmcm9tICcuL2hlbHBlcnMvaWYnO1xuaW1wb3J0IHJlZ2lzdGVyTG9nIGZyb20gJy4vaGVscGVycy9sb2cnO1xuaW1wb3J0IHJlZ2lzdGVyTG9va3VwIGZyb20gJy4vaGVscGVycy9sb29rdXAnO1xuaW1wb3J0IHJlZ2lzdGVyV2l0aCBmcm9tICcuL2hlbHBlcnMvd2l0aCc7XG5cbmV4cG9ydCBmdW5jdGlvbiByZWdpc3RlckRlZmF1bHRIZWxwZXJzKGluc3RhbmNlKSB7XG4gIHJlZ2lzdGVyQmxvY2tIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJFYWNoKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJIZWxwZXJNaXNzaW5nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJJZihpbnN0YW5jZSk7XG4gIHJlZ2lzdGVyTG9nKGluc3RhbmNlKTtcbiAgcmVnaXN0ZXJMb29rdXAoaW5zdGFuY2UpO1xuICByZWdpc3RlcldpdGgoaW5zdGFuY2UpO1xufVxuIl19


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(15);

	exports['default'] = function (instance) {
	  instance.registerHelper('blockHelperMissing', function (context, options) {
	    var inverse = options.inverse,
	        fn = options.fn;

	    if (context === true) {
	      return fn(this);
	    } else if (context === false || context == null) {
	      return inverse(this);
	    } else if (_utils.isArray(context)) {
	      if (context.length > 0) {
	        if (options.ids) {
	          options.ids = [options.name];
	        }

	        return instance.helpers.each(context, options);
	      } else {
	        return inverse(this);
	      }
	    } else {
	      if (options.data && options.ids) {
	        var data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.name);
	        options = { data: data };
	      }

	      return fn(context, options);
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvYmxvY2staGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBc0QsVUFBVTs7cUJBRWpELFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsb0JBQW9CLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZFLFFBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxPQUFPO1FBQ3pCLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLE9BQU8sS0FBSyxJQUFJLEVBQUU7QUFDcEIsYUFBTyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDakIsTUFBTSxJQUFJLE9BQU8sS0FBSyxLQUFLLElBQUksT0FBTyxJQUFJLElBQUksRUFBRTtBQUMvQyxhQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUN0QixNQUFNLElBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUMzQixVQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO0FBQ3RCLFlBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNmLGlCQUFPLENBQUMsR0FBRyxHQUFHLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQzlCOztBQUVELGVBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO09BQ2hELE1BQU07QUFDTCxlQUFPLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztPQUN0QjtLQUNGLE1BQU07QUFDTCxVQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixZQUFJLElBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDckMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQzdFLGVBQU8sR0FBRyxFQUFDLElBQUksRUFBRSxJQUFJLEVBQUMsQ0FBQztPQUN4Qjs7QUFFRCxhQUFPLEVBQUUsQ0FBQyxPQUFPLEVBQUUsT0FBTyxDQUFDLENBQUM7S0FDN0I7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJibG9jay1oZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGNyZWF0ZUZyYW1lLCBpc0FycmF5fSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVySGVscGVyKCdibG9ja0hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgbGV0IGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmIChjb250ZXh0ID09PSB0cnVlKSB7XG4gICAgICByZXR1cm4gZm4odGhpcyk7XG4gICAgfSBlbHNlIGlmIChjb250ZXh0ID09PSBmYWxzZSB8fCBjb250ZXh0ID09IG51bGwpIHtcbiAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgIH0gZWxzZSBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgaWYgKGNvbnRleHQubGVuZ3RoID4gMCkge1xuICAgICAgICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICAgICAgICBvcHRpb25zLmlkcyA9IFtvcHRpb25zLm5hbWVdO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnMuZWFjaChjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBpbnZlcnNlKHRoaXMpO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGxldCBkYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICAgICAgZGF0YS5jb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5uYW1lKTtcbiAgICAgICAgb3B0aW9ucyA9IHtkYXRhOiBkYXRhfTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIGZuKGNvbnRleHQsIG9wdGlvbnMpO1xuICAgIH1cbiAgfSk7XG59XG4iXX0=


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _utils = __webpack_require__(15);

	var _exception = __webpack_require__(16);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('each', function (context, options) {
	    if (!options) {
	      throw new _exception2['default']('Must pass iterator to #each');
	    }

	    var fn = options.fn,
	        inverse = options.inverse,
	        i = 0,
	        ret = '',
	        data = undefined,
	        contextPath = undefined;

	    if (options.data && options.ids) {
	      contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]) + '.';
	    }

	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    if (options.data) {
	      data = _utils.createFrame(options.data);
	    }

	    function execIteration(field, index, last) {
	      if (data) {
	        data.key = field;
	        data.index = index;
	        data.first = index === 0;
	        data.last = !!last;

	        if (contextPath) {
	          data.contextPath = contextPath + field;
	        }
	      }

	      ret = ret + fn(context[field], {
	        data: data,
	        blockParams: _utils.blockParams([context[field], field], [contextPath + field, null])
	      });
	    }

	    if (context && typeof context === 'object') {
	      if (_utils.isArray(context)) {
	        for (var j = context.length; i < j; i++) {
	          if (i in context) {
	            execIteration(i, i, i === context.length - 1);
	          }
	        }
	      } else {
	        var priorKey = undefined;

	        for (var key in context) {
	          if (context.hasOwnProperty(key)) {
	            // We're running the iterations one step out of sync so we can detect
	            // the last iteration without have to scan the object twice and create
	            // an itermediate keys array.
	            if (priorKey !== undefined) {
	              execIteration(priorKey, i - 1);
	            }
	            priorKey = key;
	            i++;
	          }
	        }
	        if (priorKey !== undefined) {
	          execIteration(priorKey, i - 1, true);
	        }
	      }
	    }

	    if (i === 0) {
	      ret = inverse(this);
	    }

	    return ret;
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvZWFjaC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O3FCQUErRSxVQUFVOzt5QkFDbkUsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixZQUFNLDJCQUFjLDZCQUE2QixDQUFDLENBQUM7S0FDcEQ7O0FBRUQsUUFBSSxFQUFFLEdBQUcsT0FBTyxDQUFDLEVBQUU7UUFDZixPQUFPLEdBQUcsT0FBTyxDQUFDLE9BQU87UUFDekIsQ0FBQyxHQUFHLENBQUM7UUFDTCxHQUFHLEdBQUcsRUFBRTtRQUNSLElBQUksWUFBQTtRQUNKLFdBQVcsWUFBQSxDQUFDOztBQUVoQixRQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUMvQixpQkFBVyxHQUFHLHlCQUFrQixPQUFPLENBQUMsSUFBSSxDQUFDLFdBQVcsRUFBRSxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQUcsR0FBRyxDQUFDO0tBQ2pGOztBQUVELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsVUFBSSxHQUFHLG1CQUFZLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNsQzs7QUFFRCxhQUFTLGFBQWEsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRTtBQUN6QyxVQUFJLElBQUksRUFBRTtBQUNSLFlBQUksQ0FBQyxHQUFHLEdBQUcsS0FBSyxDQUFDO0FBQ2pCLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO0FBQ25CLFlBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxLQUFLLENBQUMsQ0FBQztBQUN6QixZQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUM7O0FBRW5CLFlBQUksV0FBVyxFQUFFO0FBQ2YsY0FBSSxDQUFDLFdBQVcsR0FBRyxXQUFXLEdBQUcsS0FBSyxDQUFDO1NBQ3hDO09BQ0Y7O0FBRUQsU0FBRyxHQUFHLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxFQUFFO0FBQzdCLFlBQUksRUFBRSxJQUFJO0FBQ1YsbUJBQVcsRUFBRSxtQkFBWSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsRUFBRSxLQUFLLENBQUMsRUFBRSxDQUFDLFdBQVcsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLENBQUM7T0FDL0UsQ0FBQyxDQUFDO0tBQ0o7O0FBRUQsUUFBSSxPQUFPLElBQUksT0FBTyxPQUFPLEtBQUssUUFBUSxFQUFFO0FBQzFDLFVBQUksZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNwQixhQUFLLElBQUksQ0FBQyxHQUFHLE9BQU8sQ0FBQyxNQUFNLEVBQUUsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRTtBQUN2QyxjQUFJLENBQUMsSUFBSSxPQUFPLEVBQUU7QUFDaEIseUJBQWEsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1dBQy9DO1NBQ0Y7T0FDRixNQUFNO0FBQ0wsWUFBSSxRQUFRLFlBQUEsQ0FBQzs7QUFFYixhQUFLLElBQUksR0FBRyxJQUFJLE9BQU8sRUFBRTtBQUN2QixjQUFJLE9BQU8sQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLEVBQUU7Ozs7QUFJL0IsZ0JBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQiwyQkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUM7YUFDaEM7QUFDRCxvQkFBUSxHQUFHLEdBQUcsQ0FBQztBQUNmLGFBQUMsRUFBRSxDQUFDO1dBQ0w7U0FDRjtBQUNELFlBQUksUUFBUSxLQUFLLFNBQVMsRUFBRTtBQUMxQix1QkFBYSxDQUFDLFFBQVEsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1NBQ3RDO09BQ0Y7S0FDRjs7QUFFRCxRQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7QUFDWCxTQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ3JCOztBQUVELFdBQU8sR0FBRyxDQUFDO0dBQ1osQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoiZWFjaC5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7YXBwZW5kQ29udGV4dFBhdGgsIGJsb2NrUGFyYW1zLCBjcmVhdGVGcmFtZSwgaXNBcnJheSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuaW1wb3J0IEV4Y2VwdGlvbiBmcm9tICcuLi9leGNlcHRpb24nO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignZWFjaCcsIGZ1bmN0aW9uKGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAoIW9wdGlvbnMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ011c3QgcGFzcyBpdGVyYXRvciB0byAjZWFjaCcpO1xuICAgIH1cblxuICAgIGxldCBmbiA9IG9wdGlvbnMuZm4sXG4gICAgICAgIGludmVyc2UgPSBvcHRpb25zLmludmVyc2UsXG4gICAgICAgIGkgPSAwLFxuICAgICAgICByZXQgPSAnJyxcbiAgICAgICAgZGF0YSxcbiAgICAgICAgY29udGV4dFBhdGg7XG5cbiAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICBjb250ZXh0UGF0aCA9IGFwcGVuZENvbnRleHRQYXRoKG9wdGlvbnMuZGF0YS5jb250ZXh0UGF0aCwgb3B0aW9ucy5pZHNbMF0pICsgJy4nO1xuICAgIH1cblxuICAgIGlmIChpc0Z1bmN0aW9uKGNvbnRleHQpKSB7IGNvbnRleHQgPSBjb250ZXh0LmNhbGwodGhpcyk7IH1cblxuICAgIGlmIChvcHRpb25zLmRhdGEpIHtcbiAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIGV4ZWNJdGVyYXRpb24oZmllbGQsIGluZGV4LCBsYXN0KSB7XG4gICAgICBpZiAoZGF0YSkge1xuICAgICAgICBkYXRhLmtleSA9IGZpZWxkO1xuICAgICAgICBkYXRhLmluZGV4ID0gaW5kZXg7XG4gICAgICAgIGRhdGEuZmlyc3QgPSBpbmRleCA9PT0gMDtcbiAgICAgICAgZGF0YS5sYXN0ID0gISFsYXN0O1xuXG4gICAgICAgIGlmIChjb250ZXh0UGF0aCkge1xuICAgICAgICAgIGRhdGEuY29udGV4dFBhdGggPSBjb250ZXh0UGF0aCArIGZpZWxkO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHJldCA9IHJldCArIGZuKGNvbnRleHRbZmllbGRdLCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dFtmaWVsZF0sIGZpZWxkXSwgW2NvbnRleHRQYXRoICsgZmllbGQsIG51bGxdKVxuICAgICAgfSk7XG4gICAgfVxuXG4gICAgaWYgKGNvbnRleHQgJiYgdHlwZW9mIGNvbnRleHQgPT09ICdvYmplY3QnKSB7XG4gICAgICBpZiAoaXNBcnJheShjb250ZXh0KSkge1xuICAgICAgICBmb3IgKGxldCBqID0gY29udGV4dC5sZW5ndGg7IGkgPCBqOyBpKyspIHtcbiAgICAgICAgICBpZiAoaSBpbiBjb250ZXh0KSB7XG4gICAgICAgICAgICBleGVjSXRlcmF0aW9uKGksIGksIGkgPT09IGNvbnRleHQubGVuZ3RoIC0gMSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBsZXQgcHJpb3JLZXk7XG5cbiAgICAgICAgZm9yIChsZXQga2V5IGluIGNvbnRleHQpIHtcbiAgICAgICAgICBpZiAoY29udGV4dC5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICAgICAgICAvLyBXZSdyZSBydW5uaW5nIHRoZSBpdGVyYXRpb25zIG9uZSBzdGVwIG91dCBvZiBzeW5jIHNvIHdlIGNhbiBkZXRlY3RcbiAgICAgICAgICAgIC8vIHRoZSBsYXN0IGl0ZXJhdGlvbiB3aXRob3V0IGhhdmUgdG8gc2NhbiB0aGUgb2JqZWN0IHR3aWNlIGFuZCBjcmVhdGVcbiAgICAgICAgICAgIC8vIGFuIGl0ZXJtZWRpYXRlIGtleXMgYXJyYXkuXG4gICAgICAgICAgICBpZiAocHJpb3JLZXkgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBwcmlvcktleSA9IGtleTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHByaW9yS2V5ICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICBleGVjSXRlcmF0aW9uKHByaW9yS2V5LCBpIC0gMSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAoaSA9PT0gMCkge1xuICAgICAgcmV0ID0gaW52ZXJzZSh0aGlzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gcmV0O1xuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _exception = __webpack_require__(16);

	var _exception2 = _interopRequireDefault(_exception);

	exports['default'] = function (instance) {
	  instance.registerHelper('helperMissing', function () /* [args, ]options */{
	    if (arguments.length === 1) {
	      // A missing field in a {{foo}} construct.
	      return undefined;
	    } else {
	      // Someone is actually trying to call something, blow up.
	      throw new _exception2['default']('Missing helper: "' + arguments[arguments.length - 1].name + '"');
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaGVscGVyLW1pc3NpbmcuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozt5QkFBc0IsY0FBYzs7OztxQkFFckIsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxlQUFlLEVBQUUsaUNBQWdDO0FBQ3ZFLFFBQUksU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLEVBQUU7O0FBRTFCLGFBQU8sU0FBUyxDQUFDO0tBQ2xCLE1BQU07O0FBRUwsWUFBTSwyQkFBYyxtQkFBbUIsR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQyxJQUFJLEdBQUcsR0FBRyxDQUFDLENBQUM7S0FDdkY7R0FDRixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJoZWxwZXItbWlzc2luZy5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBFeGNlcHRpb24gZnJvbSAnLi4vZXhjZXB0aW9uJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2hlbHBlck1pc3NpbmcnLCBmdW5jdGlvbigvKiBbYXJncywgXW9wdGlvbnMgKi8pIHtcbiAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA9PT0gMSkge1xuICAgICAgLy8gQSBtaXNzaW5nIGZpZWxkIGluIGEge3tmb299fSBjb25zdHJ1Y3QuXG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTb21lb25lIGlzIGFjdHVhbGx5IHRyeWluZyB0byBjYWxsIHNvbWV0aGluZywgYmxvdyB1cC5cbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ01pc3NpbmcgaGVscGVyOiBcIicgKyBhcmd1bWVudHNbYXJndW1lbnRzLmxlbmd0aCAtIDFdLm5hbWUgKyAnXCInKTtcbiAgICB9XG4gIH0pO1xufVxuIl19


/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(15);

	exports['default'] = function (instance) {
	  instance.registerHelper('if', function (conditional, options) {
	    if (_utils.isFunction(conditional)) {
	      conditional = conditional.call(this);
	    }

	    // Default behavior is to render the positive path if the value is truthy and not empty.
	    // The `includeZero` option may be set to treat the condtional as purely not empty based on the
	    // behavior of isEmpty. Effectively this determines if 0 is handled by the positive path or negative.
	    if (!options.hash.includeZero && !conditional || _utils.isEmpty(conditional)) {
	      return options.inverse(this);
	    } else {
	      return options.fn(this);
	    }
	  });

	  instance.registerHelper('unless', function (conditional, options) {
	    return instance.helpers['if'].call(this, conditional, { fn: options.inverse, inverse: options.fn, hash: options.hash });
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvaWYuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztxQkFBa0MsVUFBVTs7cUJBRTdCLFVBQVMsUUFBUSxFQUFFO0FBQ2hDLFVBQVEsQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLFVBQVMsV0FBVyxFQUFFLE9BQU8sRUFBRTtBQUMzRCxRQUFJLGtCQUFXLFdBQVcsQ0FBQyxFQUFFO0FBQUUsaUJBQVcsR0FBRyxXQUFXLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQUU7Ozs7O0FBS3RFLFFBQUksQUFBQyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxJQUFJLENBQUMsV0FBVyxJQUFLLGVBQVEsV0FBVyxDQUFDLEVBQUU7QUFDdkUsYUFBTyxPQUFPLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQzlCLE1BQU07QUFDTCxhQUFPLE9BQU8sQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDekI7R0FDRixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxXQUFXLEVBQUUsT0FBTyxFQUFFO0FBQy9ELFdBQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLFdBQVcsRUFBRSxFQUFDLEVBQUUsRUFBRSxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxFQUFDLENBQUMsQ0FBQztHQUN2SCxDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJpZi5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aXNFbXB0eSwgaXNGdW5jdGlvbn0gZnJvbSAnLi4vdXRpbHMnO1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignaWYnLCBmdW5jdGlvbihjb25kaXRpb25hbCwgb3B0aW9ucykge1xuICAgIGlmIChpc0Z1bmN0aW9uKGNvbmRpdGlvbmFsKSkgeyBjb25kaXRpb25hbCA9IGNvbmRpdGlvbmFsLmNhbGwodGhpcyk7IH1cblxuICAgIC8vIERlZmF1bHQgYmVoYXZpb3IgaXMgdG8gcmVuZGVyIHRoZSBwb3NpdGl2ZSBwYXRoIGlmIHRoZSB2YWx1ZSBpcyB0cnV0aHkgYW5kIG5vdCBlbXB0eS5cbiAgICAvLyBUaGUgYGluY2x1ZGVaZXJvYCBvcHRpb24gbWF5IGJlIHNldCB0byB0cmVhdCB0aGUgY29uZHRpb25hbCBhcyBwdXJlbHkgbm90IGVtcHR5IGJhc2VkIG9uIHRoZVxuICAgIC8vIGJlaGF2aW9yIG9mIGlzRW1wdHkuIEVmZmVjdGl2ZWx5IHRoaXMgZGV0ZXJtaW5lcyBpZiAwIGlzIGhhbmRsZWQgYnkgdGhlIHBvc2l0aXZlIHBhdGggb3IgbmVnYXRpdmUuXG4gICAgaWYgKCghb3B0aW9ucy5oYXNoLmluY2x1ZGVaZXJvICYmICFjb25kaXRpb25hbCkgfHwgaXNFbXB0eShjb25kaXRpb25hbCkpIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmZuKHRoaXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3VubGVzcycsIGZ1bmN0aW9uKGNvbmRpdGlvbmFsLCBvcHRpb25zKSB7XG4gICAgcmV0dXJuIGluc3RhbmNlLmhlbHBlcnNbJ2lmJ10uY2FsbCh0aGlzLCBjb25kaXRpb25hbCwge2ZuOiBvcHRpb25zLmludmVyc2UsIGludmVyc2U6IG9wdGlvbnMuZm4sIGhhc2g6IG9wdGlvbnMuaGFzaH0pO1xuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 22 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('log', function () /* message, options */{
	    var args = [undefined],
	        options = arguments[arguments.length - 1];
	    for (var i = 0; i < arguments.length - 1; i++) {
	      args.push(arguments[i]);
	    }

	    var level = 1;
	    if (options.hash.level != null) {
	      level = options.hash.level;
	    } else if (options.data && options.data.level != null) {
	      level = options.data.level;
	    }
	    args[0] = level;

	    instance.log.apply(instance, args);
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxLQUFLLEVBQUUsa0NBQWlDO0FBQzlELFFBQUksSUFBSSxHQUFHLENBQUMsU0FBUyxDQUFDO1FBQ2xCLE9BQU8sR0FBRyxTQUFTLENBQUMsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztBQUM5QyxTQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDN0MsVUFBSSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUN6Qjs7QUFFRCxRQUFJLEtBQUssR0FBRyxDQUFDLENBQUM7QUFDZCxRQUFJLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxJQUFJLElBQUksRUFBRTtBQUM5QixXQUFLLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUM7S0FDNUIsTUFBTSxJQUFJLE9BQU8sQ0FBQyxJQUFJLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxLQUFLLElBQUksSUFBSSxFQUFFO0FBQ3JELFdBQUssR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztLQUM1QjtBQUNELFFBQUksQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUM7O0FBRWhCLFlBQVEsQ0FBQyxHQUFHLE1BQUEsQ0FBWixRQUFRLEVBQVMsSUFBSSxDQUFDLENBQUM7R0FDeEIsQ0FBQyxDQUFDO0NBQ0oiLCJmaWxlIjoibG9nLmpzIiwic291cmNlc0NvbnRlbnQiOlsiZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ2xvZycsIGZ1bmN0aW9uKC8qIG1lc3NhZ2UsIG9wdGlvbnMgKi8pIHtcbiAgICBsZXQgYXJncyA9IFt1bmRlZmluZWRdLFxuICAgICAgICBvcHRpb25zID0gYXJndW1lbnRzW2FyZ3VtZW50cy5sZW5ndGggLSAxXTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFyZ3VtZW50cy5sZW5ndGggLSAxOyBpKyspIHtcbiAgICAgIGFyZ3MucHVzaChhcmd1bWVudHNbaV0pO1xuICAgIH1cblxuICAgIGxldCBsZXZlbCA9IDE7XG4gICAgaWYgKG9wdGlvbnMuaGFzaC5sZXZlbCAhPSBudWxsKSB7XG4gICAgICBsZXZlbCA9IG9wdGlvbnMuaGFzaC5sZXZlbDtcbiAgICB9IGVsc2UgaWYgKG9wdGlvbnMuZGF0YSAmJiBvcHRpb25zLmRhdGEubGV2ZWwgIT0gbnVsbCkge1xuICAgICAgbGV2ZWwgPSBvcHRpb25zLmRhdGEubGV2ZWw7XG4gICAgfVxuICAgIGFyZ3NbMF0gPSBsZXZlbDtcblxuICAgIGluc3RhbmNlLmxvZyguLi4gYXJncyk7XG4gIH0pO1xufVxuIl19


/***/ },
/* 23 */
/***/ function(module, exports) {

	'use strict';

	exports.__esModule = true;

	exports['default'] = function (instance) {
	  instance.registerHelper('lookup', function (obj, field) {
	    return obj && obj[field];
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvbG9va3VwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQWUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxRQUFRLEVBQUUsVUFBUyxHQUFHLEVBQUUsS0FBSyxFQUFFO0FBQ3JELFdBQU8sR0FBRyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUMxQixDQUFDLENBQUM7Q0FDSiIsImZpbGUiOiJsb29rdXAuanMiLCJzb3VyY2VzQ29udGVudCI6WyJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbihpbnN0YW5jZSkge1xuICBpbnN0YW5jZS5yZWdpc3RlckhlbHBlcignbG9va3VwJywgZnVuY3Rpb24ob2JqLCBmaWVsZCkge1xuICAgIHJldHVybiBvYmogJiYgb2JqW2ZpZWxkXTtcbiAgfSk7XG59XG4iXX0=


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(15);

	exports['default'] = function (instance) {
	  instance.registerHelper('with', function (context, options) {
	    if (_utils.isFunction(context)) {
	      context = context.call(this);
	    }

	    var fn = options.fn;

	    if (!_utils.isEmpty(context)) {
	      var data = options.data;
	      if (options.data && options.ids) {
	        data = _utils.createFrame(options.data);
	        data.contextPath = _utils.appendContextPath(options.data.contextPath, options.ids[0]);
	      }

	      return fn(context, {
	        data: data,
	        blockParams: _utils.blockParams([context], [data && data.contextPath])
	      });
	    } else {
	      return options.inverse(this);
	    }
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2hlbHBlcnMvd2l0aC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUErRSxVQUFVOztxQkFFMUUsVUFBUyxRQUFRLEVBQUU7QUFDaEMsVUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsVUFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3pELFFBQUksa0JBQVcsT0FBTyxDQUFDLEVBQUU7QUFBRSxhQUFPLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUFFOztBQUUxRCxRQUFJLEVBQUUsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUVwQixRQUFJLENBQUMsZUFBUSxPQUFPLENBQUMsRUFBRTtBQUNyQixVQUFJLElBQUksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDO0FBQ3hCLFVBQUksT0FBTyxDQUFDLElBQUksSUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQy9CLFlBQUksR0FBRyxtQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDakMsWUFBSSxDQUFDLFdBQVcsR0FBRyx5QkFBa0IsT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLEVBQUUsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO09BQ2hGOztBQUVELGFBQU8sRUFBRSxDQUFDLE9BQU8sRUFBRTtBQUNqQixZQUFJLEVBQUUsSUFBSTtBQUNWLG1CQUFXLEVBQUUsbUJBQVksQ0FBQyxPQUFPLENBQUMsRUFBRSxDQUFDLElBQUksSUFBSSxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUM7T0FDaEUsQ0FBQyxDQUFDO0tBQ0osTUFBTTtBQUNMLGFBQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUM5QjtHQUNGLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6IndpdGguanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge2FwcGVuZENvbnRleHRQYXRoLCBibG9ja1BhcmFtcywgY3JlYXRlRnJhbWUsIGlzRW1wdHksIGlzRnVuY3Rpb259IGZyb20gJy4uL3V0aWxzJztcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oaW5zdGFuY2UpIHtcbiAgaW5zdGFuY2UucmVnaXN0ZXJIZWxwZXIoJ3dpdGgnLCBmdW5jdGlvbihjb250ZXh0LCBvcHRpb25zKSB7XG4gICAgaWYgKGlzRnVuY3Rpb24oY29udGV4dCkpIHsgY29udGV4dCA9IGNvbnRleHQuY2FsbCh0aGlzKTsgfVxuXG4gICAgbGV0IGZuID0gb3B0aW9ucy5mbjtcblxuICAgIGlmICghaXNFbXB0eShjb250ZXh0KSkge1xuICAgICAgbGV0IGRhdGEgPSBvcHRpb25zLmRhdGE7XG4gICAgICBpZiAob3B0aW9ucy5kYXRhICYmIG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIGRhdGEgPSBjcmVhdGVGcmFtZShvcHRpb25zLmRhdGEpO1xuICAgICAgICBkYXRhLmNvbnRleHRQYXRoID0gYXBwZW5kQ29udGV4dFBhdGgob3B0aW9ucy5kYXRhLmNvbnRleHRQYXRoLCBvcHRpb25zLmlkc1swXSk7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiBmbihjb250ZXh0LCB7XG4gICAgICAgIGRhdGE6IGRhdGEsXG4gICAgICAgIGJsb2NrUGFyYW1zOiBibG9ja1BhcmFtcyhbY29udGV4dF0sIFtkYXRhICYmIGRhdGEuY29udGV4dFBhdGhdKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBvcHRpb25zLmludmVyc2UodGhpcyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.registerDefaultDecorators = registerDefaultDecorators;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	var _decoratorsInline = __webpack_require__(26);

	var _decoratorsInline2 = _interopRequireDefault(_decoratorsInline);

	function registerDefaultDecorators(instance) {
	  _decoratorsInline2['default'](instance);
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Z0NBQTJCLHFCQUFxQjs7OztBQUV6QyxTQUFTLHlCQUF5QixDQUFDLFFBQVEsRUFBRTtBQUNsRCxnQ0FBZSxRQUFRLENBQUMsQ0FBQztDQUMxQiIsImZpbGUiOiJkZWNvcmF0b3JzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHJlZ2lzdGVySW5saW5lIGZyb20gJy4vZGVjb3JhdG9ycy9pbmxpbmUnO1xuXG5leHBvcnQgZnVuY3Rpb24gcmVnaXN0ZXJEZWZhdWx0RGVjb3JhdG9ycyhpbnN0YW5jZSkge1xuICByZWdpc3RlcklubGluZShpbnN0YW5jZSk7XG59XG5cbiJdfQ==


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(15);

	exports['default'] = function (instance) {
	  instance.registerDecorator('inline', function (fn, props, container, options) {
	    var ret = fn;
	    if (!props.partials) {
	      props.partials = {};
	      ret = function (context, options) {
	        // Create a new partials stack frame prior to exec.
	        var original = container.partials;
	        container.partials = _utils.extend({}, original, props.partials);
	        var ret = fn(context, options);
	        container.partials = original;
	        return ret;
	      };
	    }

	    props.partials[options.args[0]] = options.fn;

	    return ret;
	  });
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2RlY29yYXRvcnMvaW5saW5lLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7cUJBQXFCLFVBQVU7O3FCQUVoQixVQUFTLFFBQVEsRUFBRTtBQUNoQyxVQUFRLENBQUMsaUJBQWlCLENBQUMsUUFBUSxFQUFFLFVBQVMsRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFO0FBQzNFLFFBQUksR0FBRyxHQUFHLEVBQUUsQ0FBQztBQUNiLFFBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFO0FBQ25CLFdBQUssQ0FBQyxRQUFRLEdBQUcsRUFBRSxDQUFDO0FBQ3BCLFNBQUcsR0FBRyxVQUFTLE9BQU8sRUFBRSxPQUFPLEVBQUU7O0FBRS9CLFlBQUksUUFBUSxHQUFHLFNBQVMsQ0FBQyxRQUFRLENBQUM7QUFDbEMsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsY0FBTyxFQUFFLEVBQUUsUUFBUSxFQUFFLEtBQUssQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUMxRCxZQUFJLEdBQUcsR0FBRyxFQUFFLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQy9CLGlCQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztBQUM5QixlQUFPLEdBQUcsQ0FBQztPQUNaLENBQUM7S0FDSDs7QUFFRCxTQUFLLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsRUFBRSxDQUFDOztBQUU3QyxXQUFPLEdBQUcsQ0FBQztHQUNaLENBQUMsQ0FBQztDQUNKIiwiZmlsZSI6ImlubGluZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7ZXh0ZW5kfSBmcm9tICcuLi91dGlscyc7XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uKGluc3RhbmNlKSB7XG4gIGluc3RhbmNlLnJlZ2lzdGVyRGVjb3JhdG9yKCdpbmxpbmUnLCBmdW5jdGlvbihmbiwgcHJvcHMsIGNvbnRhaW5lciwgb3B0aW9ucykge1xuICAgIGxldCByZXQgPSBmbjtcbiAgICBpZiAoIXByb3BzLnBhcnRpYWxzKSB7XG4gICAgICBwcm9wcy5wYXJ0aWFscyA9IHt9O1xuICAgICAgcmV0ID0gZnVuY3Rpb24oY29udGV4dCwgb3B0aW9ucykge1xuICAgICAgICAvLyBDcmVhdGUgYSBuZXcgcGFydGlhbHMgc3RhY2sgZnJhbWUgcHJpb3IgdG8gZXhlYy5cbiAgICAgICAgbGV0IG9yaWdpbmFsID0gY29udGFpbmVyLnBhcnRpYWxzO1xuICAgICAgICBjb250YWluZXIucGFydGlhbHMgPSBleHRlbmQoe30sIG9yaWdpbmFsLCBwcm9wcy5wYXJ0aWFscyk7XG4gICAgICAgIGxldCByZXQgPSBmbihjb250ZXh0LCBvcHRpb25zKTtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3JpZ2luYWw7XG4gICAgICAgIHJldHVybiByZXQ7XG4gICAgICB9O1xuICAgIH1cblxuICAgIHByb3BzLnBhcnRpYWxzW29wdGlvbnMuYXJnc1swXV0gPSBvcHRpb25zLmZuO1xuXG4gICAgcmV0dXJuIHJldDtcbiAgfSk7XG59XG4iXX0=


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;

	var _utils = __webpack_require__(15);

	var logger = {
	  methodMap: ['debug', 'info', 'warn', 'error'],
	  level: 'info',

	  // Maps a given level value to the `methodMap` indexes above.
	  lookupLevel: function lookupLevel(level) {
	    if (typeof level === 'string') {
	      var levelMap = _utils.indexOf(logger.methodMap, level.toLowerCase());
	      if (levelMap >= 0) {
	        level = levelMap;
	      } else {
	        level = parseInt(level, 10);
	      }
	    }

	    return level;
	  },

	  // Can be overridden in the host environment
	  log: function log(level) {
	    level = logger.lookupLevel(level);

	    if (typeof console !== 'undefined' && logger.lookupLevel(logger.level) <= level) {
	      var method = logger.methodMap[level];
	      if (!console[method]) {
	        // eslint-disable-line no-console
	        method = 'log';
	      }

	      for (var _len = arguments.length, message = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        message[_key - 1] = arguments[_key];
	      }

	      console[method].apply(console, message); // eslint-disable-line no-console
	    }
	  }
	};

	exports['default'] = logger;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL2xvZ2dlci5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O3FCQUFzQixTQUFTOztBQUUvQixJQUFJLE1BQU0sR0FBRztBQUNYLFdBQVMsRUFBRSxDQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sQ0FBQztBQUM3QyxPQUFLLEVBQUUsTUFBTTs7O0FBR2IsYUFBVyxFQUFFLHFCQUFTLEtBQUssRUFBRTtBQUMzQixRQUFJLE9BQU8sS0FBSyxLQUFLLFFBQVEsRUFBRTtBQUM3QixVQUFJLFFBQVEsR0FBRyxlQUFRLE1BQU0sQ0FBQyxTQUFTLEVBQUUsS0FBSyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7QUFDOUQsVUFBSSxRQUFRLElBQUksQ0FBQyxFQUFFO0FBQ2pCLGFBQUssR0FBRyxRQUFRLENBQUM7T0FDbEIsTUFBTTtBQUNMLGFBQUssR0FBRyxRQUFRLENBQUMsS0FBSyxFQUFFLEVBQUUsQ0FBQyxDQUFDO09BQzdCO0tBQ0Y7O0FBRUQsV0FBTyxLQUFLLENBQUM7R0FDZDs7O0FBR0QsS0FBRyxFQUFFLGFBQVMsS0FBSyxFQUFjO0FBQy9CLFNBQUssR0FBRyxNQUFNLENBQUMsV0FBVyxDQUFDLEtBQUssQ0FBQyxDQUFDOztBQUVsQyxRQUFJLE9BQU8sT0FBTyxLQUFLLFdBQVcsSUFBSSxNQUFNLENBQUMsV0FBVyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxLQUFLLEVBQUU7QUFDL0UsVUFBSSxNQUFNLEdBQUcsTUFBTSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztBQUNyQyxVQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxFQUFFOztBQUNwQixjQUFNLEdBQUcsS0FBSyxDQUFDO09BQ2hCOzt3Q0FQbUIsT0FBTztBQUFQLGVBQU87OztBQVEzQixhQUFPLENBQUMsTUFBTSxPQUFDLENBQWYsT0FBTyxFQUFZLE9BQU8sQ0FBQyxDQUFDO0tBQzdCO0dBQ0Y7Q0FDRixDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6ImxvZ2dlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7aW5kZXhPZn0gZnJvbSAnLi91dGlscyc7XG5cbmxldCBsb2dnZXIgPSB7XG4gIG1ldGhvZE1hcDogWydkZWJ1ZycsICdpbmZvJywgJ3dhcm4nLCAnZXJyb3InXSxcbiAgbGV2ZWw6ICdpbmZvJyxcblxuICAvLyBNYXBzIGEgZ2l2ZW4gbGV2ZWwgdmFsdWUgdG8gdGhlIGBtZXRob2RNYXBgIGluZGV4ZXMgYWJvdmUuXG4gIGxvb2t1cExldmVsOiBmdW5jdGlvbihsZXZlbCkge1xuICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09ICdzdHJpbmcnKSB7XG4gICAgICBsZXQgbGV2ZWxNYXAgPSBpbmRleE9mKGxvZ2dlci5tZXRob2RNYXAsIGxldmVsLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgaWYgKGxldmVsTWFwID49IDApIHtcbiAgICAgICAgbGV2ZWwgPSBsZXZlbE1hcDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGxldmVsID0gcGFyc2VJbnQobGV2ZWwsIDEwKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbGV2ZWw7XG4gIH0sXG5cbiAgLy8gQ2FuIGJlIG92ZXJyaWRkZW4gaW4gdGhlIGhvc3QgZW52aXJvbm1lbnRcbiAgbG9nOiBmdW5jdGlvbihsZXZlbCwgLi4ubWVzc2FnZSkge1xuICAgIGxldmVsID0gbG9nZ2VyLmxvb2t1cExldmVsKGxldmVsKTtcblxuICAgIGlmICh0eXBlb2YgY29uc29sZSAhPT0gJ3VuZGVmaW5lZCcgJiYgbG9nZ2VyLmxvb2t1cExldmVsKGxvZ2dlci5sZXZlbCkgPD0gbGV2ZWwpIHtcbiAgICAgIGxldCBtZXRob2QgPSBsb2dnZXIubWV0aG9kTWFwW2xldmVsXTtcbiAgICAgIGlmICghY29uc29sZVttZXRob2RdKSB7ICAgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1jb25zb2xlXG4gICAgICAgIG1ldGhvZCA9ICdsb2cnO1xuICAgICAgfVxuICAgICAgY29uc29sZVttZXRob2RdKC4uLm1lc3NhZ2UpOyAgICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLWNvbnNvbGVcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IGxvZ2dlcjtcbiJdfQ==


/***/ },
/* 28 */
/***/ function(module, exports) {

	// Build out our basic SafeString type
	'use strict';

	exports.__esModule = true;
	function SafeString(string) {
	  this.string = string;
	}

	SafeString.prototype.toString = SafeString.prototype.toHTML = function () {
	  return '' + this.string;
	};

	exports['default'] = SafeString;
	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3NhZmUtc3RyaW5nLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7QUFDQSxTQUFTLFVBQVUsQ0FBQyxNQUFNLEVBQUU7QUFDMUIsTUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUM7Q0FDdEI7O0FBRUQsVUFBVSxDQUFDLFNBQVMsQ0FBQyxRQUFRLEdBQUcsVUFBVSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsWUFBVztBQUN2RSxTQUFPLEVBQUUsR0FBRyxJQUFJLENBQUMsTUFBTSxDQUFDO0NBQ3pCLENBQUM7O3FCQUVhLFVBQVUiLCJmaWxlIjoic2FmZS1zdHJpbmcuanMiLCJzb3VyY2VzQ29udGVudCI6WyIvLyBCdWlsZCBvdXQgb3VyIGJhc2ljIFNhZmVTdHJpbmcgdHlwZVxuZnVuY3Rpb24gU2FmZVN0cmluZyhzdHJpbmcpIHtcbiAgdGhpcy5zdHJpbmcgPSBzdHJpbmc7XG59XG5cblNhZmVTdHJpbmcucHJvdG90eXBlLnRvU3RyaW5nID0gU2FmZVN0cmluZy5wcm90b3R5cGUudG9IVE1MID0gZnVuY3Rpb24oKSB7XG4gIHJldHVybiAnJyArIHRoaXMuc3RyaW5nO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgU2FmZVN0cmluZztcbiJdfQ==


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	exports.__esModule = true;
	exports.checkRevision = checkRevision;
	exports.template = template;
	exports.wrapProgram = wrapProgram;
	exports.resolvePartial = resolvePartial;
	exports.invokePartial = invokePartial;
	exports.noop = noop;
	// istanbul ignore next

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

	// istanbul ignore next

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

	var _utils = __webpack_require__(15);

	var Utils = _interopRequireWildcard(_utils);

	var _exception = __webpack_require__(16);

	var _exception2 = _interopRequireDefault(_exception);

	var _base = __webpack_require__(14);

	function checkRevision(compilerInfo) {
	  var compilerRevision = compilerInfo && compilerInfo[0] || 1,
	      currentRevision = _base.COMPILER_REVISION;

	  if (compilerRevision !== currentRevision) {
	    if (compilerRevision < currentRevision) {
	      var runtimeVersions = _base.REVISION_CHANGES[currentRevision],
	          compilerVersions = _base.REVISION_CHANGES[compilerRevision];
	      throw new _exception2['default']('Template was precompiled with an older version of Handlebars than the current runtime. ' + 'Please update your precompiler to a newer version (' + runtimeVersions + ') or downgrade your runtime to an older version (' + compilerVersions + ').');
	    } else {
	      // Use the embedded version info since the runtime doesn't know about this revision yet
	      throw new _exception2['default']('Template was precompiled with a newer version of Handlebars than the current runtime. ' + 'Please update your runtime to a newer version (' + compilerInfo[1] + ').');
	    }
	  }
	}

	function template(templateSpec, env) {
	  /* istanbul ignore next */
	  if (!env) {
	    throw new _exception2['default']('No environment passed to template');
	  }
	  if (!templateSpec || !templateSpec.main) {
	    throw new _exception2['default']('Unknown template object: ' + typeof templateSpec);
	  }

	  templateSpec.main.decorator = templateSpec.main_d;

	  // Note: Using env.VM references rather than local var references throughout this section to allow
	  // for external users to override these as psuedo-supported APIs.
	  env.VM.checkRevision(templateSpec.compiler);

	  function invokePartialWrapper(partial, context, options) {
	    if (options.hash) {
	      context = Utils.extend({}, context, options.hash);
	      if (options.ids) {
	        options.ids[0] = true;
	      }
	    }

	    partial = env.VM.resolvePartial.call(this, partial, context, options);
	    var result = env.VM.invokePartial.call(this, partial, context, options);

	    if (result == null && env.compile) {
	      options.partials[options.name] = env.compile(partial, templateSpec.compilerOptions, env);
	      result = options.partials[options.name](context, options);
	    }
	    if (result != null) {
	      if (options.indent) {
	        var lines = result.split('\n');
	        for (var i = 0, l = lines.length; i < l; i++) {
	          if (!lines[i] && i + 1 === l) {
	            break;
	          }

	          lines[i] = options.indent + lines[i];
	        }
	        result = lines.join('\n');
	      }
	      return result;
	    } else {
	      throw new _exception2['default']('The partial ' + options.name + ' could not be compiled when running in runtime-only mode');
	    }
	  }

	  // Just add water
	  var container = {
	    strict: function strict(obj, name) {
	      if (!(name in obj)) {
	        throw new _exception2['default']('"' + name + '" not defined in ' + obj);
	      }
	      return obj[name];
	    },
	    lookup: function lookup(depths, name) {
	      var len = depths.length;
	      for (var i = 0; i < len; i++) {
	        if (depths[i] && depths[i][name] != null) {
	          return depths[i][name];
	        }
	      }
	    },
	    lambda: function lambda(current, context) {
	      return typeof current === 'function' ? current.call(context) : current;
	    },

	    escapeExpression: Utils.escapeExpression,
	    invokePartial: invokePartialWrapper,

	    fn: function fn(i) {
	      var ret = templateSpec[i];
	      ret.decorator = templateSpec[i + '_d'];
	      return ret;
	    },

	    programs: [],
	    program: function program(i, data, declaredBlockParams, blockParams, depths) {
	      var programWrapper = this.programs[i],
	          fn = this.fn(i);
	      if (data || depths || blockParams || declaredBlockParams) {
	        programWrapper = wrapProgram(this, i, fn, data, declaredBlockParams, blockParams, depths);
	      } else if (!programWrapper) {
	        programWrapper = this.programs[i] = wrapProgram(this, i, fn);
	      }
	      return programWrapper;
	    },

	    data: function data(value, depth) {
	      while (value && depth--) {
	        value = value._parent;
	      }
	      return value;
	    },
	    merge: function merge(param, common) {
	      var obj = param || common;

	      if (param && common && param !== common) {
	        obj = Utils.extend({}, common, param);
	      }

	      return obj;
	    },

	    noop: env.VM.noop,
	    compilerInfo: templateSpec.compiler
	  };

	  function ret(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var data = options.data;

	    ret._setup(options);
	    if (!options.partial && templateSpec.useData) {
	      data = initData(context, data);
	    }
	    var depths = undefined,
	        blockParams = templateSpec.useBlockParams ? [] : undefined;
	    if (templateSpec.useDepths) {
	      if (options.depths) {
	        depths = context !== options.depths[0] ? [context].concat(options.depths) : options.depths;
	      } else {
	        depths = [context];
	      }
	    }

	    function main(context /*, options*/) {
	      return '' + templateSpec.main(container, context, container.helpers, container.partials, data, blockParams, depths);
	    }
	    main = executeDecorators(templateSpec.main, main, container, options.depths || [], data, blockParams);
	    return main(context, options);
	  }
	  ret.isTop = true;

	  ret._setup = function (options) {
	    if (!options.partial) {
	      container.helpers = container.merge(options.helpers, env.helpers);

	      if (templateSpec.usePartial) {
	        container.partials = container.merge(options.partials, env.partials);
	      }
	      if (templateSpec.usePartial || templateSpec.useDecorators) {
	        container.decorators = container.merge(options.decorators, env.decorators);
	      }
	    } else {
	      container.helpers = options.helpers;
	      container.partials = options.partials;
	      container.decorators = options.decorators;
	    }
	  };

	  ret._child = function (i, data, blockParams, depths) {
	    if (templateSpec.useBlockParams && !blockParams) {
	      throw new _exception2['default']('must pass block params');
	    }
	    if (templateSpec.useDepths && !depths) {
	      throw new _exception2['default']('must pass parent depths');
	    }

	    return wrapProgram(container, i, templateSpec[i], data, 0, blockParams, depths);
	  };
	  return ret;
	}

	function wrapProgram(container, i, fn, data, declaredBlockParams, blockParams, depths) {
	  function prog(context) {
	    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

	    var currentDepths = depths;
	    if (depths && context !== depths[0]) {
	      currentDepths = [context].concat(depths);
	    }

	    return fn(container, context, container.helpers, container.partials, options.data || data, blockParams && [options.blockParams].concat(blockParams), currentDepths);
	  }

	  prog = executeDecorators(fn, prog, container, depths, data, blockParams);

	  prog.program = i;
	  prog.depth = depths ? depths.length : 0;
	  prog.blockParams = declaredBlockParams || 0;
	  return prog;
	}

	function resolvePartial(partial, context, options) {
	  if (!partial) {
	    if (options.name === '@partial-block') {
	      partial = options.data['partial-block'];
	    } else {
	      partial = options.partials[options.name];
	    }
	  } else if (!partial.call && !options.name) {
	    // This is a dynamic partial that returned a string
	    options.name = partial;
	    partial = options.partials[partial];
	  }
	  return partial;
	}

	function invokePartial(partial, context, options) {
	  options.partial = true;
	  if (options.ids) {
	    options.data.contextPath = options.ids[0] || options.data.contextPath;
	  }

	  var partialBlock = undefined;
	  if (options.fn && options.fn !== noop) {
	    options.data = _base.createFrame(options.data);
	    partialBlock = options.data['partial-block'] = options.fn;

	    if (partialBlock.partials) {
	      options.partials = Utils.extend({}, options.partials, partialBlock.partials);
	    }
	  }

	  if (partial === undefined && partialBlock) {
	    partial = partialBlock;
	  }

	  if (partial === undefined) {
	    throw new _exception2['default']('The partial ' + options.name + ' could not be found');
	  } else if (partial instanceof Function) {
	    return partial(context, options);
	  }
	}

	function noop() {
	  return '';
	}

	function initData(context, data) {
	  if (!data || !('root' in data)) {
	    data = data ? _base.createFrame(data) : {};
	    data.root = context;
	  }
	  return data;
	}

	function executeDecorators(fn, prog, container, depths, data, blockParams) {
	  if (fn.decorator) {
	    var props = {};
	    prog = fn.decorator(prog, props, container, depths && depths[0], data, blockParams, depths);
	    Utils.extend(prog, props);
	  }
	  return prog;
	}
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL3J1bnRpbWUuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7cUJBQXVCLFNBQVM7O0lBQXBCLEtBQUs7O3lCQUNLLGFBQWE7Ozs7b0JBQzhCLFFBQVE7O0FBRWxFLFNBQVMsYUFBYSxDQUFDLFlBQVksRUFBRTtBQUMxQyxNQUFNLGdCQUFnQixHQUFHLFlBQVksSUFBSSxZQUFZLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztNQUN2RCxlQUFlLDBCQUFvQixDQUFDOztBQUUxQyxNQUFJLGdCQUFnQixLQUFLLGVBQWUsRUFBRTtBQUN4QyxRQUFJLGdCQUFnQixHQUFHLGVBQWUsRUFBRTtBQUN0QyxVQUFNLGVBQWUsR0FBRyx1QkFBaUIsZUFBZSxDQUFDO1VBQ25ELGdCQUFnQixHQUFHLHVCQUFpQixnQkFBZ0IsQ0FBQyxDQUFDO0FBQzVELFlBQU0sMkJBQWMseUZBQXlGLEdBQ3ZHLHFEQUFxRCxHQUFHLGVBQWUsR0FBRyxtREFBbUQsR0FBRyxnQkFBZ0IsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNoSyxNQUFNOztBQUVMLFlBQU0sMkJBQWMsd0ZBQXdGLEdBQ3RHLGlEQUFpRCxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQztLQUNuRjtHQUNGO0NBQ0Y7O0FBRU0sU0FBUyxRQUFRLENBQUMsWUFBWSxFQUFFLEdBQUcsRUFBRTs7QUFFMUMsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFVBQU0sMkJBQWMsbUNBQW1DLENBQUMsQ0FBQztHQUMxRDtBQUNELE1BQUksQ0FBQyxZQUFZLElBQUksQ0FBQyxZQUFZLENBQUMsSUFBSSxFQUFFO0FBQ3ZDLFVBQU0sMkJBQWMsMkJBQTJCLEdBQUcsT0FBTyxZQUFZLENBQUMsQ0FBQztHQUN4RTs7QUFFRCxjQUFZLENBQUMsSUFBSSxDQUFDLFNBQVMsR0FBRyxZQUFZLENBQUMsTUFBTSxDQUFDOzs7O0FBSWxELEtBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLFlBQVksQ0FBQyxRQUFRLENBQUMsQ0FBQzs7QUFFNUMsV0FBUyxvQkFBb0IsQ0FBQyxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRTtBQUN2RCxRQUFJLE9BQU8sQ0FBQyxJQUFJLEVBQUU7QUFDaEIsYUFBTyxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDbEQsVUFBSSxPQUFPLENBQUMsR0FBRyxFQUFFO0FBQ2YsZUFBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUM7T0FDdkI7S0FDRjs7QUFFRCxXQUFPLEdBQUcsR0FBRyxDQUFDLEVBQUUsQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3RFLFFBQUksTUFBTSxHQUFHLEdBQUcsQ0FBQyxFQUFFLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsT0FBTyxFQUFFLE9BQU8sRUFBRSxPQUFPLENBQUMsQ0FBQzs7QUFFeEUsUUFBSSxNQUFNLElBQUksSUFBSSxJQUFJLEdBQUcsQ0FBQyxPQUFPLEVBQUU7QUFDakMsYUFBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsWUFBWSxDQUFDLGVBQWUsRUFBRSxHQUFHLENBQUMsQ0FBQztBQUN6RixZQUFNLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0tBQzNEO0FBQ0QsUUFBSSxNQUFNLElBQUksSUFBSSxFQUFFO0FBQ2xCLFVBQUksT0FBTyxDQUFDLE1BQU0sRUFBRTtBQUNsQixZQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO0FBQy9CLGFBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxLQUFLLENBQUMsTUFBTSxFQUFFLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUU7QUFDNUMsY0FBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRTtBQUM1QixrQkFBTTtXQUNQOztBQUVELGVBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztTQUN0QztBQUNELGNBQU0sR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDO09BQzNCO0FBQ0QsYUFBTyxNQUFNLENBQUM7S0FDZixNQUFNO0FBQ0wsWUFBTSwyQkFBYyxjQUFjLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRywwREFBMEQsQ0FBQyxDQUFDO0tBQ2pIO0dBQ0Y7OztBQUdELE1BQUksU0FBUyxHQUFHO0FBQ2QsVUFBTSxFQUFFLGdCQUFTLEdBQUcsRUFBRSxJQUFJLEVBQUU7QUFDMUIsVUFBSSxFQUFFLElBQUksSUFBSSxHQUFHLENBQUEsQUFBQyxFQUFFO0FBQ2xCLGNBQU0sMkJBQWMsR0FBRyxHQUFHLElBQUksR0FBRyxtQkFBbUIsR0FBRyxHQUFHLENBQUMsQ0FBQztPQUM3RDtBQUNELGFBQU8sR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFDO0tBQ2xCO0FBQ0QsVUFBTSxFQUFFLGdCQUFTLE1BQU0sRUFBRSxJQUFJLEVBQUU7QUFDN0IsVUFBTSxHQUFHLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQztBQUMxQixXQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxFQUFFLENBQUMsRUFBRSxFQUFFO0FBQzVCLFlBQUksTUFBTSxDQUFDLENBQUMsQ0FBQyxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsSUFBSSxJQUFJLEVBQUU7QUFDeEMsaUJBQU8sTUFBTSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO1NBQ3hCO09BQ0Y7S0FDRjtBQUNELFVBQU0sRUFBRSxnQkFBUyxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ2pDLGFBQU8sT0FBTyxPQUFPLEtBQUssVUFBVSxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEdBQUcsT0FBTyxDQUFDO0tBQ3hFOztBQUVELG9CQUFnQixFQUFFLEtBQUssQ0FBQyxnQkFBZ0I7QUFDeEMsaUJBQWEsRUFBRSxvQkFBb0I7O0FBRW5DLE1BQUUsRUFBRSxZQUFTLENBQUMsRUFBRTtBQUNkLFVBQUksR0FBRyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxQixTQUFHLENBQUMsU0FBUyxHQUFHLFlBQVksQ0FBQyxDQUFDLEdBQUcsSUFBSSxDQUFDLENBQUM7QUFDdkMsYUFBTyxHQUFHLENBQUM7S0FDWjs7QUFFRCxZQUFRLEVBQUUsRUFBRTtBQUNaLFdBQU8sRUFBRSxpQkFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDbkUsVUFBSSxjQUFjLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLENBQUM7VUFDakMsRUFBRSxHQUFHLElBQUksQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDcEIsVUFBSSxJQUFJLElBQUksTUFBTSxJQUFJLFdBQVcsSUFBSSxtQkFBbUIsRUFBRTtBQUN4RCxzQkFBYyxHQUFHLFdBQVcsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxJQUFJLEVBQUUsbUJBQW1CLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO09BQzNGLE1BQU0sSUFBSSxDQUFDLGNBQWMsRUFBRTtBQUMxQixzQkFBYyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUM7T0FDOUQ7QUFDRCxhQUFPLGNBQWMsQ0FBQztLQUN2Qjs7QUFFRCxRQUFJLEVBQUUsY0FBUyxLQUFLLEVBQUUsS0FBSyxFQUFFO0FBQzNCLGFBQU8sS0FBSyxJQUFJLEtBQUssRUFBRSxFQUFFO0FBQ3ZCLGFBQUssR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDO09BQ3ZCO0FBQ0QsYUFBTyxLQUFLLENBQUM7S0FDZDtBQUNELFNBQUssRUFBRSxlQUFTLEtBQUssRUFBRSxNQUFNLEVBQUU7QUFDN0IsVUFBSSxHQUFHLEdBQUcsS0FBSyxJQUFJLE1BQU0sQ0FBQzs7QUFFMUIsVUFBSSxLQUFLLElBQUksTUFBTSxJQUFLLEtBQUssS0FBSyxNQUFNLEFBQUMsRUFBRTtBQUN6QyxXQUFHLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO09BQ3ZDOztBQUVELGFBQU8sR0FBRyxDQUFDO0tBQ1o7O0FBRUQsUUFBSSxFQUFFLEdBQUcsQ0FBQyxFQUFFLENBQUMsSUFBSTtBQUNqQixnQkFBWSxFQUFFLFlBQVksQ0FBQyxRQUFRO0dBQ3BDLENBQUM7O0FBRUYsV0FBUyxHQUFHLENBQUMsT0FBTyxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDaEMsUUFBSSxJQUFJLEdBQUcsT0FBTyxDQUFDLElBQUksQ0FBQzs7QUFFeEIsT0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQztBQUNwQixRQUFJLENBQUMsT0FBTyxDQUFDLE9BQU8sSUFBSSxZQUFZLENBQUMsT0FBTyxFQUFFO0FBQzVDLFVBQUksR0FBRyxRQUFRLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ2hDO0FBQ0QsUUFBSSxNQUFNLFlBQUE7UUFDTixXQUFXLEdBQUcsWUFBWSxDQUFDLGNBQWMsR0FBRyxFQUFFLEdBQUcsU0FBUyxDQUFDO0FBQy9ELFFBQUksWUFBWSxDQUFDLFNBQVMsRUFBRTtBQUMxQixVQUFJLE9BQU8sQ0FBQyxNQUFNLEVBQUU7QUFDbEIsY0FBTSxHQUFHLE9BQU8sS0FBSyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO09BQzVGLE1BQU07QUFDTCxjQUFNLEdBQUcsQ0FBQyxPQUFPLENBQUMsQ0FBQztPQUNwQjtLQUNGOztBQUVELGFBQVMsSUFBSSxDQUFDLE9BQU8sZ0JBQWU7QUFDbEMsYUFBTyxFQUFFLEdBQUcsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsT0FBTyxFQUFFLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0tBQ3JIO0FBQ0QsUUFBSSxHQUFHLGlCQUFpQixDQUFDLFlBQVksQ0FBQyxJQUFJLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLENBQUMsTUFBTSxJQUFJLEVBQUUsRUFBRSxJQUFJLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDdEcsV0FBTyxJQUFJLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQy9CO0FBQ0QsS0FBRyxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUM7O0FBRWpCLEtBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBUyxPQUFPLEVBQUU7QUFDN0IsUUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUU7QUFDcEIsZUFBUyxDQUFDLE9BQU8sR0FBRyxTQUFTLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztBQUVsRSxVQUFJLFlBQVksQ0FBQyxVQUFVLEVBQUU7QUFDM0IsaUJBQVMsQ0FBQyxRQUFRLEdBQUcsU0FBUyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsUUFBUSxFQUFFLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUN0RTtBQUNELFVBQUksWUFBWSxDQUFDLFVBQVUsSUFBSSxZQUFZLENBQUMsYUFBYSxFQUFFO0FBQ3pELGlCQUFTLENBQUMsVUFBVSxHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7T0FDNUU7S0FDRixNQUFNO0FBQ0wsZUFBUyxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFDO0FBQ3BDLGVBQVMsQ0FBQyxRQUFRLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQztBQUN0QyxlQUFTLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7S0FDM0M7R0FDRixDQUFDOztBQUVGLEtBQUcsQ0FBQyxNQUFNLEdBQUcsVUFBUyxDQUFDLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDbEQsUUFBSSxZQUFZLENBQUMsY0FBYyxJQUFJLENBQUMsV0FBVyxFQUFFO0FBQy9DLFlBQU0sMkJBQWMsd0JBQXdCLENBQUMsQ0FBQztLQUMvQztBQUNELFFBQUksWUFBWSxDQUFDLFNBQVMsSUFBSSxDQUFDLE1BQU0sRUFBRTtBQUNyQyxZQUFNLDJCQUFjLHlCQUF5QixDQUFDLENBQUM7S0FDaEQ7O0FBRUQsV0FBTyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxZQUFZLENBQUMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxXQUFXLEVBQUUsTUFBTSxDQUFDLENBQUM7R0FDakYsQ0FBQztBQUNGLFNBQU8sR0FBRyxDQUFDO0NBQ1o7O0FBRU0sU0FBUyxXQUFXLENBQUMsU0FBUyxFQUFFLENBQUMsRUFBRSxFQUFFLEVBQUUsSUFBSSxFQUFFLG1CQUFtQixFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUU7QUFDNUYsV0FBUyxJQUFJLENBQUMsT0FBTyxFQUFnQjtRQUFkLE9BQU8seURBQUcsRUFBRTs7QUFDakMsUUFBSSxhQUFhLEdBQUcsTUFBTSxDQUFDO0FBQzNCLFFBQUksTUFBTSxJQUFJLE9BQU8sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLEVBQUU7QUFDbkMsbUJBQWEsR0FBRyxDQUFDLE9BQU8sQ0FBQyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMxQzs7QUFFRCxXQUFPLEVBQUUsQ0FBQyxTQUFTLEVBQ2YsT0FBTyxFQUNQLFNBQVMsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLFFBQVEsRUFDckMsT0FBTyxDQUFDLElBQUksSUFBSSxJQUFJLEVBQ3BCLFdBQVcsSUFBSSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLEVBQ3hELGFBQWEsQ0FBQyxDQUFDO0dBQ3BCOztBQUVELE1BQUksR0FBRyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsQ0FBQyxDQUFDOztBQUV6RSxNQUFJLENBQUMsT0FBTyxHQUFHLENBQUMsQ0FBQztBQUNqQixNQUFJLENBQUMsS0FBSyxHQUFHLE1BQU0sR0FBRyxNQUFNLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztBQUN4QyxNQUFJLENBQUMsV0FBVyxHQUFHLG1CQUFtQixJQUFJLENBQUMsQ0FBQztBQUM1QyxTQUFPLElBQUksQ0FBQztDQUNiOztBQUVNLFNBQVMsY0FBYyxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3hELE1BQUksQ0FBQyxPQUFPLEVBQUU7QUFDWixRQUFJLE9BQU8sQ0FBQyxJQUFJLEtBQUssZ0JBQWdCLEVBQUU7QUFDckMsYUFBTyxHQUFHLE9BQU8sQ0FBQyxJQUFJLENBQUMsZUFBZSxDQUFDLENBQUM7S0FDekMsTUFBTTtBQUNMLGFBQU8sR0FBRyxPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUMxQztHQUNGLE1BQU0sSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFOztBQUV6QyxXQUFPLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztBQUN2QixXQUFPLEdBQUcsT0FBTyxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNyQztBQUNELFNBQU8sT0FBTyxDQUFDO0NBQ2hCOztBQUVNLFNBQVMsYUFBYSxDQUFDLE9BQU8sRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFO0FBQ3ZELFNBQU8sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDO0FBQ3ZCLE1BQUksT0FBTyxDQUFDLEdBQUcsRUFBRTtBQUNmLFdBQU8sQ0FBQyxJQUFJLENBQUMsV0FBVyxHQUFHLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLElBQUksT0FBTyxDQUFDLElBQUksQ0FBQyxXQUFXLENBQUM7R0FDdkU7O0FBRUQsTUFBSSxZQUFZLFlBQUEsQ0FBQztBQUNqQixNQUFJLE9BQU8sQ0FBQyxFQUFFLElBQUksT0FBTyxDQUFDLEVBQUUsS0FBSyxJQUFJLEVBQUU7QUFDckMsV0FBTyxDQUFDLElBQUksR0FBRyxrQkFBWSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFDekMsZ0JBQVksR0FBRyxPQUFPLENBQUMsSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLE9BQU8sQ0FBQyxFQUFFLENBQUM7O0FBRTFELFFBQUksWUFBWSxDQUFDLFFBQVEsRUFBRTtBQUN6QixhQUFPLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLE9BQU8sQ0FBQyxRQUFRLEVBQUUsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0tBQzlFO0dBQ0Y7O0FBRUQsTUFBSSxPQUFPLEtBQUssU0FBUyxJQUFJLFlBQVksRUFBRTtBQUN6QyxXQUFPLEdBQUcsWUFBWSxDQUFDO0dBQ3hCOztBQUVELE1BQUksT0FBTyxLQUFLLFNBQVMsRUFBRTtBQUN6QixVQUFNLDJCQUFjLGNBQWMsR0FBRyxPQUFPLENBQUMsSUFBSSxHQUFHLHFCQUFxQixDQUFDLENBQUM7R0FDNUUsTUFBTSxJQUFJLE9BQU8sWUFBWSxRQUFRLEVBQUU7QUFDdEMsV0FBTyxPQUFPLENBQUMsT0FBTyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0dBQ2xDO0NBQ0Y7O0FBRU0sU0FBUyxJQUFJLEdBQUc7QUFBRSxTQUFPLEVBQUUsQ0FBQztDQUFFOztBQUVyQyxTQUFTLFFBQVEsQ0FBQyxPQUFPLEVBQUUsSUFBSSxFQUFFO0FBQy9CLE1BQUksQ0FBQyxJQUFJLElBQUksRUFBRSxNQUFNLElBQUksSUFBSSxDQUFBLEFBQUMsRUFBRTtBQUM5QixRQUFJLEdBQUcsSUFBSSxHQUFHLGtCQUFZLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztBQUNyQyxRQUFJLENBQUMsSUFBSSxHQUFHLE9BQU8sQ0FBQztHQUNyQjtBQUNELFNBQU8sSUFBSSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxpQkFBaUIsQ0FBQyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLFdBQVcsRUFBRTtBQUN6RSxNQUFJLEVBQUUsQ0FBQyxTQUFTLEVBQUU7QUFDaEIsUUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDO0FBQ2YsUUFBSSxHQUFHLEVBQUUsQ0FBQyxTQUFTLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsTUFBTSxJQUFJLE1BQU0sQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLEVBQUUsV0FBVyxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQzVGLFNBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO0dBQzNCO0FBQ0QsU0FBTyxJQUFJLENBQUM7Q0FDYiIsImZpbGUiOiJydW50aW1lLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgVXRpbHMgZnJvbSAnLi91dGlscyc7XG5pbXBvcnQgRXhjZXB0aW9uIGZyb20gJy4vZXhjZXB0aW9uJztcbmltcG9ydCB7IENPTVBJTEVSX1JFVklTSU9OLCBSRVZJU0lPTl9DSEFOR0VTLCBjcmVhdGVGcmFtZSB9IGZyb20gJy4vYmFzZSc7XG5cbmV4cG9ydCBmdW5jdGlvbiBjaGVja1JldmlzaW9uKGNvbXBpbGVySW5mbykge1xuICBjb25zdCBjb21waWxlclJldmlzaW9uID0gY29tcGlsZXJJbmZvICYmIGNvbXBpbGVySW5mb1swXSB8fCAxLFxuICAgICAgICBjdXJyZW50UmV2aXNpb24gPSBDT01QSUxFUl9SRVZJU0lPTjtcblxuICBpZiAoY29tcGlsZXJSZXZpc2lvbiAhPT0gY3VycmVudFJldmlzaW9uKSB7XG4gICAgaWYgKGNvbXBpbGVyUmV2aXNpb24gPCBjdXJyZW50UmV2aXNpb24pIHtcbiAgICAgIGNvbnN0IHJ1bnRpbWVWZXJzaW9ucyA9IFJFVklTSU9OX0NIQU5HRVNbY3VycmVudFJldmlzaW9uXSxcbiAgICAgICAgICAgIGNvbXBpbGVyVmVyc2lvbnMgPSBSRVZJU0lPTl9DSEFOR0VTW2NvbXBpbGVyUmV2aXNpb25dO1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGVtcGxhdGUgd2FzIHByZWNvbXBpbGVkIHdpdGggYW4gb2xkZXIgdmVyc2lvbiBvZiBIYW5kbGViYXJzIHRoYW4gdGhlIGN1cnJlbnQgcnVudGltZS4gJyArXG4gICAgICAgICAgICAnUGxlYXNlIHVwZGF0ZSB5b3VyIHByZWNvbXBpbGVyIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIHJ1bnRpbWVWZXJzaW9ucyArICcpIG9yIGRvd25ncmFkZSB5b3VyIHJ1bnRpbWUgdG8gYW4gb2xkZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVyVmVyc2lvbnMgKyAnKS4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gVXNlIHRoZSBlbWJlZGRlZCB2ZXJzaW9uIGluZm8gc2luY2UgdGhlIHJ1bnRpbWUgZG9lc24ndCBrbm93IGFib3V0IHRoaXMgcmV2aXNpb24geWV0XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUZW1wbGF0ZSB3YXMgcHJlY29tcGlsZWQgd2l0aCBhIG5ld2VyIHZlcnNpb24gb2YgSGFuZGxlYmFycyB0aGFuIHRoZSBjdXJyZW50IHJ1bnRpbWUuICcgK1xuICAgICAgICAgICAgJ1BsZWFzZSB1cGRhdGUgeW91ciBydW50aW1lIHRvIGEgbmV3ZXIgdmVyc2lvbiAoJyArIGNvbXBpbGVySW5mb1sxXSArICcpLicpO1xuICAgIH1cbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gdGVtcGxhdGUodGVtcGxhdGVTcGVjLCBlbnYpIHtcbiAgLyogaXN0YW5idWwgaWdub3JlIG5leHQgKi9cbiAgaWYgKCFlbnYpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdObyBlbnZpcm9ubWVudCBwYXNzZWQgdG8gdGVtcGxhdGUnKTtcbiAgfVxuICBpZiAoIXRlbXBsYXRlU3BlYyB8fCAhdGVtcGxhdGVTcGVjLm1haW4pIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdVbmtub3duIHRlbXBsYXRlIG9iamVjdDogJyArIHR5cGVvZiB0ZW1wbGF0ZVNwZWMpO1xuICB9XG5cbiAgdGVtcGxhdGVTcGVjLm1haW4uZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjLm1haW5fZDtcblxuICAvLyBOb3RlOiBVc2luZyBlbnYuVk0gcmVmZXJlbmNlcyByYXRoZXIgdGhhbiBsb2NhbCB2YXIgcmVmZXJlbmNlcyB0aHJvdWdob3V0IHRoaXMgc2VjdGlvbiB0byBhbGxvd1xuICAvLyBmb3IgZXh0ZXJuYWwgdXNlcnMgdG8gb3ZlcnJpZGUgdGhlc2UgYXMgcHN1ZWRvLXN1cHBvcnRlZCBBUElzLlxuICBlbnYuVk0uY2hlY2tSZXZpc2lvbih0ZW1wbGF0ZVNwZWMuY29tcGlsZXIpO1xuXG4gIGZ1bmN0aW9uIGludm9rZVBhcnRpYWxXcmFwcGVyKHBhcnRpYWwsIGNvbnRleHQsIG9wdGlvbnMpIHtcbiAgICBpZiAob3B0aW9ucy5oYXNoKSB7XG4gICAgICBjb250ZXh0ID0gVXRpbHMuZXh0ZW5kKHt9LCBjb250ZXh0LCBvcHRpb25zLmhhc2gpO1xuICAgICAgaWYgKG9wdGlvbnMuaWRzKSB7XG4gICAgICAgIG9wdGlvbnMuaWRzWzBdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBwYXJ0aWFsID0gZW52LlZNLnJlc29sdmVQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG4gICAgbGV0IHJlc3VsdCA9IGVudi5WTS5pbnZva2VQYXJ0aWFsLmNhbGwodGhpcywgcGFydGlhbCwgY29udGV4dCwgb3B0aW9ucyk7XG5cbiAgICBpZiAocmVzdWx0ID09IG51bGwgJiYgZW52LmNvbXBpbGUpIHtcbiAgICAgIG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXSA9IGVudi5jb21waWxlKHBhcnRpYWwsIHRlbXBsYXRlU3BlYy5jb21waWxlck9wdGlvbnMsIGVudik7XG4gICAgICByZXN1bHQgPSBvcHRpb25zLnBhcnRpYWxzW29wdGlvbnMubmFtZV0oY29udGV4dCwgb3B0aW9ucyk7XG4gICAgfVxuICAgIGlmIChyZXN1bHQgIT0gbnVsbCkge1xuICAgICAgaWYgKG9wdGlvbnMuaW5kZW50KSB7XG4gICAgICAgIGxldCBsaW5lcyA9IHJlc3VsdC5zcGxpdCgnXFxuJyk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwLCBsID0gbGluZXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgaWYgKCFsaW5lc1tpXSAmJiBpICsgMSA9PT0gbCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGluZXNbaV0gPSBvcHRpb25zLmluZGVudCArIGxpbmVzW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJlc3VsdCA9IGxpbmVzLmpvaW4oJ1xcbicpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhyb3cgbmV3IEV4Y2VwdGlvbignVGhlIHBhcnRpYWwgJyArIG9wdGlvbnMubmFtZSArICcgY291bGQgbm90IGJlIGNvbXBpbGVkIHdoZW4gcnVubmluZyBpbiBydW50aW1lLW9ubHkgbW9kZScpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEp1c3QgYWRkIHdhdGVyXG4gIGxldCBjb250YWluZXIgPSB7XG4gICAgc3RyaWN0OiBmdW5jdGlvbihvYmosIG5hbWUpIHtcbiAgICAgIGlmICghKG5hbWUgaW4gb2JqKSkge1xuICAgICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdcIicgKyBuYW1lICsgJ1wiIG5vdCBkZWZpbmVkIGluICcgKyBvYmopO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG9ialtuYW1lXTtcbiAgICB9LFxuICAgIGxvb2t1cDogZnVuY3Rpb24oZGVwdGhzLCBuYW1lKSB7XG4gICAgICBjb25zdCBsZW4gPSBkZXB0aHMubGVuZ3RoO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBpZiAoZGVwdGhzW2ldICYmIGRlcHRoc1tpXVtuYW1lXSAhPSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGRlcHRoc1tpXVtuYW1lXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgbGFtYmRhOiBmdW5jdGlvbihjdXJyZW50LCBjb250ZXh0KSB7XG4gICAgICByZXR1cm4gdHlwZW9mIGN1cnJlbnQgPT09ICdmdW5jdGlvbicgPyBjdXJyZW50LmNhbGwoY29udGV4dCkgOiBjdXJyZW50O1xuICAgIH0sXG5cbiAgICBlc2NhcGVFeHByZXNzaW9uOiBVdGlscy5lc2NhcGVFeHByZXNzaW9uLFxuICAgIGludm9rZVBhcnRpYWw6IGludm9rZVBhcnRpYWxXcmFwcGVyLFxuXG4gICAgZm46IGZ1bmN0aW9uKGkpIHtcbiAgICAgIGxldCByZXQgPSB0ZW1wbGF0ZVNwZWNbaV07XG4gICAgICByZXQuZGVjb3JhdG9yID0gdGVtcGxhdGVTcGVjW2kgKyAnX2QnXTtcbiAgICAgIHJldHVybiByZXQ7XG4gICAgfSxcblxuICAgIHByb2dyYW1zOiBbXSxcbiAgICBwcm9ncmFtOiBmdW5jdGlvbihpLCBkYXRhLCBkZWNsYXJlZEJsb2NrUGFyYW1zLCBibG9ja1BhcmFtcywgZGVwdGhzKSB7XG4gICAgICBsZXQgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldLFxuICAgICAgICAgIGZuID0gdGhpcy5mbihpKTtcbiAgICAgIGlmIChkYXRhIHx8IGRlcHRocyB8fCBibG9ja1BhcmFtcyB8fCBkZWNsYXJlZEJsb2NrUGFyYW1zKSB7XG4gICAgICAgIHByb2dyYW1XcmFwcGVyID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgICAgfSBlbHNlIGlmICghcHJvZ3JhbVdyYXBwZXIpIHtcbiAgICAgICAgcHJvZ3JhbVdyYXBwZXIgPSB0aGlzLnByb2dyYW1zW2ldID0gd3JhcFByb2dyYW0odGhpcywgaSwgZm4pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHByb2dyYW1XcmFwcGVyO1xuICAgIH0sXG5cbiAgICBkYXRhOiBmdW5jdGlvbih2YWx1ZSwgZGVwdGgpIHtcbiAgICAgIHdoaWxlICh2YWx1ZSAmJiBkZXB0aC0tKSB7XG4gICAgICAgIHZhbHVlID0gdmFsdWUuX3BhcmVudDtcbiAgICAgIH1cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9LFxuICAgIG1lcmdlOiBmdW5jdGlvbihwYXJhbSwgY29tbW9uKSB7XG4gICAgICBsZXQgb2JqID0gcGFyYW0gfHwgY29tbW9uO1xuXG4gICAgICBpZiAocGFyYW0gJiYgY29tbW9uICYmIChwYXJhbSAhPT0gY29tbW9uKSkge1xuICAgICAgICBvYmogPSBVdGlscy5leHRlbmQoe30sIGNvbW1vbiwgcGFyYW0pO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gb2JqO1xuICAgIH0sXG5cbiAgICBub29wOiBlbnYuVk0ubm9vcCxcbiAgICBjb21waWxlckluZm86IHRlbXBsYXRlU3BlYy5jb21waWxlclxuICB9O1xuXG4gIGZ1bmN0aW9uIHJldChjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgZGF0YSA9IG9wdGlvbnMuZGF0YTtcblxuICAgIHJldC5fc2V0dXAob3B0aW9ucyk7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwgJiYgdGVtcGxhdGVTcGVjLnVzZURhdGEpIHtcbiAgICAgIGRhdGEgPSBpbml0RGF0YShjb250ZXh0LCBkYXRhKTtcbiAgICB9XG4gICAgbGV0IGRlcHRocyxcbiAgICAgICAgYmxvY2tQYXJhbXMgPSB0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgPyBbXSA6IHVuZGVmaW5lZDtcbiAgICBpZiAodGVtcGxhdGVTcGVjLnVzZURlcHRocykge1xuICAgICAgaWYgKG9wdGlvbnMuZGVwdGhzKSB7XG4gICAgICAgIGRlcHRocyA9IGNvbnRleHQgIT09IG9wdGlvbnMuZGVwdGhzWzBdID8gW2NvbnRleHRdLmNvbmNhdChvcHRpb25zLmRlcHRocykgOiBvcHRpb25zLmRlcHRocztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRlcHRocyA9IFtjb250ZXh0XTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICBmdW5jdGlvbiBtYWluKGNvbnRleHQvKiwgb3B0aW9ucyovKSB7XG4gICAgICByZXR1cm4gJycgKyB0ZW1wbGF0ZVNwZWMubWFpbihjb250YWluZXIsIGNvbnRleHQsIGNvbnRhaW5lci5oZWxwZXJzLCBjb250YWluZXIucGFydGlhbHMsIGRhdGEsIGJsb2NrUGFyYW1zLCBkZXB0aHMpO1xuICAgIH1cbiAgICBtYWluID0gZXhlY3V0ZURlY29yYXRvcnModGVtcGxhdGVTcGVjLm1haW4sIG1haW4sIGNvbnRhaW5lciwgb3B0aW9ucy5kZXB0aHMgfHwgW10sIGRhdGEsIGJsb2NrUGFyYW1zKTtcbiAgICByZXR1cm4gbWFpbihjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxuICByZXQuaXNUb3AgPSB0cnVlO1xuXG4gIHJldC5fc2V0dXAgPSBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgaWYgKCFvcHRpb25zLnBhcnRpYWwpIHtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMuaGVscGVycywgZW52LmhlbHBlcnMpO1xuXG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwpIHtcbiAgICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gY29udGFpbmVyLm1lcmdlKG9wdGlvbnMucGFydGlhbHMsIGVudi5wYXJ0aWFscyk7XG4gICAgICB9XG4gICAgICBpZiAodGVtcGxhdGVTcGVjLnVzZVBhcnRpYWwgfHwgdGVtcGxhdGVTcGVjLnVzZURlY29yYXRvcnMpIHtcbiAgICAgICAgY29udGFpbmVyLmRlY29yYXRvcnMgPSBjb250YWluZXIubWVyZ2Uob3B0aW9ucy5kZWNvcmF0b3JzLCBlbnYuZGVjb3JhdG9ycyk7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnRhaW5lci5oZWxwZXJzID0gb3B0aW9ucy5oZWxwZXJzO1xuICAgICAgY29udGFpbmVyLnBhcnRpYWxzID0gb3B0aW9ucy5wYXJ0aWFscztcbiAgICAgIGNvbnRhaW5lci5kZWNvcmF0b3JzID0gb3B0aW9ucy5kZWNvcmF0b3JzO1xuICAgIH1cbiAgfTtcblxuICByZXQuX2NoaWxkID0gZnVuY3Rpb24oaSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocykge1xuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlQmxvY2tQYXJhbXMgJiYgIWJsb2NrUGFyYW1zKSB7XG4gICAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdtdXN0IHBhc3MgYmxvY2sgcGFyYW1zJyk7XG4gICAgfVxuICAgIGlmICh0ZW1wbGF0ZVNwZWMudXNlRGVwdGhzICYmICFkZXB0aHMpIHtcbiAgICAgIHRocm93IG5ldyBFeGNlcHRpb24oJ211c3QgcGFzcyBwYXJlbnQgZGVwdGhzJyk7XG4gICAgfVxuXG4gICAgcmV0dXJuIHdyYXBQcm9ncmFtKGNvbnRhaW5lciwgaSwgdGVtcGxhdGVTcGVjW2ldLCBkYXRhLCAwLCBibG9ja1BhcmFtcywgZGVwdGhzKTtcbiAgfTtcbiAgcmV0dXJuIHJldDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHdyYXBQcm9ncmFtKGNvbnRhaW5lciwgaSwgZm4sIGRhdGEsIGRlY2xhcmVkQmxvY2tQYXJhbXMsIGJsb2NrUGFyYW1zLCBkZXB0aHMpIHtcbiAgZnVuY3Rpb24gcHJvZyhjb250ZXh0LCBvcHRpb25zID0ge30pIHtcbiAgICBsZXQgY3VycmVudERlcHRocyA9IGRlcHRocztcbiAgICBpZiAoZGVwdGhzICYmIGNvbnRleHQgIT09IGRlcHRoc1swXSkge1xuICAgICAgY3VycmVudERlcHRocyA9IFtjb250ZXh0XS5jb25jYXQoZGVwdGhzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm4oY29udGFpbmVyLFxuICAgICAgICBjb250ZXh0LFxuICAgICAgICBjb250YWluZXIuaGVscGVycywgY29udGFpbmVyLnBhcnRpYWxzLFxuICAgICAgICBvcHRpb25zLmRhdGEgfHwgZGF0YSxcbiAgICAgICAgYmxvY2tQYXJhbXMgJiYgW29wdGlvbnMuYmxvY2tQYXJhbXNdLmNvbmNhdChibG9ja1BhcmFtcyksXG4gICAgICAgIGN1cnJlbnREZXB0aHMpO1xuICB9XG5cbiAgcHJvZyA9IGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpO1xuXG4gIHByb2cucHJvZ3JhbSA9IGk7XG4gIHByb2cuZGVwdGggPSBkZXB0aHMgPyBkZXB0aHMubGVuZ3RoIDogMDtcbiAgcHJvZy5ibG9ja1BhcmFtcyA9IGRlY2xhcmVkQmxvY2tQYXJhbXMgfHwgMDtcbiAgcmV0dXJuIHByb2c7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiByZXNvbHZlUGFydGlhbChwYXJ0aWFsLCBjb250ZXh0LCBvcHRpb25zKSB7XG4gIGlmICghcGFydGlhbCkge1xuICAgIGlmIChvcHRpb25zLm5hbWUgPT09ICdAcGFydGlhbC1ibG9jaycpIHtcbiAgICAgIHBhcnRpYWwgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXTtcbiAgICB9IGVsc2Uge1xuICAgICAgcGFydGlhbCA9IG9wdGlvbnMucGFydGlhbHNbb3B0aW9ucy5uYW1lXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoIXBhcnRpYWwuY2FsbCAmJiAhb3B0aW9ucy5uYW1lKSB7XG4gICAgLy8gVGhpcyBpcyBhIGR5bmFtaWMgcGFydGlhbCB0aGF0IHJldHVybmVkIGEgc3RyaW5nXG4gICAgb3B0aW9ucy5uYW1lID0gcGFydGlhbDtcbiAgICBwYXJ0aWFsID0gb3B0aW9ucy5wYXJ0aWFsc1twYXJ0aWFsXTtcbiAgfVxuICByZXR1cm4gcGFydGlhbDtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGludm9rZVBhcnRpYWwocGFydGlhbCwgY29udGV4dCwgb3B0aW9ucykge1xuICBvcHRpb25zLnBhcnRpYWwgPSB0cnVlO1xuICBpZiAob3B0aW9ucy5pZHMpIHtcbiAgICBvcHRpb25zLmRhdGEuY29udGV4dFBhdGggPSBvcHRpb25zLmlkc1swXSB8fCBvcHRpb25zLmRhdGEuY29udGV4dFBhdGg7XG4gIH1cblxuICBsZXQgcGFydGlhbEJsb2NrO1xuICBpZiAob3B0aW9ucy5mbiAmJiBvcHRpb25zLmZuICE9PSBub29wKSB7XG4gICAgb3B0aW9ucy5kYXRhID0gY3JlYXRlRnJhbWUob3B0aW9ucy5kYXRhKTtcbiAgICBwYXJ0aWFsQmxvY2sgPSBvcHRpb25zLmRhdGFbJ3BhcnRpYWwtYmxvY2snXSA9IG9wdGlvbnMuZm47XG5cbiAgICBpZiAocGFydGlhbEJsb2NrLnBhcnRpYWxzKSB7XG4gICAgICBvcHRpb25zLnBhcnRpYWxzID0gVXRpbHMuZXh0ZW5kKHt9LCBvcHRpb25zLnBhcnRpYWxzLCBwYXJ0aWFsQmxvY2sucGFydGlhbHMpO1xuICAgIH1cbiAgfVxuXG4gIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQgJiYgcGFydGlhbEJsb2NrKSB7XG4gICAgcGFydGlhbCA9IHBhcnRpYWxCbG9jaztcbiAgfVxuXG4gIGlmIChwYXJ0aWFsID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXhjZXB0aW9uKCdUaGUgcGFydGlhbCAnICsgb3B0aW9ucy5uYW1lICsgJyBjb3VsZCBub3QgYmUgZm91bmQnKTtcbiAgfSBlbHNlIGlmIChwYXJ0aWFsIGluc3RhbmNlb2YgRnVuY3Rpb24pIHtcbiAgICByZXR1cm4gcGFydGlhbChjb250ZXh0LCBvcHRpb25zKTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gbm9vcCgpIHsgcmV0dXJuICcnOyB9XG5cbmZ1bmN0aW9uIGluaXREYXRhKGNvbnRleHQsIGRhdGEpIHtcbiAgaWYgKCFkYXRhIHx8ICEoJ3Jvb3QnIGluIGRhdGEpKSB7XG4gICAgZGF0YSA9IGRhdGEgPyBjcmVhdGVGcmFtZShkYXRhKSA6IHt9O1xuICAgIGRhdGEucm9vdCA9IGNvbnRleHQ7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59XG5cbmZ1bmN0aW9uIGV4ZWN1dGVEZWNvcmF0b3JzKGZuLCBwcm9nLCBjb250YWluZXIsIGRlcHRocywgZGF0YSwgYmxvY2tQYXJhbXMpIHtcbiAgaWYgKGZuLmRlY29yYXRvcikge1xuICAgIGxldCBwcm9wcyA9IHt9O1xuICAgIHByb2cgPSBmbi5kZWNvcmF0b3IocHJvZywgcHJvcHMsIGNvbnRhaW5lciwgZGVwdGhzICYmIGRlcHRoc1swXSwgZGF0YSwgYmxvY2tQYXJhbXMsIGRlcHRocyk7XG4gICAgVXRpbHMuZXh0ZW5kKHByb2csIHByb3BzKTtcbiAgfVxuICByZXR1cm4gcHJvZztcbn1cbiJdfQ==


/***/ },
/* 30 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global window */
	'use strict';

	exports.__esModule = true;

	exports['default'] = function (Handlebars) {
	  /* istanbul ignore next */
	  var root = typeof global !== 'undefined' ? global : window,
	      $Handlebars = root.Handlebars;
	  /* istanbul ignore next */
	  Handlebars.noConflict = function () {
	    if (root.Handlebars === Handlebars) {
	      root.Handlebars = $Handlebars;
	    }
	    return Handlebars;
	  };
	};

	module.exports = exports['default'];
	//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uL2xpYi9oYW5kbGViYXJzL25vLWNvbmZsaWN0LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7O3FCQUNlLFVBQVMsVUFBVSxFQUFFOztBQUVsQyxNQUFJLElBQUksR0FBRyxPQUFPLE1BQU0sS0FBSyxXQUFXLEdBQUcsTUFBTSxHQUFHLE1BQU07TUFDdEQsV0FBVyxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUM7O0FBRWxDLFlBQVUsQ0FBQyxVQUFVLEdBQUcsWUFBVztBQUNqQyxRQUFJLElBQUksQ0FBQyxVQUFVLEtBQUssVUFBVSxFQUFFO0FBQ2xDLFVBQUksQ0FBQyxVQUFVLEdBQUcsV0FBVyxDQUFDO0tBQy9CO0FBQ0QsV0FBTyxVQUFVLENBQUM7R0FDbkIsQ0FBQztDQUNIIiwiZmlsZSI6Im5vLWNvbmZsaWN0LmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogZ2xvYmFsIHdpbmRvdyAqL1xuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24oSGFuZGxlYmFycykge1xuICAvKiBpc3RhbmJ1bCBpZ25vcmUgbmV4dCAqL1xuICBsZXQgcm9vdCA9IHR5cGVvZiBnbG9iYWwgIT09ICd1bmRlZmluZWQnID8gZ2xvYmFsIDogd2luZG93LFxuICAgICAgJEhhbmRsZWJhcnMgPSByb290LkhhbmRsZWJhcnM7XG4gIC8qIGlzdGFuYnVsIGlnbm9yZSBuZXh0ICovXG4gIEhhbmRsZWJhcnMubm9Db25mbGljdCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmIChyb290LkhhbmRsZWJhcnMgPT09IEhhbmRsZWJhcnMpIHtcbiAgICAgIHJvb3QuSGFuZGxlYmFycyA9ICRIYW5kbGViYXJzO1xuICAgIH1cbiAgICByZXR1cm4gSGFuZGxlYmFycztcbiAgfTtcbn1cbiJdfQ==

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var getFormFields = __webpack_require__(7);

	var api = __webpack_require__(32);
	var ui = __webpack_require__(33);

	var onSignUp = function onSignUp(event) {
	  event.preventDefault();
	  var data = getFormFields(event.target);
	  api.signUp(data).then(ui.signUpSuccess).then(function () {
	    return api.signIn(data);
	  }).then(ui.signInSuccess).catch(ui.failure);
	};

	var onSignIn = function onSignIn(event) {
	  event.preventDefault();
	  var data = getFormFields(event.target);
	  api.signIn(data).done(ui.signInSuccess).fail(ui.failure);
	};

	var onSignOut = function onSignOut(event) {
	  event.preventDefault();
	  api.signOut().done(ui.signOutSuccess).fail(ui.failure);
	};

	var onChangePassword = function onChangePassword(event) {
	  event.preventDefault();
	  var data = getFormFields(event.target);
	  api.changePassword(data).done(ui.changePasswordSuccess).fail(ui.failure);
	};

	var addHandlers = function addHandlers() {
	  $('.sign-up').on('submit', onSignUp);
	  $('.sign-in').on('submit', onSignIn);
	  $('.sign-out').on('submit', onSignOut);
	  $('.change-password').on('submit', onChangePassword);
	};

	module.exports = {
	  addHandlers: addHandlers
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var app = __webpack_require__(9);

	var signUp = function signUp(data) {
	  return new Promise(function (resolve, reject) {
	    return $.ajax({
	      url: app.host + '/sign-up',
	      method: "POST",
	      data: data,
	      success: function success(response) {
	        resolve(response);
	      },
	      error: function error(_error) {
	        reject(_error);
	      }
	    });
	  });
	};

	var signIn = function signIn(data) {
	  return $.ajax({
	    url: app.host + '/sign-in',
	    method: "POST",
	    data: data
	  });
	};

	var signOut = function signOut() {
	  return $.ajax({
	    url: app.host + '/sign-out/' + app.user.id,
	    method: "DELETE",
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    }
	  });
	};

	var changePassword = function changePassword(data) {
	  return $.ajax({
	    url: app.host + '/change-password/' + app.user.id,
	    method: "PATCH",
	    headers: {
	      Authorization: 'Token token=' + app.user.token
	    },
	    data: data
	  });
	};

	module.exports = {
	  signUp: signUp,
	  signIn: signIn,
	  signOut: signOut,
	  changePassword: changePassword
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function($) {'use strict';

	var app = __webpack_require__(9);

	var success = function success(data) {
	  if (data) {
	    console.log(data);
	  } else {
	    console.log('Success');
	  }
	};

	var failure = function failure(error) {
	  console.error(error);
	};

	var signUpSuccess = function signUpSuccess() {
	  // $('.signed-in').text("Signed up!");
	  // $('form').trigger('reset');
	};

	var signInSuccess = function signInSuccess(data) {
	  app.user = data.user;
	  $('.sign-up').hide();
	  $('.sign-in').hide();
	  $('.sign-out').show();
	  $('.change-password').show();
	  $('.get-posts').show();
	  $('.signed-in').text('Signed in as: ' + app.user.email);
	  $('form').trigger('reset');
	};

	var signOutSuccess = function signOutSuccess() {
	  app.user = null;
	  $('.feed').html('');
	  $('.get-posts').hide();
	  $('.get-single-post').hide();
	  $('.change-password').hide();
	  $('.sign-out').hide();
	  $('.sign-up').show();
	  $('.sign-in').show();
	  $('.signed-in').text('Sign in to start!');
	};

	var changePasswordSuccess = function changePasswordSuccess() {
	  $('.signed-in').text("Password changed successfully!");
	  $('form').trigger('reset');
	};

	module.exports = {
	  success: success,
	  failure: failure,
	  signUpSuccess: signUpSuccess,
	  signInSuccess: signInSuccess,
	  signOutSuccess: signOutSuccess,
	  changePasswordSuccess: changePasswordSuccess
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(2)))

/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag

	// load the styles
	var content = __webpack_require__(35);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(43)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./index.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(36)();
	// imports
	exports.push([module.id, "@import url(https://fonts.googleapis.com/css?family=Exo+2);", ""]);

	// module
	exports.push([module.id, "@charset \"UTF-8\";\n/*!\n * Bootstrap v3.3.7 (http://getbootstrap.com)\n * Copyright 2011-2016 Twitter, Inc.\n * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)\n */\n/*! normalize.css v3.0.3 | MIT License | github.com/necolas/normalize.css */\nhtml {\n  font-family: sans-serif;\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%; }\n\nbody {\n  margin: 0; }\n\narticle,\naside,\ndetails,\nfigcaption,\nfigure,\nfooter,\nheader,\nhgroup,\nmain,\nmenu,\nnav,\nsection,\nsummary {\n  display: block; }\n\naudio,\ncanvas,\nprogress,\nvideo {\n  display: inline-block;\n  vertical-align: baseline; }\n\naudio:not([controls]) {\n  display: none;\n  height: 0; }\n\n[hidden],\ntemplate {\n  display: none; }\n\na {\n  background-color: transparent; }\n\na:active,\na:hover {\n  outline: 0; }\n\nabbr[title] {\n  border-bottom: 1px dotted; }\n\nb,\nstrong {\n  font-weight: bold; }\n\ndfn {\n  font-style: italic; }\n\nh1 {\n  font-size: 2em;\n  margin: 0.67em 0; }\n\nmark {\n  background: #ff0;\n  color: #000; }\n\nsmall {\n  font-size: 80%; }\n\nsub,\nsup {\n  font-size: 75%;\n  line-height: 0;\n  position: relative;\n  vertical-align: baseline; }\n\nsup {\n  top: -0.5em; }\n\nsub {\n  bottom: -0.25em; }\n\nimg {\n  border: 0; }\n\nsvg:not(:root) {\n  overflow: hidden; }\n\nfigure {\n  margin: 1em 40px; }\n\nhr {\n  box-sizing: content-box;\n  height: 0; }\n\npre {\n  overflow: auto; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: monospace, monospace;\n  font-size: 1em; }\n\nbutton,\ninput,\noptgroup,\nselect,\ntextarea {\n  color: inherit;\n  font: inherit;\n  margin: 0; }\n\nbutton {\n  overflow: visible; }\n\nbutton,\nselect {\n  text-transform: none; }\n\nbutton,\nhtml input[type=\"button\"],\ninput[type=\"reset\"],\ninput[type=\"submit\"] {\n  -webkit-appearance: button;\n  cursor: pointer; }\n\nbutton[disabled],\nhtml input[disabled] {\n  cursor: default; }\n\nbutton::-moz-focus-inner,\ninput::-moz-focus-inner {\n  border: 0;\n  padding: 0; }\n\ninput {\n  line-height: normal; }\n\ninput[type=\"checkbox\"],\ninput[type=\"radio\"] {\n  box-sizing: border-box;\n  padding: 0; }\n\ninput[type=\"number\"]::-webkit-inner-spin-button,\ninput[type=\"number\"]::-webkit-outer-spin-button {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: textfield;\n  box-sizing: content-box; }\n\ninput[type=\"search\"]::-webkit-search-cancel-button,\ninput[type=\"search\"]::-webkit-search-decoration {\n  -webkit-appearance: none; }\n\nfieldset {\n  border: 1px solid #c0c0c0;\n  margin: 0 2px;\n  padding: 0.35em 0.625em 0.75em; }\n\nlegend {\n  border: 0;\n  padding: 0; }\n\ntextarea {\n  overflow: auto; }\n\noptgroup {\n  font-weight: bold; }\n\ntable {\n  border-collapse: collapse;\n  border-spacing: 0; }\n\ntd,\nth {\n  padding: 0; }\n\n/*! Source: https://github.com/h5bp/html5-boilerplate/blob/master/src/css/main.css */\n@media print {\n  *,\n  *:before,\n  *:after {\n    background: transparent !important;\n    color: #000 !important;\n    box-shadow: none !important;\n    text-shadow: none !important; }\n  a,\n  a:visited {\n    text-decoration: underline; }\n  a[href]:after {\n    content: \" (\" attr(href) \")\"; }\n  abbr[title]:after {\n    content: \" (\" attr(title) \")\"; }\n  a[href^=\"#\"]:after,\n  a[href^=\"javascript:\"]:after {\n    content: \"\"; }\n  pre,\n  blockquote {\n    border: 1px solid #999;\n    page-break-inside: avoid; }\n  thead {\n    display: table-header-group; }\n  tr,\n  img {\n    page-break-inside: avoid; }\n  img {\n    max-width: 100% !important; }\n  p,\n  h2,\n  h3 {\n    orphans: 3;\n    widows: 3; }\n  h2,\n  h3 {\n    page-break-after: avoid; }\n  .navbar {\n    display: none; }\n  .btn > .caret,\n  .dropup > .btn > .caret {\n    border-top-color: #000 !important; }\n  .label {\n    border: 1px solid #000; }\n  .table {\n    border-collapse: collapse !important; }\n    .table td,\n    .table th {\n      background-color: #fff !important; }\n  .table-bordered th,\n  .table-bordered td {\n    border: 1px solid #ddd !important; } }\n\n@font-face {\n  font-family: 'Glyphicons Halflings';\n  src: url(" + __webpack_require__(37) + ");\n  src: url(" + __webpack_require__(37) + "?#iefix) format(\"embedded-opentype\"), url(" + __webpack_require__(38) + ") format(\"woff2\"), url(" + __webpack_require__(39) + ") format(\"woff\"), url(" + __webpack_require__(40) + ") format(\"truetype\"), url(" + __webpack_require__(41) + "#glyphicons_halflingsregular) format(\"svg\"); }\n\n.glyphicon {\n  position: relative;\n  top: 1px;\n  display: inline-block;\n  font-family: 'Glyphicons Halflings';\n  font-style: normal;\n  font-weight: normal;\n  line-height: 1;\n  -webkit-font-smoothing: antialiased;\n  -moz-osx-font-smoothing: grayscale; }\n\n.glyphicon-asterisk:before {\n  content: \"*\"; }\n\n.glyphicon-plus:before {\n  content: \"+\"; }\n\n.glyphicon-euro:before,\n.glyphicon-eur:before {\n  content: \"\\20AC\"; }\n\n.glyphicon-minus:before {\n  content: \"\\2212\"; }\n\n.glyphicon-cloud:before {\n  content: \"\\2601\"; }\n\n.glyphicon-envelope:before {\n  content: \"\\2709\"; }\n\n.glyphicon-pencil:before {\n  content: \"\\270F\"; }\n\n.glyphicon-glass:before {\n  content: \"\\E001\"; }\n\n.glyphicon-music:before {\n  content: \"\\E002\"; }\n\n.glyphicon-search:before {\n  content: \"\\E003\"; }\n\n.glyphicon-heart:before {\n  content: \"\\E005\"; }\n\n.glyphicon-star:before {\n  content: \"\\E006\"; }\n\n.glyphicon-star-empty:before {\n  content: \"\\E007\"; }\n\n.glyphicon-user:before {\n  content: \"\\E008\"; }\n\n.glyphicon-film:before {\n  content: \"\\E009\"; }\n\n.glyphicon-th-large:before {\n  content: \"\\E010\"; }\n\n.glyphicon-th:before {\n  content: \"\\E011\"; }\n\n.glyphicon-th-list:before {\n  content: \"\\E012\"; }\n\n.glyphicon-ok:before {\n  content: \"\\E013\"; }\n\n.glyphicon-remove:before {\n  content: \"\\E014\"; }\n\n.glyphicon-zoom-in:before {\n  content: \"\\E015\"; }\n\n.glyphicon-zoom-out:before {\n  content: \"\\E016\"; }\n\n.glyphicon-off:before {\n  content: \"\\E017\"; }\n\n.glyphicon-signal:before {\n  content: \"\\E018\"; }\n\n.glyphicon-cog:before {\n  content: \"\\E019\"; }\n\n.glyphicon-trash:before {\n  content: \"\\E020\"; }\n\n.glyphicon-home:before {\n  content: \"\\E021\"; }\n\n.glyphicon-file:before {\n  content: \"\\E022\"; }\n\n.glyphicon-time:before {\n  content: \"\\E023\"; }\n\n.glyphicon-road:before {\n  content: \"\\E024\"; }\n\n.glyphicon-download-alt:before {\n  content: \"\\E025\"; }\n\n.glyphicon-download:before {\n  content: \"\\E026\"; }\n\n.glyphicon-upload:before {\n  content: \"\\E027\"; }\n\n.glyphicon-inbox:before {\n  content: \"\\E028\"; }\n\n.glyphicon-play-circle:before {\n  content: \"\\E029\"; }\n\n.glyphicon-repeat:before {\n  content: \"\\E030\"; }\n\n.glyphicon-refresh:before {\n  content: \"\\E031\"; }\n\n.glyphicon-list-alt:before {\n  content: \"\\E032\"; }\n\n.glyphicon-lock:before {\n  content: \"\\E033\"; }\n\n.glyphicon-flag:before {\n  content: \"\\E034\"; }\n\n.glyphicon-headphones:before {\n  content: \"\\E035\"; }\n\n.glyphicon-volume-off:before {\n  content: \"\\E036\"; }\n\n.glyphicon-volume-down:before {\n  content: \"\\E037\"; }\n\n.glyphicon-volume-up:before {\n  content: \"\\E038\"; }\n\n.glyphicon-qrcode:before {\n  content: \"\\E039\"; }\n\n.glyphicon-barcode:before {\n  content: \"\\E040\"; }\n\n.glyphicon-tag:before {\n  content: \"\\E041\"; }\n\n.glyphicon-tags:before {\n  content: \"\\E042\"; }\n\n.glyphicon-book:before {\n  content: \"\\E043\"; }\n\n.glyphicon-bookmark:before {\n  content: \"\\E044\"; }\n\n.glyphicon-print:before {\n  content: \"\\E045\"; }\n\n.glyphicon-camera:before {\n  content: \"\\E046\"; }\n\n.glyphicon-font:before {\n  content: \"\\E047\"; }\n\n.glyphicon-bold:before {\n  content: \"\\E048\"; }\n\n.glyphicon-italic:before {\n  content: \"\\E049\"; }\n\n.glyphicon-text-height:before {\n  content: \"\\E050\"; }\n\n.glyphicon-text-width:before {\n  content: \"\\E051\"; }\n\n.glyphicon-align-left:before {\n  content: \"\\E052\"; }\n\n.glyphicon-align-center:before {\n  content: \"\\E053\"; }\n\n.glyphicon-align-right:before {\n  content: \"\\E054\"; }\n\n.glyphicon-align-justify:before {\n  content: \"\\E055\"; }\n\n.glyphicon-list:before {\n  content: \"\\E056\"; }\n\n.glyphicon-indent-left:before {\n  content: \"\\E057\"; }\n\n.glyphicon-indent-right:before {\n  content: \"\\E058\"; }\n\n.glyphicon-facetime-video:before {\n  content: \"\\E059\"; }\n\n.glyphicon-picture:before {\n  content: \"\\E060\"; }\n\n.glyphicon-map-marker:before {\n  content: \"\\E062\"; }\n\n.glyphicon-adjust:before {\n  content: \"\\E063\"; }\n\n.glyphicon-tint:before {\n  content: \"\\E064\"; }\n\n.glyphicon-edit:before {\n  content: \"\\E065\"; }\n\n.glyphicon-share:before {\n  content: \"\\E066\"; }\n\n.glyphicon-check:before {\n  content: \"\\E067\"; }\n\n.glyphicon-move:before {\n  content: \"\\E068\"; }\n\n.glyphicon-step-backward:before {\n  content: \"\\E069\"; }\n\n.glyphicon-fast-backward:before {\n  content: \"\\E070\"; }\n\n.glyphicon-backward:before {\n  content: \"\\E071\"; }\n\n.glyphicon-play:before {\n  content: \"\\E072\"; }\n\n.glyphicon-pause:before {\n  content: \"\\E073\"; }\n\n.glyphicon-stop:before {\n  content: \"\\E074\"; }\n\n.glyphicon-forward:before {\n  content: \"\\E075\"; }\n\n.glyphicon-fast-forward:before {\n  content: \"\\E076\"; }\n\n.glyphicon-step-forward:before {\n  content: \"\\E077\"; }\n\n.glyphicon-eject:before {\n  content: \"\\E078\"; }\n\n.glyphicon-chevron-left:before {\n  content: \"\\E079\"; }\n\n.glyphicon-chevron-right:before {\n  content: \"\\E080\"; }\n\n.glyphicon-plus-sign:before {\n  content: \"\\E081\"; }\n\n.glyphicon-minus-sign:before {\n  content: \"\\E082\"; }\n\n.glyphicon-remove-sign:before {\n  content: \"\\E083\"; }\n\n.glyphicon-ok-sign:before {\n  content: \"\\E084\"; }\n\n.glyphicon-question-sign:before {\n  content: \"\\E085\"; }\n\n.glyphicon-info-sign:before {\n  content: \"\\E086\"; }\n\n.glyphicon-screenshot:before {\n  content: \"\\E087\"; }\n\n.glyphicon-remove-circle:before {\n  content: \"\\E088\"; }\n\n.glyphicon-ok-circle:before {\n  content: \"\\E089\"; }\n\n.glyphicon-ban-circle:before {\n  content: \"\\E090\"; }\n\n.glyphicon-arrow-left:before {\n  content: \"\\E091\"; }\n\n.glyphicon-arrow-right:before {\n  content: \"\\E092\"; }\n\n.glyphicon-arrow-up:before {\n  content: \"\\E093\"; }\n\n.glyphicon-arrow-down:before {\n  content: \"\\E094\"; }\n\n.glyphicon-share-alt:before {\n  content: \"\\E095\"; }\n\n.glyphicon-resize-full:before {\n  content: \"\\E096\"; }\n\n.glyphicon-resize-small:before {\n  content: \"\\E097\"; }\n\n.glyphicon-exclamation-sign:before {\n  content: \"\\E101\"; }\n\n.glyphicon-gift:before {\n  content: \"\\E102\"; }\n\n.glyphicon-leaf:before {\n  content: \"\\E103\"; }\n\n.glyphicon-fire:before {\n  content: \"\\E104\"; }\n\n.glyphicon-eye-open:before {\n  content: \"\\E105\"; }\n\n.glyphicon-eye-close:before {\n  content: \"\\E106\"; }\n\n.glyphicon-warning-sign:before {\n  content: \"\\E107\"; }\n\n.glyphicon-plane:before {\n  content: \"\\E108\"; }\n\n.glyphicon-calendar:before {\n  content: \"\\E109\"; }\n\n.glyphicon-random:before {\n  content: \"\\E110\"; }\n\n.glyphicon-comment:before {\n  content: \"\\E111\"; }\n\n.glyphicon-magnet:before {\n  content: \"\\E112\"; }\n\n.glyphicon-chevron-up:before {\n  content: \"\\E113\"; }\n\n.glyphicon-chevron-down:before {\n  content: \"\\E114\"; }\n\n.glyphicon-retweet:before {\n  content: \"\\E115\"; }\n\n.glyphicon-shopping-cart:before {\n  content: \"\\E116\"; }\n\n.glyphicon-folder-close:before {\n  content: \"\\E117\"; }\n\n.glyphicon-folder-open:before {\n  content: \"\\E118\"; }\n\n.glyphicon-resize-vertical:before {\n  content: \"\\E119\"; }\n\n.glyphicon-resize-horizontal:before {\n  content: \"\\E120\"; }\n\n.glyphicon-hdd:before {\n  content: \"\\E121\"; }\n\n.glyphicon-bullhorn:before {\n  content: \"\\E122\"; }\n\n.glyphicon-bell:before {\n  content: \"\\E123\"; }\n\n.glyphicon-certificate:before {\n  content: \"\\E124\"; }\n\n.glyphicon-thumbs-up:before {\n  content: \"\\E125\"; }\n\n.glyphicon-thumbs-down:before {\n  content: \"\\E126\"; }\n\n.glyphicon-hand-right:before {\n  content: \"\\E127\"; }\n\n.glyphicon-hand-left:before {\n  content: \"\\E128\"; }\n\n.glyphicon-hand-up:before {\n  content: \"\\E129\"; }\n\n.glyphicon-hand-down:before {\n  content: \"\\E130\"; }\n\n.glyphicon-circle-arrow-right:before {\n  content: \"\\E131\"; }\n\n.glyphicon-circle-arrow-left:before {\n  content: \"\\E132\"; }\n\n.glyphicon-circle-arrow-up:before {\n  content: \"\\E133\"; }\n\n.glyphicon-circle-arrow-down:before {\n  content: \"\\E134\"; }\n\n.glyphicon-globe:before {\n  content: \"\\E135\"; }\n\n.glyphicon-wrench:before {\n  content: \"\\E136\"; }\n\n.glyphicon-tasks:before {\n  content: \"\\E137\"; }\n\n.glyphicon-filter:before {\n  content: \"\\E138\"; }\n\n.glyphicon-briefcase:before {\n  content: \"\\E139\"; }\n\n.glyphicon-fullscreen:before {\n  content: \"\\E140\"; }\n\n.glyphicon-dashboard:before {\n  content: \"\\E141\"; }\n\n.glyphicon-paperclip:before {\n  content: \"\\E142\"; }\n\n.glyphicon-heart-empty:before {\n  content: \"\\E143\"; }\n\n.glyphicon-link:before {\n  content: \"\\E144\"; }\n\n.glyphicon-phone:before {\n  content: \"\\E145\"; }\n\n.glyphicon-pushpin:before {\n  content: \"\\E146\"; }\n\n.glyphicon-usd:before {\n  content: \"\\E148\"; }\n\n.glyphicon-gbp:before {\n  content: \"\\E149\"; }\n\n.glyphicon-sort:before {\n  content: \"\\E150\"; }\n\n.glyphicon-sort-by-alphabet:before {\n  content: \"\\E151\"; }\n\n.glyphicon-sort-by-alphabet-alt:before {\n  content: \"\\E152\"; }\n\n.glyphicon-sort-by-order:before {\n  content: \"\\E153\"; }\n\n.glyphicon-sort-by-order-alt:before {\n  content: \"\\E154\"; }\n\n.glyphicon-sort-by-attributes:before {\n  content: \"\\E155\"; }\n\n.glyphicon-sort-by-attributes-alt:before {\n  content: \"\\E156\"; }\n\n.glyphicon-unchecked:before {\n  content: \"\\E157\"; }\n\n.glyphicon-expand:before {\n  content: \"\\E158\"; }\n\n.glyphicon-collapse-down:before {\n  content: \"\\E159\"; }\n\n.glyphicon-collapse-up:before {\n  content: \"\\E160\"; }\n\n.glyphicon-log-in:before {\n  content: \"\\E161\"; }\n\n.glyphicon-flash:before {\n  content: \"\\E162\"; }\n\n.glyphicon-log-out:before {\n  content: \"\\E163\"; }\n\n.glyphicon-new-window:before {\n  content: \"\\E164\"; }\n\n.glyphicon-record:before {\n  content: \"\\E165\"; }\n\n.glyphicon-save:before {\n  content: \"\\E166\"; }\n\n.glyphicon-open:before {\n  content: \"\\E167\"; }\n\n.glyphicon-saved:before {\n  content: \"\\E168\"; }\n\n.glyphicon-import:before {\n  content: \"\\E169\"; }\n\n.glyphicon-export:before {\n  content: \"\\E170\"; }\n\n.glyphicon-send:before {\n  content: \"\\E171\"; }\n\n.glyphicon-floppy-disk:before {\n  content: \"\\E172\"; }\n\n.glyphicon-floppy-saved:before {\n  content: \"\\E173\"; }\n\n.glyphicon-floppy-remove:before {\n  content: \"\\E174\"; }\n\n.glyphicon-floppy-save:before {\n  content: \"\\E175\"; }\n\n.glyphicon-floppy-open:before {\n  content: \"\\E176\"; }\n\n.glyphicon-credit-card:before {\n  content: \"\\E177\"; }\n\n.glyphicon-transfer:before {\n  content: \"\\E178\"; }\n\n.glyphicon-cutlery:before {\n  content: \"\\E179\"; }\n\n.glyphicon-header:before {\n  content: \"\\E180\"; }\n\n.glyphicon-compressed:before {\n  content: \"\\E181\"; }\n\n.glyphicon-earphone:before {\n  content: \"\\E182\"; }\n\n.glyphicon-phone-alt:before {\n  content: \"\\E183\"; }\n\n.glyphicon-tower:before {\n  content: \"\\E184\"; }\n\n.glyphicon-stats:before {\n  content: \"\\E185\"; }\n\n.glyphicon-sd-video:before {\n  content: \"\\E186\"; }\n\n.glyphicon-hd-video:before {\n  content: \"\\E187\"; }\n\n.glyphicon-subtitles:before {\n  content: \"\\E188\"; }\n\n.glyphicon-sound-stereo:before {\n  content: \"\\E189\"; }\n\n.glyphicon-sound-dolby:before {\n  content: \"\\E190\"; }\n\n.glyphicon-sound-5-1:before {\n  content: \"\\E191\"; }\n\n.glyphicon-sound-6-1:before {\n  content: \"\\E192\"; }\n\n.glyphicon-sound-7-1:before {\n  content: \"\\E193\"; }\n\n.glyphicon-copyright-mark:before {\n  content: \"\\E194\"; }\n\n.glyphicon-registration-mark:before {\n  content: \"\\E195\"; }\n\n.glyphicon-cloud-download:before {\n  content: \"\\E197\"; }\n\n.glyphicon-cloud-upload:before {\n  content: \"\\E198\"; }\n\n.glyphicon-tree-conifer:before {\n  content: \"\\E199\"; }\n\n.glyphicon-tree-deciduous:before {\n  content: \"\\E200\"; }\n\n.glyphicon-cd:before {\n  content: \"\\E201\"; }\n\n.glyphicon-save-file:before {\n  content: \"\\E202\"; }\n\n.glyphicon-open-file:before {\n  content: \"\\E203\"; }\n\n.glyphicon-level-up:before {\n  content: \"\\E204\"; }\n\n.glyphicon-copy:before {\n  content: \"\\E205\"; }\n\n.glyphicon-paste:before {\n  content: \"\\E206\"; }\n\n.glyphicon-alert:before {\n  content: \"\\E209\"; }\n\n.glyphicon-equalizer:before {\n  content: \"\\E210\"; }\n\n.glyphicon-king:before {\n  content: \"\\E211\"; }\n\n.glyphicon-queen:before {\n  content: \"\\E212\"; }\n\n.glyphicon-pawn:before {\n  content: \"\\E213\"; }\n\n.glyphicon-bishop:before {\n  content: \"\\E214\"; }\n\n.glyphicon-knight:before {\n  content: \"\\E215\"; }\n\n.glyphicon-baby-formula:before {\n  content: \"\\E216\"; }\n\n.glyphicon-tent:before {\n  content: \"\\26FA\"; }\n\n.glyphicon-blackboard:before {\n  content: \"\\E218\"; }\n\n.glyphicon-bed:before {\n  content: \"\\E219\"; }\n\n.glyphicon-apple:before {\n  content: \"\\F8FF\"; }\n\n.glyphicon-erase:before {\n  content: \"\\E221\"; }\n\n.glyphicon-hourglass:before {\n  content: \"\\231B\"; }\n\n.glyphicon-lamp:before {\n  content: \"\\E223\"; }\n\n.glyphicon-duplicate:before {\n  content: \"\\E224\"; }\n\n.glyphicon-piggy-bank:before {\n  content: \"\\E225\"; }\n\n.glyphicon-scissors:before {\n  content: \"\\E226\"; }\n\n.glyphicon-bitcoin:before {\n  content: \"\\E227\"; }\n\n.glyphicon-btc:before {\n  content: \"\\E227\"; }\n\n.glyphicon-xbt:before {\n  content: \"\\E227\"; }\n\n.glyphicon-yen:before {\n  content: \"\\A5\"; }\n\n.glyphicon-jpy:before {\n  content: \"\\A5\"; }\n\n.glyphicon-ruble:before {\n  content: \"\\20BD\"; }\n\n.glyphicon-rub:before {\n  content: \"\\20BD\"; }\n\n.glyphicon-scale:before {\n  content: \"\\E230\"; }\n\n.glyphicon-ice-lolly:before {\n  content: \"\\E231\"; }\n\n.glyphicon-ice-lolly-tasted:before {\n  content: \"\\E232\"; }\n\n.glyphicon-education:before {\n  content: \"\\E233\"; }\n\n.glyphicon-option-horizontal:before {\n  content: \"\\E234\"; }\n\n.glyphicon-option-vertical:before {\n  content: \"\\E235\"; }\n\n.glyphicon-menu-hamburger:before {\n  content: \"\\E236\"; }\n\n.glyphicon-modal-window:before {\n  content: \"\\E237\"; }\n\n.glyphicon-oil:before {\n  content: \"\\E238\"; }\n\n.glyphicon-grain:before {\n  content: \"\\E239\"; }\n\n.glyphicon-sunglasses:before {\n  content: \"\\E240\"; }\n\n.glyphicon-text-size:before {\n  content: \"\\E241\"; }\n\n.glyphicon-text-color:before {\n  content: \"\\E242\"; }\n\n.glyphicon-text-background:before {\n  content: \"\\E243\"; }\n\n.glyphicon-object-align-top:before {\n  content: \"\\E244\"; }\n\n.glyphicon-object-align-bottom:before {\n  content: \"\\E245\"; }\n\n.glyphicon-object-align-horizontal:before {\n  content: \"\\E246\"; }\n\n.glyphicon-object-align-left:before {\n  content: \"\\E247\"; }\n\n.glyphicon-object-align-vertical:before {\n  content: \"\\E248\"; }\n\n.glyphicon-object-align-right:before {\n  content: \"\\E249\"; }\n\n.glyphicon-triangle-right:before {\n  content: \"\\E250\"; }\n\n.glyphicon-triangle-left:before {\n  content: \"\\E251\"; }\n\n.glyphicon-triangle-bottom:before {\n  content: \"\\E252\"; }\n\n.glyphicon-triangle-top:before {\n  content: \"\\E253\"; }\n\n.glyphicon-console:before {\n  content: \"\\E254\"; }\n\n.glyphicon-superscript:before {\n  content: \"\\E255\"; }\n\n.glyphicon-subscript:before {\n  content: \"\\E256\"; }\n\n.glyphicon-menu-left:before {\n  content: \"\\E257\"; }\n\n.glyphicon-menu-right:before {\n  content: \"\\E258\"; }\n\n.glyphicon-menu-down:before {\n  content: \"\\E259\"; }\n\n.glyphicon-menu-up:before {\n  content: \"\\E260\"; }\n\n* {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\n*:before,\n*:after {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\nhtml {\n  font-size: 10px;\n  -webkit-tap-highlight-color: transparent; }\n\nbody {\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #333333;\n  background-color: #fff; }\n\ninput,\nbutton,\nselect,\ntextarea {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit; }\n\na {\n  color: #337ab7;\n  text-decoration: none; }\n  a:hover, a:focus {\n    color: #23527c;\n    text-decoration: underline; }\n  a:focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n\nfigure {\n  margin: 0; }\n\nimg {\n  vertical-align: middle; }\n\n.img-responsive {\n  display: block;\n  max-width: 100%;\n  height: auto; }\n\n.img-rounded {\n  border-radius: 6px; }\n\n.img-thumbnail {\n  padding: 4px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: all 0.2s ease-in-out;\n  -o-transition: all 0.2s ease-in-out;\n  transition: all 0.2s ease-in-out;\n  display: inline-block;\n  max-width: 100%;\n  height: auto; }\n\n.img-circle {\n  border-radius: 50%; }\n\nhr {\n  margin-top: 20px;\n  margin-bottom: 20px;\n  border: 0;\n  border-top: 1px solid #eeeeee; }\n\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  margin: -1px;\n  padding: 0;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  border: 0; }\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  position: static;\n  width: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  clip: auto; }\n\n[role=\"button\"] {\n  cursor: pointer; }\n\nh1, h2, h3, h4, h5, h6,\n.h1, .h2, .h3, .h4, .h5, .h6 {\n  font-family: inherit;\n  font-weight: 500;\n  line-height: 1.1;\n  color: inherit; }\n  h1 small,\n  h1 .small, h2 small,\n  h2 .small, h3 small,\n  h3 .small, h4 small,\n  h4 .small, h5 small,\n  h5 .small, h6 small,\n  h6 .small,\n  .h1 small,\n  .h1 .small, .h2 small,\n  .h2 .small, .h3 small,\n  .h3 .small, .h4 small,\n  .h4 .small, .h5 small,\n  .h5 .small, .h6 small,\n  .h6 .small {\n    font-weight: normal;\n    line-height: 1;\n    color: #777777; }\n\nh1, .h1,\nh2, .h2,\nh3, .h3 {\n  margin-top: 20px;\n  margin-bottom: 10px; }\n  h1 small,\n  h1 .small, .h1 small,\n  .h1 .small,\n  h2 small,\n  h2 .small, .h2 small,\n  .h2 .small,\n  h3 small,\n  h3 .small, .h3 small,\n  .h3 .small {\n    font-size: 65%; }\n\nh4, .h4,\nh5, .h5,\nh6, .h6 {\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  h4 small,\n  h4 .small, .h4 small,\n  .h4 .small,\n  h5 small,\n  h5 .small, .h5 small,\n  .h5 .small,\n  h6 small,\n  h6 .small, .h6 small,\n  .h6 .small {\n    font-size: 75%; }\n\nh1, .h1 {\n  font-size: 36px; }\n\nh2, .h2 {\n  font-size: 30px; }\n\nh3, .h3 {\n  font-size: 24px; }\n\nh4, .h4 {\n  font-size: 18px; }\n\nh5, .h5 {\n  font-size: 14px; }\n\nh6, .h6 {\n  font-size: 12px; }\n\np {\n  margin: 0 0 10px; }\n\n.lead {\n  margin-bottom: 20px;\n  font-size: 16px;\n  font-weight: 300;\n  line-height: 1.4; }\n  @media (min-width: 768px) {\n    .lead {\n      font-size: 21px; } }\n\nsmall,\n.small {\n  font-size: 85%; }\n\nmark,\n.mark {\n  background-color: #fcf8e3;\n  padding: .2em; }\n\n.text-left {\n  text-align: left; }\n\n.text-right {\n  text-align: right; }\n\n.text-center {\n  text-align: center; }\n\n.text-justify {\n  text-align: justify; }\n\n.text-nowrap {\n  white-space: nowrap; }\n\n.text-lowercase {\n  text-transform: lowercase; }\n\n.text-uppercase, .initialism {\n  text-transform: uppercase; }\n\n.text-capitalize {\n  text-transform: capitalize; }\n\n.text-muted {\n  color: #777777; }\n\n.text-primary {\n  color: #337ab7; }\n\na.text-primary:hover,\na.text-primary:focus {\n  color: #286090; }\n\n.text-success {\n  color: #3c763d; }\n\na.text-success:hover,\na.text-success:focus {\n  color: #2b542c; }\n\n.text-info {\n  color: #31708f; }\n\na.text-info:hover,\na.text-info:focus {\n  color: #245269; }\n\n.text-warning {\n  color: #8a6d3b; }\n\na.text-warning:hover,\na.text-warning:focus {\n  color: #66512c; }\n\n.text-danger {\n  color: #a94442; }\n\na.text-danger:hover,\na.text-danger:focus {\n  color: #843534; }\n\n.bg-primary {\n  color: #fff; }\n\n.bg-primary {\n  background-color: #337ab7; }\n\na.bg-primary:hover,\na.bg-primary:focus {\n  background-color: #286090; }\n\n.bg-success {\n  background-color: #dff0d8; }\n\na.bg-success:hover,\na.bg-success:focus {\n  background-color: #c1e2b3; }\n\n.bg-info {\n  background-color: #d9edf7; }\n\na.bg-info:hover,\na.bg-info:focus {\n  background-color: #afd9ee; }\n\n.bg-warning {\n  background-color: #fcf8e3; }\n\na.bg-warning:hover,\na.bg-warning:focus {\n  background-color: #f7ecb5; }\n\n.bg-danger {\n  background-color: #f2dede; }\n\na.bg-danger:hover,\na.bg-danger:focus {\n  background-color: #e4b9b9; }\n\n.page-header {\n  padding-bottom: 9px;\n  margin: 40px 0 20px;\n  border-bottom: 1px solid #eeeeee; }\n\nul,\nol {\n  margin-top: 0;\n  margin-bottom: 10px; }\n  ul ul,\n  ul ol,\n  ol ul,\n  ol ol {\n    margin-bottom: 0; }\n\n.list-unstyled {\n  padding-left: 0;\n  list-style: none; }\n\n.list-inline {\n  padding-left: 0;\n  list-style: none;\n  margin-left: -5px; }\n  .list-inline > li {\n    display: inline-block;\n    padding-left: 5px;\n    padding-right: 5px; }\n\ndl {\n  margin-top: 0;\n  margin-bottom: 20px; }\n\ndt,\ndd {\n  line-height: 1.42857; }\n\ndt {\n  font-weight: bold; }\n\ndd {\n  margin-left: 0; }\n\n.dl-horizontal dd:before, .dl-horizontal dd:after {\n  content: \" \";\n  display: table; }\n\n.dl-horizontal dd:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .dl-horizontal dt {\n    float: left;\n    width: 160px;\n    clear: left;\n    text-align: right;\n    overflow: hidden;\n    text-overflow: ellipsis;\n    white-space: nowrap; }\n  .dl-horizontal dd {\n    margin-left: 180px; } }\n\nabbr[title],\nabbr[data-original-title] {\n  cursor: help;\n  border-bottom: 1px dotted #777777; }\n\n.initialism {\n  font-size: 90%; }\n\nblockquote {\n  padding: 10px 20px;\n  margin: 0 0 20px;\n  font-size: 17.5px;\n  border-left: 5px solid #eeeeee; }\n  blockquote p:last-child,\n  blockquote ul:last-child,\n  blockquote ol:last-child {\n    margin-bottom: 0; }\n  blockquote footer,\n  blockquote small,\n  blockquote .small {\n    display: block;\n    font-size: 80%;\n    line-height: 1.42857;\n    color: #777777; }\n    blockquote footer:before,\n    blockquote small:before,\n    blockquote .small:before {\n      content: '\\2014   \\A0'; }\n\n.blockquote-reverse,\nblockquote.pull-right {\n  padding-right: 15px;\n  padding-left: 0;\n  border-right: 5px solid #eeeeee;\n  border-left: 0;\n  text-align: right; }\n  .blockquote-reverse footer:before,\n  .blockquote-reverse small:before,\n  .blockquote-reverse .small:before,\n  blockquote.pull-right footer:before,\n  blockquote.pull-right small:before,\n  blockquote.pull-right .small:before {\n    content: ''; }\n  .blockquote-reverse footer:after,\n  .blockquote-reverse small:after,\n  .blockquote-reverse .small:after,\n  blockquote.pull-right footer:after,\n  blockquote.pull-right small:after,\n  blockquote.pull-right .small:after {\n    content: '\\A0   \\2014'; }\n\naddress {\n  margin-bottom: 20px;\n  font-style: normal;\n  line-height: 1.42857; }\n\ncode,\nkbd,\npre,\nsamp {\n  font-family: Menlo, Monaco, Consolas, \"Courier New\", monospace; }\n\ncode {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #c7254e;\n  background-color: #f9f2f4;\n  border-radius: 4px; }\n\nkbd {\n  padding: 2px 4px;\n  font-size: 90%;\n  color: #fff;\n  background-color: #333;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.25); }\n  kbd kbd {\n    padding: 0;\n    font-size: 100%;\n    font-weight: bold;\n    box-shadow: none; }\n\npre {\n  display: block;\n  padding: 9.5px;\n  margin: 0 0 10px;\n  font-size: 13px;\n  line-height: 1.42857;\n  word-break: break-all;\n  word-wrap: break-word;\n  color: #333333;\n  background-color: #f5f5f5;\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  pre code {\n    padding: 0;\n    font-size: inherit;\n    color: inherit;\n    white-space: pre-wrap;\n    background-color: transparent;\n    border-radius: 0; }\n\n.pre-scrollable {\n  max-height: 340px;\n  overflow-y: scroll; }\n\n.container {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container:before, .container:after {\n    content: \" \";\n    display: table; }\n  .container:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .container {\n      width: 750px; } }\n  @media (min-width: 992px) {\n    .container {\n      width: 970px; } }\n  @media (min-width: 1200px) {\n    .container {\n      width: 1170px; } }\n\n.container-fluid {\n  margin-right: auto;\n  margin-left: auto;\n  padding-left: 15px;\n  padding-right: 15px; }\n  .container-fluid:before, .container-fluid:after {\n    content: \" \";\n    display: table; }\n  .container-fluid:after {\n    clear: both; }\n\n.row {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .row:before, .row:after {\n    content: \" \";\n    display: table; }\n  .row:after {\n    clear: both; }\n\n.col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 {\n  position: relative;\n  min-height: 1px;\n  padding-left: 15px;\n  padding-right: 15px; }\n\n.col-xs-1, .col-xs-2, .col-xs-3, .col-xs-4, .col-xs-5, .col-xs-6, .col-xs-7, .col-xs-8, .col-xs-9, .col-xs-10, .col-xs-11, .col-xs-12 {\n  float: left; }\n\n.col-xs-1 {\n  width: 8.33333%; }\n\n.col-xs-2 {\n  width: 16.66667%; }\n\n.col-xs-3 {\n  width: 25%; }\n\n.col-xs-4 {\n  width: 33.33333%; }\n\n.col-xs-5 {\n  width: 41.66667%; }\n\n.col-xs-6 {\n  width: 50%; }\n\n.col-xs-7 {\n  width: 58.33333%; }\n\n.col-xs-8 {\n  width: 66.66667%; }\n\n.col-xs-9 {\n  width: 75%; }\n\n.col-xs-10 {\n  width: 83.33333%; }\n\n.col-xs-11 {\n  width: 91.66667%; }\n\n.col-xs-12 {\n  width: 100%; }\n\n.col-xs-pull-0 {\n  right: auto; }\n\n.col-xs-pull-1 {\n  right: 8.33333%; }\n\n.col-xs-pull-2 {\n  right: 16.66667%; }\n\n.col-xs-pull-3 {\n  right: 25%; }\n\n.col-xs-pull-4 {\n  right: 33.33333%; }\n\n.col-xs-pull-5 {\n  right: 41.66667%; }\n\n.col-xs-pull-6 {\n  right: 50%; }\n\n.col-xs-pull-7 {\n  right: 58.33333%; }\n\n.col-xs-pull-8 {\n  right: 66.66667%; }\n\n.col-xs-pull-9 {\n  right: 75%; }\n\n.col-xs-pull-10 {\n  right: 83.33333%; }\n\n.col-xs-pull-11 {\n  right: 91.66667%; }\n\n.col-xs-pull-12 {\n  right: 100%; }\n\n.col-xs-push-0 {\n  left: auto; }\n\n.col-xs-push-1 {\n  left: 8.33333%; }\n\n.col-xs-push-2 {\n  left: 16.66667%; }\n\n.col-xs-push-3 {\n  left: 25%; }\n\n.col-xs-push-4 {\n  left: 33.33333%; }\n\n.col-xs-push-5 {\n  left: 41.66667%; }\n\n.col-xs-push-6 {\n  left: 50%; }\n\n.col-xs-push-7 {\n  left: 58.33333%; }\n\n.col-xs-push-8 {\n  left: 66.66667%; }\n\n.col-xs-push-9 {\n  left: 75%; }\n\n.col-xs-push-10 {\n  left: 83.33333%; }\n\n.col-xs-push-11 {\n  left: 91.66667%; }\n\n.col-xs-push-12 {\n  left: 100%; }\n\n.col-xs-offset-0 {\n  margin-left: 0%; }\n\n.col-xs-offset-1 {\n  margin-left: 8.33333%; }\n\n.col-xs-offset-2 {\n  margin-left: 16.66667%; }\n\n.col-xs-offset-3 {\n  margin-left: 25%; }\n\n.col-xs-offset-4 {\n  margin-left: 33.33333%; }\n\n.col-xs-offset-5 {\n  margin-left: 41.66667%; }\n\n.col-xs-offset-6 {\n  margin-left: 50%; }\n\n.col-xs-offset-7 {\n  margin-left: 58.33333%; }\n\n.col-xs-offset-8 {\n  margin-left: 66.66667%; }\n\n.col-xs-offset-9 {\n  margin-left: 75%; }\n\n.col-xs-offset-10 {\n  margin-left: 83.33333%; }\n\n.col-xs-offset-11 {\n  margin-left: 91.66667%; }\n\n.col-xs-offset-12 {\n  margin-left: 100%; }\n\n@media (min-width: 768px) {\n  .col-sm-1, .col-sm-2, .col-sm-3, .col-sm-4, .col-sm-5, .col-sm-6, .col-sm-7, .col-sm-8, .col-sm-9, .col-sm-10, .col-sm-11, .col-sm-12 {\n    float: left; }\n  .col-sm-1 {\n    width: 8.33333%; }\n  .col-sm-2 {\n    width: 16.66667%; }\n  .col-sm-3 {\n    width: 25%; }\n  .col-sm-4 {\n    width: 33.33333%; }\n  .col-sm-5 {\n    width: 41.66667%; }\n  .col-sm-6 {\n    width: 50%; }\n  .col-sm-7 {\n    width: 58.33333%; }\n  .col-sm-8 {\n    width: 66.66667%; }\n  .col-sm-9 {\n    width: 75%; }\n  .col-sm-10 {\n    width: 83.33333%; }\n  .col-sm-11 {\n    width: 91.66667%; }\n  .col-sm-12 {\n    width: 100%; }\n  .col-sm-pull-0 {\n    right: auto; }\n  .col-sm-pull-1 {\n    right: 8.33333%; }\n  .col-sm-pull-2 {\n    right: 16.66667%; }\n  .col-sm-pull-3 {\n    right: 25%; }\n  .col-sm-pull-4 {\n    right: 33.33333%; }\n  .col-sm-pull-5 {\n    right: 41.66667%; }\n  .col-sm-pull-6 {\n    right: 50%; }\n  .col-sm-pull-7 {\n    right: 58.33333%; }\n  .col-sm-pull-8 {\n    right: 66.66667%; }\n  .col-sm-pull-9 {\n    right: 75%; }\n  .col-sm-pull-10 {\n    right: 83.33333%; }\n  .col-sm-pull-11 {\n    right: 91.66667%; }\n  .col-sm-pull-12 {\n    right: 100%; }\n  .col-sm-push-0 {\n    left: auto; }\n  .col-sm-push-1 {\n    left: 8.33333%; }\n  .col-sm-push-2 {\n    left: 16.66667%; }\n  .col-sm-push-3 {\n    left: 25%; }\n  .col-sm-push-4 {\n    left: 33.33333%; }\n  .col-sm-push-5 {\n    left: 41.66667%; }\n  .col-sm-push-6 {\n    left: 50%; }\n  .col-sm-push-7 {\n    left: 58.33333%; }\n  .col-sm-push-8 {\n    left: 66.66667%; }\n  .col-sm-push-9 {\n    left: 75%; }\n  .col-sm-push-10 {\n    left: 83.33333%; }\n  .col-sm-push-11 {\n    left: 91.66667%; }\n  .col-sm-push-12 {\n    left: 100%; }\n  .col-sm-offset-0 {\n    margin-left: 0%; }\n  .col-sm-offset-1 {\n    margin-left: 8.33333%; }\n  .col-sm-offset-2 {\n    margin-left: 16.66667%; }\n  .col-sm-offset-3 {\n    margin-left: 25%; }\n  .col-sm-offset-4 {\n    margin-left: 33.33333%; }\n  .col-sm-offset-5 {\n    margin-left: 41.66667%; }\n  .col-sm-offset-6 {\n    margin-left: 50%; }\n  .col-sm-offset-7 {\n    margin-left: 58.33333%; }\n  .col-sm-offset-8 {\n    margin-left: 66.66667%; }\n  .col-sm-offset-9 {\n    margin-left: 75%; }\n  .col-sm-offset-10 {\n    margin-left: 83.33333%; }\n  .col-sm-offset-11 {\n    margin-left: 91.66667%; }\n  .col-sm-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 992px) {\n  .col-md-1, .col-md-2, .col-md-3, .col-md-4, .col-md-5, .col-md-6, .col-md-7, .col-md-8, .col-md-9, .col-md-10, .col-md-11, .col-md-12 {\n    float: left; }\n  .col-md-1 {\n    width: 8.33333%; }\n  .col-md-2 {\n    width: 16.66667%; }\n  .col-md-3 {\n    width: 25%; }\n  .col-md-4 {\n    width: 33.33333%; }\n  .col-md-5 {\n    width: 41.66667%; }\n  .col-md-6 {\n    width: 50%; }\n  .col-md-7 {\n    width: 58.33333%; }\n  .col-md-8 {\n    width: 66.66667%; }\n  .col-md-9 {\n    width: 75%; }\n  .col-md-10 {\n    width: 83.33333%; }\n  .col-md-11 {\n    width: 91.66667%; }\n  .col-md-12 {\n    width: 100%; }\n  .col-md-pull-0 {\n    right: auto; }\n  .col-md-pull-1 {\n    right: 8.33333%; }\n  .col-md-pull-2 {\n    right: 16.66667%; }\n  .col-md-pull-3 {\n    right: 25%; }\n  .col-md-pull-4 {\n    right: 33.33333%; }\n  .col-md-pull-5 {\n    right: 41.66667%; }\n  .col-md-pull-6 {\n    right: 50%; }\n  .col-md-pull-7 {\n    right: 58.33333%; }\n  .col-md-pull-8 {\n    right: 66.66667%; }\n  .col-md-pull-9 {\n    right: 75%; }\n  .col-md-pull-10 {\n    right: 83.33333%; }\n  .col-md-pull-11 {\n    right: 91.66667%; }\n  .col-md-pull-12 {\n    right: 100%; }\n  .col-md-push-0 {\n    left: auto; }\n  .col-md-push-1 {\n    left: 8.33333%; }\n  .col-md-push-2 {\n    left: 16.66667%; }\n  .col-md-push-3 {\n    left: 25%; }\n  .col-md-push-4 {\n    left: 33.33333%; }\n  .col-md-push-5 {\n    left: 41.66667%; }\n  .col-md-push-6 {\n    left: 50%; }\n  .col-md-push-7 {\n    left: 58.33333%; }\n  .col-md-push-8 {\n    left: 66.66667%; }\n  .col-md-push-9 {\n    left: 75%; }\n  .col-md-push-10 {\n    left: 83.33333%; }\n  .col-md-push-11 {\n    left: 91.66667%; }\n  .col-md-push-12 {\n    left: 100%; }\n  .col-md-offset-0 {\n    margin-left: 0%; }\n  .col-md-offset-1 {\n    margin-left: 8.33333%; }\n  .col-md-offset-2 {\n    margin-left: 16.66667%; }\n  .col-md-offset-3 {\n    margin-left: 25%; }\n  .col-md-offset-4 {\n    margin-left: 33.33333%; }\n  .col-md-offset-5 {\n    margin-left: 41.66667%; }\n  .col-md-offset-6 {\n    margin-left: 50%; }\n  .col-md-offset-7 {\n    margin-left: 58.33333%; }\n  .col-md-offset-8 {\n    margin-left: 66.66667%; }\n  .col-md-offset-9 {\n    margin-left: 75%; }\n  .col-md-offset-10 {\n    margin-left: 83.33333%; }\n  .col-md-offset-11 {\n    margin-left: 91.66667%; }\n  .col-md-offset-12 {\n    margin-left: 100%; } }\n\n@media (min-width: 1200px) {\n  .col-lg-1, .col-lg-2, .col-lg-3, .col-lg-4, .col-lg-5, .col-lg-6, .col-lg-7, .col-lg-8, .col-lg-9, .col-lg-10, .col-lg-11, .col-lg-12 {\n    float: left; }\n  .col-lg-1 {\n    width: 8.33333%; }\n  .col-lg-2 {\n    width: 16.66667%; }\n  .col-lg-3 {\n    width: 25%; }\n  .col-lg-4 {\n    width: 33.33333%; }\n  .col-lg-5 {\n    width: 41.66667%; }\n  .col-lg-6 {\n    width: 50%; }\n  .col-lg-7 {\n    width: 58.33333%; }\n  .col-lg-8 {\n    width: 66.66667%; }\n  .col-lg-9 {\n    width: 75%; }\n  .col-lg-10 {\n    width: 83.33333%; }\n  .col-lg-11 {\n    width: 91.66667%; }\n  .col-lg-12 {\n    width: 100%; }\n  .col-lg-pull-0 {\n    right: auto; }\n  .col-lg-pull-1 {\n    right: 8.33333%; }\n  .col-lg-pull-2 {\n    right: 16.66667%; }\n  .col-lg-pull-3 {\n    right: 25%; }\n  .col-lg-pull-4 {\n    right: 33.33333%; }\n  .col-lg-pull-5 {\n    right: 41.66667%; }\n  .col-lg-pull-6 {\n    right: 50%; }\n  .col-lg-pull-7 {\n    right: 58.33333%; }\n  .col-lg-pull-8 {\n    right: 66.66667%; }\n  .col-lg-pull-9 {\n    right: 75%; }\n  .col-lg-pull-10 {\n    right: 83.33333%; }\n  .col-lg-pull-11 {\n    right: 91.66667%; }\n  .col-lg-pull-12 {\n    right: 100%; }\n  .col-lg-push-0 {\n    left: auto; }\n  .col-lg-push-1 {\n    left: 8.33333%; }\n  .col-lg-push-2 {\n    left: 16.66667%; }\n  .col-lg-push-3 {\n    left: 25%; }\n  .col-lg-push-4 {\n    left: 33.33333%; }\n  .col-lg-push-5 {\n    left: 41.66667%; }\n  .col-lg-push-6 {\n    left: 50%; }\n  .col-lg-push-7 {\n    left: 58.33333%; }\n  .col-lg-push-8 {\n    left: 66.66667%; }\n  .col-lg-push-9 {\n    left: 75%; }\n  .col-lg-push-10 {\n    left: 83.33333%; }\n  .col-lg-push-11 {\n    left: 91.66667%; }\n  .col-lg-push-12 {\n    left: 100%; }\n  .col-lg-offset-0 {\n    margin-left: 0%; }\n  .col-lg-offset-1 {\n    margin-left: 8.33333%; }\n  .col-lg-offset-2 {\n    margin-left: 16.66667%; }\n  .col-lg-offset-3 {\n    margin-left: 25%; }\n  .col-lg-offset-4 {\n    margin-left: 33.33333%; }\n  .col-lg-offset-5 {\n    margin-left: 41.66667%; }\n  .col-lg-offset-6 {\n    margin-left: 50%; }\n  .col-lg-offset-7 {\n    margin-left: 58.33333%; }\n  .col-lg-offset-8 {\n    margin-left: 66.66667%; }\n  .col-lg-offset-9 {\n    margin-left: 75%; }\n  .col-lg-offset-10 {\n    margin-left: 83.33333%; }\n  .col-lg-offset-11 {\n    margin-left: 91.66667%; }\n  .col-lg-offset-12 {\n    margin-left: 100%; } }\n\ntable {\n  background-color: transparent; }\n\ncaption {\n  padding-top: 8px;\n  padding-bottom: 8px;\n  color: #777777;\n  text-align: left; }\n\nth {\n  text-align: left; }\n\n.table {\n  width: 100%;\n  max-width: 100%;\n  margin-bottom: 20px; }\n  .table > thead > tr > th,\n  .table > thead > tr > td,\n  .table > tbody > tr > th,\n  .table > tbody > tr > td,\n  .table > tfoot > tr > th,\n  .table > tfoot > tr > td {\n    padding: 8px;\n    line-height: 1.42857;\n    vertical-align: top;\n    border-top: 1px solid #ddd; }\n  .table > thead > tr > th {\n    vertical-align: bottom;\n    border-bottom: 2px solid #ddd; }\n  .table > caption + thead > tr:first-child > th,\n  .table > caption + thead > tr:first-child > td,\n  .table > colgroup + thead > tr:first-child > th,\n  .table > colgroup + thead > tr:first-child > td,\n  .table > thead:first-child > tr:first-child > th,\n  .table > thead:first-child > tr:first-child > td {\n    border-top: 0; }\n  .table > tbody + tbody {\n    border-top: 2px solid #ddd; }\n  .table .table {\n    background-color: #fff; }\n\n.table-condensed > thead > tr > th,\n.table-condensed > thead > tr > td,\n.table-condensed > tbody > tr > th,\n.table-condensed > tbody > tr > td,\n.table-condensed > tfoot > tr > th,\n.table-condensed > tfoot > tr > td {\n  padding: 5px; }\n\n.table-bordered {\n  border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td,\n  .table-bordered > tbody > tr > th,\n  .table-bordered > tbody > tr > td,\n  .table-bordered > tfoot > tr > th,\n  .table-bordered > tfoot > tr > td {\n    border: 1px solid #ddd; }\n  .table-bordered > thead > tr > th,\n  .table-bordered > thead > tr > td {\n    border-bottom-width: 2px; }\n\n.table-striped > tbody > tr:nth-of-type(odd) {\n  background-color: #f9f9f9; }\n\n.table-hover > tbody > tr:hover {\n  background-color: #f5f5f5; }\n\ntable col[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-column; }\n\ntable td[class*=\"col-\"],\ntable th[class*=\"col-\"] {\n  position: static;\n  float: none;\n  display: table-cell; }\n\n.table > thead > tr > td.active,\n.table > thead > tr > th.active,\n.table > thead > tr.active > td,\n.table > thead > tr.active > th,\n.table > tbody > tr > td.active,\n.table > tbody > tr > th.active,\n.table > tbody > tr.active > td,\n.table > tbody > tr.active > th,\n.table > tfoot > tr > td.active,\n.table > tfoot > tr > th.active,\n.table > tfoot > tr.active > td,\n.table > tfoot > tr.active > th {\n  background-color: #f5f5f5; }\n\n.table-hover > tbody > tr > td.active:hover,\n.table-hover > tbody > tr > th.active:hover,\n.table-hover > tbody > tr.active:hover > td,\n.table-hover > tbody > tr:hover > .active,\n.table-hover > tbody > tr.active:hover > th {\n  background-color: #e8e8e8; }\n\n.table > thead > tr > td.success,\n.table > thead > tr > th.success,\n.table > thead > tr.success > td,\n.table > thead > tr.success > th,\n.table > tbody > tr > td.success,\n.table > tbody > tr > th.success,\n.table > tbody > tr.success > td,\n.table > tbody > tr.success > th,\n.table > tfoot > tr > td.success,\n.table > tfoot > tr > th.success,\n.table > tfoot > tr.success > td,\n.table > tfoot > tr.success > th {\n  background-color: #dff0d8; }\n\n.table-hover > tbody > tr > td.success:hover,\n.table-hover > tbody > tr > th.success:hover,\n.table-hover > tbody > tr.success:hover > td,\n.table-hover > tbody > tr:hover > .success,\n.table-hover > tbody > tr.success:hover > th {\n  background-color: #d0e9c6; }\n\n.table > thead > tr > td.info,\n.table > thead > tr > th.info,\n.table > thead > tr.info > td,\n.table > thead > tr.info > th,\n.table > tbody > tr > td.info,\n.table > tbody > tr > th.info,\n.table > tbody > tr.info > td,\n.table > tbody > tr.info > th,\n.table > tfoot > tr > td.info,\n.table > tfoot > tr > th.info,\n.table > tfoot > tr.info > td,\n.table > tfoot > tr.info > th {\n  background-color: #d9edf7; }\n\n.table-hover > tbody > tr > td.info:hover,\n.table-hover > tbody > tr > th.info:hover,\n.table-hover > tbody > tr.info:hover > td,\n.table-hover > tbody > tr:hover > .info,\n.table-hover > tbody > tr.info:hover > th {\n  background-color: #c4e3f3; }\n\n.table > thead > tr > td.warning,\n.table > thead > tr > th.warning,\n.table > thead > tr.warning > td,\n.table > thead > tr.warning > th,\n.table > tbody > tr > td.warning,\n.table > tbody > tr > th.warning,\n.table > tbody > tr.warning > td,\n.table > tbody > tr.warning > th,\n.table > tfoot > tr > td.warning,\n.table > tfoot > tr > th.warning,\n.table > tfoot > tr.warning > td,\n.table > tfoot > tr.warning > th {\n  background-color: #fcf8e3; }\n\n.table-hover > tbody > tr > td.warning:hover,\n.table-hover > tbody > tr > th.warning:hover,\n.table-hover > tbody > tr.warning:hover > td,\n.table-hover > tbody > tr:hover > .warning,\n.table-hover > tbody > tr.warning:hover > th {\n  background-color: #faf2cc; }\n\n.table > thead > tr > td.danger,\n.table > thead > tr > th.danger,\n.table > thead > tr.danger > td,\n.table > thead > tr.danger > th,\n.table > tbody > tr > td.danger,\n.table > tbody > tr > th.danger,\n.table > tbody > tr.danger > td,\n.table > tbody > tr.danger > th,\n.table > tfoot > tr > td.danger,\n.table > tfoot > tr > th.danger,\n.table > tfoot > tr.danger > td,\n.table > tfoot > tr.danger > th {\n  background-color: #f2dede; }\n\n.table-hover > tbody > tr > td.danger:hover,\n.table-hover > tbody > tr > th.danger:hover,\n.table-hover > tbody > tr.danger:hover > td,\n.table-hover > tbody > tr:hover > .danger,\n.table-hover > tbody > tr.danger:hover > th {\n  background-color: #ebcccc; }\n\n.table-responsive {\n  overflow-x: auto;\n  min-height: 0.01%; }\n  @media screen and (max-width: 767px) {\n    .table-responsive {\n      width: 100%;\n      margin-bottom: 15px;\n      overflow-y: hidden;\n      -ms-overflow-style: -ms-autohiding-scrollbar;\n      border: 1px solid #ddd; }\n      .table-responsive > .table {\n        margin-bottom: 0; }\n        .table-responsive > .table > thead > tr > th,\n        .table-responsive > .table > thead > tr > td,\n        .table-responsive > .table > tbody > tr > th,\n        .table-responsive > .table > tbody > tr > td,\n        .table-responsive > .table > tfoot > tr > th,\n        .table-responsive > .table > tfoot > tr > td {\n          white-space: nowrap; }\n      .table-responsive > .table-bordered {\n        border: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:first-child,\n        .table-responsive > .table-bordered > thead > tr > td:first-child,\n        .table-responsive > .table-bordered > tbody > tr > th:first-child,\n        .table-responsive > .table-bordered > tbody > tr > td:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n          border-left: 0; }\n        .table-responsive > .table-bordered > thead > tr > th:last-child,\n        .table-responsive > .table-bordered > thead > tr > td:last-child,\n        .table-responsive > .table-bordered > tbody > tr > th:last-child,\n        .table-responsive > .table-bordered > tbody > tr > td:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n        .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n          border-right: 0; }\n        .table-responsive > .table-bordered > tbody > tr:last-child > th,\n        .table-responsive > .table-bordered > tbody > tr:last-child > td,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > th,\n        .table-responsive > .table-bordered > tfoot > tr:last-child > td {\n          border-bottom: 0; } }\n\nfieldset {\n  padding: 0;\n  margin: 0;\n  border: 0;\n  min-width: 0; }\n\nlegend {\n  display: block;\n  width: 100%;\n  padding: 0;\n  margin-bottom: 20px;\n  font-size: 21px;\n  line-height: inherit;\n  color: #333333;\n  border: 0;\n  border-bottom: 1px solid #e5e5e5; }\n\nlabel {\n  display: inline-block;\n  max-width: 100%;\n  margin-bottom: 5px;\n  font-weight: bold; }\n\ninput[type=\"search\"] {\n  -webkit-box-sizing: border-box;\n  -moz-box-sizing: border-box;\n  box-sizing: border-box; }\n\ninput[type=\"radio\"],\ninput[type=\"checkbox\"] {\n  margin: 4px 0 0;\n  margin-top: 1px \\9;\n  line-height: normal; }\n\ninput[type=\"file\"] {\n  display: block; }\n\ninput[type=\"range\"] {\n  display: block;\n  width: 100%; }\n\nselect[multiple],\nselect[size] {\n  height: auto; }\n\ninput[type=\"file\"]:focus,\ninput[type=\"radio\"]:focus,\ninput[type=\"checkbox\"]:focus {\n  outline: 5px auto -webkit-focus-ring-color;\n  outline-offset: -2px; }\n\noutput {\n  display: block;\n  padding-top: 7px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555555; }\n\n.form-control {\n  display: block;\n  width: 100%;\n  height: 34px;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  color: #555555;\n  background-color: #fff;\n  background-image: none;\n  border: 1px solid #ccc;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  -webkit-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  -o-transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s;\n  transition: border-color ease-in-out 0.15s, box-shadow ease-in-out 0.15s; }\n  .form-control:focus {\n    border-color: #66afe9;\n    outline: 0;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6);\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 8px rgba(102, 175, 233, 0.6); }\n  .form-control::-moz-placeholder {\n    color: #999;\n    opacity: 1; }\n  .form-control:-ms-input-placeholder {\n    color: #999; }\n  .form-control::-webkit-input-placeholder {\n    color: #999; }\n  .form-control::-ms-expand {\n    border: 0;\n    background-color: transparent; }\n  .form-control[disabled], .form-control[readonly],\n  fieldset[disabled] .form-control {\n    background-color: #eeeeee;\n    opacity: 1; }\n  .form-control[disabled],\n  fieldset[disabled] .form-control {\n    cursor: not-allowed; }\n\ntextarea.form-control {\n  height: auto; }\n\ninput[type=\"search\"] {\n  -webkit-appearance: none; }\n\n@media screen and (-webkit-min-device-pixel-ratio: 0) {\n  input[type=\"date\"].form-control,\n  input[type=\"time\"].form-control,\n  input[type=\"datetime-local\"].form-control,\n  input[type=\"month\"].form-control {\n    line-height: 34px; }\n  input[type=\"date\"].input-sm, .input-group-sm > input[type=\"date\"].form-control,\n  .input-group-sm > input[type=\"date\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-sm input[type=\"date\"],\n  input[type=\"time\"].input-sm,\n  .input-group-sm > input[type=\"time\"].form-control,\n  .input-group-sm > input[type=\"time\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-sm\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-sm,\n  .input-group-sm > input[type=\"datetime-local\"].form-control,\n  .input-group-sm > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-sm\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-sm,\n  .input-group-sm > input[type=\"month\"].form-control,\n  .input-group-sm > input[type=\"month\"].input-group-addon,\n  .input-group-sm > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-sm\n  input[type=\"month\"] {\n    line-height: 30px; }\n  input[type=\"date\"].input-lg, .input-group-lg > input[type=\"date\"].form-control,\n  .input-group-lg > input[type=\"date\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"date\"].btn,\n  .input-group-lg input[type=\"date\"],\n  input[type=\"time\"].input-lg,\n  .input-group-lg > input[type=\"time\"].form-control,\n  .input-group-lg > input[type=\"time\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"time\"].btn,\n  .input-group-lg\n  input[type=\"time\"],\n  input[type=\"datetime-local\"].input-lg,\n  .input-group-lg > input[type=\"datetime-local\"].form-control,\n  .input-group-lg > input[type=\"datetime-local\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"datetime-local\"].btn,\n  .input-group-lg\n  input[type=\"datetime-local\"],\n  input[type=\"month\"].input-lg,\n  .input-group-lg > input[type=\"month\"].form-control,\n  .input-group-lg > input[type=\"month\"].input-group-addon,\n  .input-group-lg > .input-group-btn > input[type=\"month\"].btn,\n  .input-group-lg\n  input[type=\"month\"] {\n    line-height: 46px; } }\n\n.form-group {\n  margin-bottom: 15px; }\n\n.radio,\n.checkbox {\n  position: relative;\n  display: block;\n  margin-top: 10px;\n  margin-bottom: 10px; }\n  .radio label,\n  .checkbox label {\n    min-height: 20px;\n    padding-left: 20px;\n    margin-bottom: 0;\n    font-weight: normal;\n    cursor: pointer; }\n\n.radio input[type=\"radio\"],\n.radio-inline input[type=\"radio\"],\n.checkbox input[type=\"checkbox\"],\n.checkbox-inline input[type=\"checkbox\"] {\n  position: absolute;\n  margin-left: -20px;\n  margin-top: 4px \\9; }\n\n.radio + .radio,\n.checkbox + .checkbox {\n  margin-top: -5px; }\n\n.radio-inline,\n.checkbox-inline {\n  position: relative;\n  display: inline-block;\n  padding-left: 20px;\n  margin-bottom: 0;\n  vertical-align: middle;\n  font-weight: normal;\n  cursor: pointer; }\n\n.radio-inline + .radio-inline,\n.checkbox-inline + .checkbox-inline {\n  margin-top: 0;\n  margin-left: 10px; }\n\ninput[type=\"radio\"][disabled], input[type=\"radio\"].disabled,\nfieldset[disabled] input[type=\"radio\"],\ninput[type=\"checkbox\"][disabled],\ninput[type=\"checkbox\"].disabled,\nfieldset[disabled]\ninput[type=\"checkbox\"] {\n  cursor: not-allowed; }\n\n.radio-inline.disabled,\nfieldset[disabled] .radio-inline,\n.checkbox-inline.disabled,\nfieldset[disabled]\n.checkbox-inline {\n  cursor: not-allowed; }\n\n.radio.disabled label,\nfieldset[disabled] .radio label,\n.checkbox.disabled label,\nfieldset[disabled]\n.checkbox label {\n  cursor: not-allowed; }\n\n.form-control-static {\n  padding-top: 7px;\n  padding-bottom: 7px;\n  margin-bottom: 0;\n  min-height: 34px; }\n  .form-control-static.input-lg, .input-group-lg > .form-control-static.form-control,\n  .input-group-lg > .form-control-static.input-group-addon,\n  .input-group-lg > .input-group-btn > .form-control-static.btn, .form-control-static.input-sm, .input-group-sm > .form-control-static.form-control,\n  .input-group-sm > .form-control-static.input-group-addon,\n  .input-group-sm > .input-group-btn > .form-control-static.btn {\n    padding-left: 0;\n    padding-right: 0; }\n\n.input-sm, .input-group-sm > .form-control,\n.input-group-sm > .input-group-addon,\n.input-group-sm > .input-group-btn > .btn {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\nselect.input-sm, .input-group-sm > select.form-control,\n.input-group-sm > select.input-group-addon,\n.input-group-sm > .input-group-btn > select.btn {\n  height: 30px;\n  line-height: 30px; }\n\ntextarea.input-sm, .input-group-sm > textarea.form-control,\n.input-group-sm > textarea.input-group-addon,\n.input-group-sm > .input-group-btn > textarea.btn,\nselect[multiple].input-sm,\n.input-group-sm > select[multiple].form-control,\n.input-group-sm > select[multiple].input-group-addon,\n.input-group-sm > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-sm .form-control {\n  height: 30px;\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.form-group-sm select.form-control {\n  height: 30px;\n  line-height: 30px; }\n\n.form-group-sm textarea.form-control,\n.form-group-sm select[multiple].form-control {\n  height: auto; }\n\n.form-group-sm .form-control-static {\n  height: 30px;\n  min-height: 32px;\n  padding: 6px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.input-lg, .input-group-lg > .form-control,\n.input-group-lg > .input-group-addon,\n.input-group-lg > .input-group-btn > .btn {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\nselect.input-lg, .input-group-lg > select.form-control,\n.input-group-lg > select.input-group-addon,\n.input-group-lg > .input-group-btn > select.btn {\n  height: 46px;\n  line-height: 46px; }\n\ntextarea.input-lg, .input-group-lg > textarea.form-control,\n.input-group-lg > textarea.input-group-addon,\n.input-group-lg > .input-group-btn > textarea.btn,\nselect[multiple].input-lg,\n.input-group-lg > select[multiple].form-control,\n.input-group-lg > select[multiple].input-group-addon,\n.input-group-lg > .input-group-btn > select[multiple].btn {\n  height: auto; }\n\n.form-group-lg .form-control {\n  height: 46px;\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.form-group-lg select.form-control {\n  height: 46px;\n  line-height: 46px; }\n\n.form-group-lg textarea.form-control,\n.form-group-lg select[multiple].form-control {\n  height: auto; }\n\n.form-group-lg .form-control-static {\n  height: 46px;\n  min-height: 38px;\n  padding: 11px 16px;\n  font-size: 18px;\n  line-height: 1.33333; }\n\n.has-feedback {\n  position: relative; }\n  .has-feedback .form-control {\n    padding-right: 42.5px; }\n\n.form-control-feedback {\n  position: absolute;\n  top: 0;\n  right: 0;\n  z-index: 2;\n  display: block;\n  width: 34px;\n  height: 34px;\n  line-height: 34px;\n  text-align: center;\n  pointer-events: none; }\n\n.input-lg + .form-control-feedback, .input-group-lg > .form-control + .form-control-feedback,\n.input-group-lg > .input-group-addon + .form-control-feedback,\n.input-group-lg > .input-group-btn > .btn + .form-control-feedback,\n.input-group-lg + .form-control-feedback,\n.form-group-lg .form-control + .form-control-feedback {\n  width: 46px;\n  height: 46px;\n  line-height: 46px; }\n\n.input-sm + .form-control-feedback, .input-group-sm > .form-control + .form-control-feedback,\n.input-group-sm > .input-group-addon + .form-control-feedback,\n.input-group-sm > .input-group-btn > .btn + .form-control-feedback,\n.input-group-sm + .form-control-feedback,\n.form-group-sm .form-control + .form-control-feedback {\n  width: 30px;\n  height: 30px;\n  line-height: 30px; }\n\n.has-success .help-block,\n.has-success .control-label,\n.has-success .radio,\n.has-success .checkbox,\n.has-success .radio-inline,\n.has-success .checkbox-inline,\n.has-success.radio label,\n.has-success.checkbox label,\n.has-success.radio-inline label,\n.has-success.checkbox-inline label {\n  color: #3c763d; }\n\n.has-success .form-control {\n  border-color: #3c763d;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-success .form-control:focus {\n    border-color: #2b542c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #67b168; }\n\n.has-success .input-group-addon {\n  color: #3c763d;\n  border-color: #3c763d;\n  background-color: #dff0d8; }\n\n.has-success .form-control-feedback {\n  color: #3c763d; }\n\n.has-warning .help-block,\n.has-warning .control-label,\n.has-warning .radio,\n.has-warning .checkbox,\n.has-warning .radio-inline,\n.has-warning .checkbox-inline,\n.has-warning.radio label,\n.has-warning.checkbox label,\n.has-warning.radio-inline label,\n.has-warning.checkbox-inline label {\n  color: #8a6d3b; }\n\n.has-warning .form-control {\n  border-color: #8a6d3b;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-warning .form-control:focus {\n    border-color: #66512c;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #c0a16b; }\n\n.has-warning .input-group-addon {\n  color: #8a6d3b;\n  border-color: #8a6d3b;\n  background-color: #fcf8e3; }\n\n.has-warning .form-control-feedback {\n  color: #8a6d3b; }\n\n.has-error .help-block,\n.has-error .control-label,\n.has-error .radio,\n.has-error .checkbox,\n.has-error .radio-inline,\n.has-error .checkbox-inline,\n.has-error.radio label,\n.has-error.checkbox label,\n.has-error.radio-inline label,\n.has-error.checkbox-inline label {\n  color: #a94442; }\n\n.has-error .form-control {\n  border-color: #a94442;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075); }\n  .has-error .form-control:focus {\n    border-color: #843534;\n    -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483;\n    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075), 0 0 6px #ce8483; }\n\n.has-error .input-group-addon {\n  color: #a94442;\n  border-color: #a94442;\n  background-color: #f2dede; }\n\n.has-error .form-control-feedback {\n  color: #a94442; }\n\n.has-feedback label ~ .form-control-feedback {\n  top: 25px; }\n\n.has-feedback label.sr-only ~ .form-control-feedback {\n  top: 0; }\n\n.help-block {\n  display: block;\n  margin-top: 5px;\n  margin-bottom: 10px;\n  color: #737373; }\n\n@media (min-width: 768px) {\n  .form-inline .form-group {\n    display: inline-block;\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .form-control {\n    display: inline-block;\n    width: auto;\n    vertical-align: middle; }\n  .form-inline .form-control-static {\n    display: inline-block; }\n  .form-inline .input-group {\n    display: inline-table;\n    vertical-align: middle; }\n    .form-inline .input-group .input-group-addon,\n    .form-inline .input-group .input-group-btn,\n    .form-inline .input-group .form-control {\n      width: auto; }\n  .form-inline .input-group > .form-control {\n    width: 100%; }\n  .form-inline .control-label {\n    margin-bottom: 0;\n    vertical-align: middle; }\n  .form-inline .radio,\n  .form-inline .checkbox {\n    display: inline-block;\n    margin-top: 0;\n    margin-bottom: 0;\n    vertical-align: middle; }\n    .form-inline .radio label,\n    .form-inline .checkbox label {\n      padding-left: 0; }\n  .form-inline .radio input[type=\"radio\"],\n  .form-inline .checkbox input[type=\"checkbox\"] {\n    position: relative;\n    margin-left: 0; }\n  .form-inline .has-feedback .form-control-feedback {\n    top: 0; } }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox,\n.form-horizontal .radio-inline,\n.form-horizontal .checkbox-inline {\n  margin-top: 0;\n  margin-bottom: 0;\n  padding-top: 7px; }\n\n.form-horizontal .radio,\n.form-horizontal .checkbox {\n  min-height: 27px; }\n\n.form-horizontal .form-group {\n  margin-left: -15px;\n  margin-right: -15px; }\n  .form-horizontal .form-group:before, .form-horizontal .form-group:after {\n    content: \" \";\n    display: table; }\n  .form-horizontal .form-group:after {\n    clear: both; }\n\n@media (min-width: 768px) {\n  .form-horizontal .control-label {\n    text-align: right;\n    margin-bottom: 0;\n    padding-top: 7px; } }\n\n.form-horizontal .has-feedback .form-control-feedback {\n  right: 15px; }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-lg .control-label {\n    padding-top: 11px;\n    font-size: 18px; } }\n\n@media (min-width: 768px) {\n  .form-horizontal .form-group-sm .control-label {\n    padding-top: 6px;\n    font-size: 12px; } }\n\n.btn {\n  display: inline-block;\n  margin-bottom: 0;\n  font-weight: normal;\n  text-align: center;\n  vertical-align: middle;\n  touch-action: manipulation;\n  cursor: pointer;\n  background-image: none;\n  border: 1px solid transparent;\n  white-space: nowrap;\n  padding: 6px 12px;\n  font-size: 14px;\n  line-height: 1.42857;\n  border-radius: 4px;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n  .btn:focus, .btn.focus, .btn:active:focus, .btn:active.focus, .btn.active:focus, .btn.active.focus {\n    outline: 5px auto -webkit-focus-ring-color;\n    outline-offset: -2px; }\n  .btn:hover, .btn:focus, .btn.focus {\n    color: #333;\n    text-decoration: none; }\n  .btn:active, .btn.active {\n    outline: 0;\n    background-image: none;\n    -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n    box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn.disabled, .btn[disabled],\n  fieldset[disabled] .btn {\n    cursor: not-allowed;\n    opacity: 0.65;\n    filter: alpha(opacity=65);\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\na.btn.disabled,\nfieldset[disabled] a.btn {\n  pointer-events: none; }\n\n.btn-default {\n  color: #333;\n  background-color: #fff;\n  border-color: #ccc; }\n  .btn-default:focus, .btn-default.focus {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #8c8c8c; }\n  .btn-default:hover {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    color: #333;\n    background-color: #e6e6e6;\n    border-color: #adadad; }\n    .btn-default:active:hover, .btn-default:active:focus, .btn-default:active.focus, .btn-default.active:hover, .btn-default.active:focus, .btn-default.active.focus,\n    .open > .btn-default.dropdown-toggle:hover,\n    .open > .btn-default.dropdown-toggle:focus,\n    .open > .btn-default.dropdown-toggle.focus {\n      color: #333;\n      background-color: #d4d4d4;\n      border-color: #8c8c8c; }\n  .btn-default:active, .btn-default.active,\n  .open > .btn-default.dropdown-toggle {\n    background-image: none; }\n  .btn-default.disabled:hover, .btn-default.disabled:focus, .btn-default.disabled.focus, .btn-default[disabled]:hover, .btn-default[disabled]:focus, .btn-default[disabled].focus,\n  fieldset[disabled] .btn-default:hover,\n  fieldset[disabled] .btn-default:focus,\n  fieldset[disabled] .btn-default.focus {\n    background-color: #fff;\n    border-color: #ccc; }\n  .btn-default .badge {\n    color: #fff;\n    background-color: #333; }\n\n.btn-primary {\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #2e6da4; }\n  .btn-primary:focus, .btn-primary.focus {\n    color: #fff;\n    background-color: #286090;\n    border-color: #122b40; }\n  .btn-primary:hover {\n    color: #fff;\n    background-color: #286090;\n    border-color: #204d74; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    color: #fff;\n    background-color: #286090;\n    border-color: #204d74; }\n    .btn-primary:active:hover, .btn-primary:active:focus, .btn-primary:active.focus, .btn-primary.active:hover, .btn-primary.active:focus, .btn-primary.active.focus,\n    .open > .btn-primary.dropdown-toggle:hover,\n    .open > .btn-primary.dropdown-toggle:focus,\n    .open > .btn-primary.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #204d74;\n      border-color: #122b40; }\n  .btn-primary:active, .btn-primary.active,\n  .open > .btn-primary.dropdown-toggle {\n    background-image: none; }\n  .btn-primary.disabled:hover, .btn-primary.disabled:focus, .btn-primary.disabled.focus, .btn-primary[disabled]:hover, .btn-primary[disabled]:focus, .btn-primary[disabled].focus,\n  fieldset[disabled] .btn-primary:hover,\n  fieldset[disabled] .btn-primary:focus,\n  fieldset[disabled] .btn-primary.focus {\n    background-color: #337ab7;\n    border-color: #2e6da4; }\n  .btn-primary .badge {\n    color: #337ab7;\n    background-color: #fff; }\n\n.btn-success {\n  color: #fff;\n  background-color: #5cb85c;\n  border-color: #4cae4c; }\n  .btn-success:focus, .btn-success.focus {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #255625; }\n  .btn-success:hover {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #398439; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    color: #fff;\n    background-color: #449d44;\n    border-color: #398439; }\n    .btn-success:active:hover, .btn-success:active:focus, .btn-success:active.focus, .btn-success.active:hover, .btn-success.active:focus, .btn-success.active.focus,\n    .open > .btn-success.dropdown-toggle:hover,\n    .open > .btn-success.dropdown-toggle:focus,\n    .open > .btn-success.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #398439;\n      border-color: #255625; }\n  .btn-success:active, .btn-success.active,\n  .open > .btn-success.dropdown-toggle {\n    background-image: none; }\n  .btn-success.disabled:hover, .btn-success.disabled:focus, .btn-success.disabled.focus, .btn-success[disabled]:hover, .btn-success[disabled]:focus, .btn-success[disabled].focus,\n  fieldset[disabled] .btn-success:hover,\n  fieldset[disabled] .btn-success:focus,\n  fieldset[disabled] .btn-success.focus {\n    background-color: #5cb85c;\n    border-color: #4cae4c; }\n  .btn-success .badge {\n    color: #5cb85c;\n    background-color: #fff; }\n\n.btn-info {\n  color: #fff;\n  background-color: #5bc0de;\n  border-color: #46b8da; }\n  .btn-info:focus, .btn-info.focus {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #1b6d85; }\n  .btn-info:hover {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #269abc; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    color: #fff;\n    background-color: #31b0d5;\n    border-color: #269abc; }\n    .btn-info:active:hover, .btn-info:active:focus, .btn-info:active.focus, .btn-info.active:hover, .btn-info.active:focus, .btn-info.active.focus,\n    .open > .btn-info.dropdown-toggle:hover,\n    .open > .btn-info.dropdown-toggle:focus,\n    .open > .btn-info.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #269abc;\n      border-color: #1b6d85; }\n  .btn-info:active, .btn-info.active,\n  .open > .btn-info.dropdown-toggle {\n    background-image: none; }\n  .btn-info.disabled:hover, .btn-info.disabled:focus, .btn-info.disabled.focus, .btn-info[disabled]:hover, .btn-info[disabled]:focus, .btn-info[disabled].focus,\n  fieldset[disabled] .btn-info:hover,\n  fieldset[disabled] .btn-info:focus,\n  fieldset[disabled] .btn-info.focus {\n    background-color: #5bc0de;\n    border-color: #46b8da; }\n  .btn-info .badge {\n    color: #5bc0de;\n    background-color: #fff; }\n\n.btn-warning {\n  color: #fff;\n  background-color: #f0ad4e;\n  border-color: #eea236; }\n  .btn-warning:focus, .btn-warning.focus {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #985f0d; }\n  .btn-warning:hover {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #d58512; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    color: #fff;\n    background-color: #ec971f;\n    border-color: #d58512; }\n    .btn-warning:active:hover, .btn-warning:active:focus, .btn-warning:active.focus, .btn-warning.active:hover, .btn-warning.active:focus, .btn-warning.active.focus,\n    .open > .btn-warning.dropdown-toggle:hover,\n    .open > .btn-warning.dropdown-toggle:focus,\n    .open > .btn-warning.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #d58512;\n      border-color: #985f0d; }\n  .btn-warning:active, .btn-warning.active,\n  .open > .btn-warning.dropdown-toggle {\n    background-image: none; }\n  .btn-warning.disabled:hover, .btn-warning.disabled:focus, .btn-warning.disabled.focus, .btn-warning[disabled]:hover, .btn-warning[disabled]:focus, .btn-warning[disabled].focus,\n  fieldset[disabled] .btn-warning:hover,\n  fieldset[disabled] .btn-warning:focus,\n  fieldset[disabled] .btn-warning.focus {\n    background-color: #f0ad4e;\n    border-color: #eea236; }\n  .btn-warning .badge {\n    color: #f0ad4e;\n    background-color: #fff; }\n\n.btn-danger {\n  color: #fff;\n  background-color: #d9534f;\n  border-color: #d43f3a; }\n  .btn-danger:focus, .btn-danger.focus {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #761c19; }\n  .btn-danger:hover {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #ac2925; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    color: #fff;\n    background-color: #c9302c;\n    border-color: #ac2925; }\n    .btn-danger:active:hover, .btn-danger:active:focus, .btn-danger:active.focus, .btn-danger.active:hover, .btn-danger.active:focus, .btn-danger.active.focus,\n    .open > .btn-danger.dropdown-toggle:hover,\n    .open > .btn-danger.dropdown-toggle:focus,\n    .open > .btn-danger.dropdown-toggle.focus {\n      color: #fff;\n      background-color: #ac2925;\n      border-color: #761c19; }\n  .btn-danger:active, .btn-danger.active,\n  .open > .btn-danger.dropdown-toggle {\n    background-image: none; }\n  .btn-danger.disabled:hover, .btn-danger.disabled:focus, .btn-danger.disabled.focus, .btn-danger[disabled]:hover, .btn-danger[disabled]:focus, .btn-danger[disabled].focus,\n  fieldset[disabled] .btn-danger:hover,\n  fieldset[disabled] .btn-danger:focus,\n  fieldset[disabled] .btn-danger.focus {\n    background-color: #d9534f;\n    border-color: #d43f3a; }\n  .btn-danger .badge {\n    color: #d9534f;\n    background-color: #fff; }\n\n.btn-link {\n  color: #337ab7;\n  font-weight: normal;\n  border-radius: 0; }\n  .btn-link, .btn-link:active, .btn-link.active, .btn-link[disabled],\n  fieldset[disabled] .btn-link {\n    background-color: transparent;\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n  .btn-link, .btn-link:hover, .btn-link:focus, .btn-link:active {\n    border-color: transparent; }\n  .btn-link:hover, .btn-link:focus {\n    color: #23527c;\n    text-decoration: underline;\n    background-color: transparent; }\n  .btn-link[disabled]:hover, .btn-link[disabled]:focus,\n  fieldset[disabled] .btn-link:hover,\n  fieldset[disabled] .btn-link:focus {\n    color: #777777;\n    text-decoration: none; }\n\n.btn-lg, .btn-group-lg > .btn {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333;\n  border-radius: 6px; }\n\n.btn-sm, .btn-group-sm > .btn {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-xs, .btn-group-xs > .btn {\n  padding: 1px 5px;\n  font-size: 12px;\n  line-height: 1.5;\n  border-radius: 3px; }\n\n.btn-block {\n  display: block;\n  width: 100%; }\n\n.btn-block + .btn-block {\n  margin-top: 5px; }\n\ninput[type=\"submit\"].btn-block,\ninput[type=\"reset\"].btn-block,\ninput[type=\"button\"].btn-block {\n  width: 100%; }\n\n.fade {\n  opacity: 0;\n  -webkit-transition: opacity 0.15s linear;\n  -o-transition: opacity 0.15s linear;\n  transition: opacity 0.15s linear; }\n  .fade.in {\n    opacity: 1; }\n\n.collapse {\n  display: none; }\n  .collapse.in {\n    display: block; }\n\ntr.collapse.in {\n  display: table-row; }\n\ntbody.collapse.in {\n  display: table-row-group; }\n\n.collapsing {\n  position: relative;\n  height: 0;\n  overflow: hidden;\n  -webkit-transition-property: height, visibility;\n  transition-property: height, visibility;\n  -webkit-transition-duration: 0.35s;\n  transition-duration: 0.35s;\n  -webkit-transition-timing-function: ease;\n  transition-timing-function: ease; }\n\n.caret {\n  display: inline-block;\n  width: 0;\n  height: 0;\n  margin-left: 2px;\n  vertical-align: middle;\n  border-top: 4px dashed;\n  border-top: 4px solid \\9;\n  border-right: 4px solid transparent;\n  border-left: 4px solid transparent; }\n\n.dropup,\n.dropdown {\n  position: relative; }\n\n.dropdown-toggle:focus {\n  outline: 0; }\n\n.dropdown-menu {\n  position: absolute;\n  top: 100%;\n  left: 0;\n  z-index: 1000;\n  display: none;\n  float: left;\n  min-width: 160px;\n  padding: 5px 0;\n  margin: 2px 0 0;\n  list-style: none;\n  font-size: 14px;\n  text-align: left;\n  background-color: #fff;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  -webkit-box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);\n  background-clip: padding-box; }\n  .dropdown-menu.pull-right {\n    right: 0;\n    left: auto; }\n  .dropdown-menu .divider {\n    height: 1px;\n    margin: 9px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .dropdown-menu > li > a {\n    display: block;\n    padding: 3px 20px;\n    clear: both;\n    font-weight: normal;\n    line-height: 1.42857;\n    color: #333333;\n    white-space: nowrap; }\n\n.dropdown-menu > li > a:hover, .dropdown-menu > li > a:focus {\n  text-decoration: none;\n  color: #262626;\n  background-color: #f5f5f5; }\n\n.dropdown-menu > .active > a, .dropdown-menu > .active > a:hover, .dropdown-menu > .active > a:focus {\n  color: #fff;\n  text-decoration: none;\n  outline: 0;\n  background-color: #337ab7; }\n\n.dropdown-menu > .disabled > a, .dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  color: #777777; }\n\n.dropdown-menu > .disabled > a:hover, .dropdown-menu > .disabled > a:focus {\n  text-decoration: none;\n  background-color: transparent;\n  background-image: none;\n  filter: progid:DXImageTransform.Microsoft.gradient(enabled = false);\n  cursor: not-allowed; }\n\n.open > .dropdown-menu {\n  display: block; }\n\n.open > a {\n  outline: 0; }\n\n.dropdown-menu-right {\n  left: auto;\n  right: 0; }\n\n.dropdown-menu-left {\n  left: 0;\n  right: auto; }\n\n.dropdown-header {\n  display: block;\n  padding: 3px 20px;\n  font-size: 12px;\n  line-height: 1.42857;\n  color: #777777;\n  white-space: nowrap; }\n\n.dropdown-backdrop {\n  position: fixed;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  top: 0;\n  z-index: 990; }\n\n.pull-right > .dropdown-menu {\n  right: 0;\n  left: auto; }\n\n.dropup .caret,\n.navbar-fixed-bottom .dropdown .caret {\n  border-top: 0;\n  border-bottom: 4px dashed;\n  border-bottom: 4px solid \\9;\n  content: \"\"; }\n\n.dropup .dropdown-menu,\n.navbar-fixed-bottom .dropdown .dropdown-menu {\n  top: auto;\n  bottom: 100%;\n  margin-bottom: 2px; }\n\n@media (min-width: 768px) {\n  .navbar-right .dropdown-menu {\n    right: 0;\n    left: auto; }\n  .navbar-right .dropdown-menu-left {\n    left: 0;\n    right: auto; } }\n\n.btn-group,\n.btn-group-vertical {\n  position: relative;\n  display: inline-block;\n  vertical-align: middle; }\n  .btn-group > .btn,\n  .btn-group-vertical > .btn {\n    position: relative;\n    float: left; }\n    .btn-group > .btn:hover, .btn-group > .btn:focus, .btn-group > .btn:active, .btn-group > .btn.active,\n    .btn-group-vertical > .btn:hover,\n    .btn-group-vertical > .btn:focus,\n    .btn-group-vertical > .btn:active,\n    .btn-group-vertical > .btn.active {\n      z-index: 2; }\n\n.btn-group .btn + .btn,\n.btn-group .btn + .btn-group,\n.btn-group .btn-group + .btn,\n.btn-group .btn-group + .btn-group {\n  margin-left: -1px; }\n\n.btn-toolbar {\n  margin-left: -5px; }\n  .btn-toolbar:before, .btn-toolbar:after {\n    content: \" \";\n    display: table; }\n  .btn-toolbar:after {\n    clear: both; }\n  .btn-toolbar .btn,\n  .btn-toolbar .btn-group,\n  .btn-toolbar .input-group {\n    float: left; }\n  .btn-toolbar > .btn,\n  .btn-toolbar > .btn-group,\n  .btn-toolbar > .input-group {\n    margin-left: 5px; }\n\n.btn-group > .btn:not(:first-child):not(:last-child):not(.dropdown-toggle) {\n  border-radius: 0; }\n\n.btn-group > .btn:first-child {\n  margin-left: 0; }\n  .btn-group > .btn:first-child:not(:last-child):not(.dropdown-toggle) {\n    border-bottom-right-radius: 0;\n    border-top-right-radius: 0; }\n\n.btn-group > .btn:last-child:not(:first-child),\n.btn-group > .dropdown-toggle:not(:first-child) {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group > .btn-group {\n  float: left; }\n\n.btn-group > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.btn-group > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group .dropdown-toggle:active,\n.btn-group.open .dropdown-toggle {\n  outline: 0; }\n\n.btn-group > .btn + .dropdown-toggle {\n  padding-left: 8px;\n  padding-right: 8px; }\n\n.btn-group > .btn-lg + .dropdown-toggle, .btn-group-lg.btn-group > .btn + .dropdown-toggle {\n  padding-left: 12px;\n  padding-right: 12px; }\n\n.btn-group.open .dropdown-toggle {\n  -webkit-box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);\n  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125); }\n  .btn-group.open .dropdown-toggle.btn-link {\n    -webkit-box-shadow: none;\n    box-shadow: none; }\n\n.btn .caret {\n  margin-left: 0; }\n\n.btn-lg .caret, .btn-group-lg > .btn .caret {\n  border-width: 5px 5px 0;\n  border-bottom-width: 0; }\n\n.dropup .btn-lg .caret, .dropup .btn-group-lg > .btn .caret {\n  border-width: 0 5px 5px; }\n\n.btn-group-vertical > .btn,\n.btn-group-vertical > .btn-group,\n.btn-group-vertical > .btn-group > .btn {\n  display: block;\n  float: none;\n  width: 100%;\n  max-width: 100%; }\n\n.btn-group-vertical > .btn-group:before, .btn-group-vertical > .btn-group:after {\n  content: \" \";\n  display: table; }\n\n.btn-group-vertical > .btn-group:after {\n  clear: both; }\n\n.btn-group-vertical > .btn-group > .btn {\n  float: none; }\n\n.btn-group-vertical > .btn + .btn,\n.btn-group-vertical > .btn + .btn-group,\n.btn-group-vertical > .btn-group + .btn,\n.btn-group-vertical > .btn-group + .btn-group {\n  margin-top: -1px;\n  margin-left: 0; }\n\n.btn-group-vertical > .btn:not(:first-child):not(:last-child) {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn:first-child:not(:last-child) {\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn:last-child:not(:first-child) {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0;\n  border-bottom-right-radius: 4px;\n  border-bottom-left-radius: 4px; }\n\n.btn-group-vertical > .btn-group:not(:first-child):not(:last-child) > .btn {\n  border-radius: 0; }\n\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .btn:last-child,\n.btn-group-vertical > .btn-group:first-child:not(:last-child) > .dropdown-toggle {\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.btn-group-vertical > .btn-group:last-child:not(:first-child) > .btn:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.btn-group-justified {\n  display: table;\n  width: 100%;\n  table-layout: fixed;\n  border-collapse: separate; }\n  .btn-group-justified > .btn,\n  .btn-group-justified > .btn-group {\n    float: none;\n    display: table-cell;\n    width: 1%; }\n  .btn-group-justified > .btn-group .btn {\n    width: 100%; }\n  .btn-group-justified > .btn-group .dropdown-menu {\n    left: auto; }\n\n[data-toggle=\"buttons\"] > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn input[type=\"checkbox\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"radio\"],\n[data-toggle=\"buttons\"] > .btn-group > .btn input[type=\"checkbox\"] {\n  position: absolute;\n  clip: rect(0, 0, 0, 0);\n  pointer-events: none; }\n\n.input-group {\n  position: relative;\n  display: table;\n  border-collapse: separate; }\n  .input-group[class*=\"col-\"] {\n    float: none;\n    padding-left: 0;\n    padding-right: 0; }\n  .input-group .form-control {\n    position: relative;\n    z-index: 2;\n    float: left;\n    width: 100%;\n    margin-bottom: 0; }\n    .input-group .form-control:focus {\n      z-index: 3; }\n\n.input-group-addon,\n.input-group-btn,\n.input-group .form-control {\n  display: table-cell; }\n  .input-group-addon:not(:first-child):not(:last-child),\n  .input-group-btn:not(:first-child):not(:last-child),\n  .input-group .form-control:not(:first-child):not(:last-child) {\n    border-radius: 0; }\n\n.input-group-addon,\n.input-group-btn {\n  width: 1%;\n  white-space: nowrap;\n  vertical-align: middle; }\n\n.input-group-addon {\n  padding: 6px 12px;\n  font-size: 14px;\n  font-weight: normal;\n  line-height: 1;\n  color: #555555;\n  text-align: center;\n  background-color: #eeeeee;\n  border: 1px solid #ccc;\n  border-radius: 4px; }\n  .input-group-addon.input-sm,\n  .input-group-sm > .input-group-addon,\n  .input-group-sm > .input-group-btn > .input-group-addon.btn {\n    padding: 5px 10px;\n    font-size: 12px;\n    border-radius: 3px; }\n  .input-group-addon.input-lg,\n  .input-group-lg > .input-group-addon,\n  .input-group-lg > .input-group-btn > .input-group-addon.btn {\n    padding: 10px 16px;\n    font-size: 18px;\n    border-radius: 6px; }\n  .input-group-addon input[type=\"radio\"],\n  .input-group-addon input[type=\"checkbox\"] {\n    margin-top: 0; }\n\n.input-group .form-control:first-child,\n.input-group-addon:first-child,\n.input-group-btn:first-child > .btn,\n.input-group-btn:first-child > .btn-group > .btn,\n.input-group-btn:first-child > .dropdown-toggle,\n.input-group-btn:last-child > .btn:not(:last-child):not(.dropdown-toggle),\n.input-group-btn:last-child > .btn-group:not(:last-child) > .btn {\n  border-bottom-right-radius: 0;\n  border-top-right-radius: 0; }\n\n.input-group-addon:first-child {\n  border-right: 0; }\n\n.input-group .form-control:last-child,\n.input-group-addon:last-child,\n.input-group-btn:last-child > .btn,\n.input-group-btn:last-child > .btn-group > .btn,\n.input-group-btn:last-child > .dropdown-toggle,\n.input-group-btn:first-child > .btn:not(:first-child),\n.input-group-btn:first-child > .btn-group:not(:first-child) > .btn {\n  border-bottom-left-radius: 0;\n  border-top-left-radius: 0; }\n\n.input-group-addon:last-child {\n  border-left: 0; }\n\n.input-group-btn {\n  position: relative;\n  font-size: 0;\n  white-space: nowrap; }\n  .input-group-btn > .btn {\n    position: relative; }\n    .input-group-btn > .btn + .btn {\n      margin-left: -1px; }\n    .input-group-btn > .btn:hover, .input-group-btn > .btn:focus, .input-group-btn > .btn:active {\n      z-index: 2; }\n  .input-group-btn:first-child > .btn,\n  .input-group-btn:first-child > .btn-group {\n    margin-right: -1px; }\n  .input-group-btn:last-child > .btn,\n  .input-group-btn:last-child > .btn-group {\n    z-index: 2;\n    margin-left: -1px; }\n\n.nav {\n  margin-bottom: 0;\n  padding-left: 0;\n  list-style: none; }\n  .nav:before, .nav:after {\n    content: \" \";\n    display: table; }\n  .nav:after {\n    clear: both; }\n  .nav > li {\n    position: relative;\n    display: block; }\n    .nav > li > a {\n      position: relative;\n      display: block;\n      padding: 10px 15px; }\n      .nav > li > a:hover, .nav > li > a:focus {\n        text-decoration: none;\n        background-color: #eeeeee; }\n    .nav > li.disabled > a {\n      color: #777777; }\n      .nav > li.disabled > a:hover, .nav > li.disabled > a:focus {\n        color: #777777;\n        text-decoration: none;\n        background-color: transparent;\n        cursor: not-allowed; }\n  .nav .open > a, .nav .open > a:hover, .nav .open > a:focus {\n    background-color: #eeeeee;\n    border-color: #337ab7; }\n  .nav .nav-divider {\n    height: 1px;\n    margin: 9px 0;\n    overflow: hidden;\n    background-color: #e5e5e5; }\n  .nav > li > a > img {\n    max-width: none; }\n\n.nav-tabs {\n  border-bottom: 1px solid #ddd; }\n  .nav-tabs > li {\n    float: left;\n    margin-bottom: -1px; }\n    .nav-tabs > li > a {\n      margin-right: 2px;\n      line-height: 1.42857;\n      border: 1px solid transparent;\n      border-radius: 4px 4px 0 0; }\n      .nav-tabs > li > a:hover {\n        border-color: #eeeeee #eeeeee #ddd; }\n    .nav-tabs > li.active > a, .nav-tabs > li.active > a:hover, .nav-tabs > li.active > a:focus {\n      color: #555555;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-bottom-color: transparent;\n      cursor: default; }\n\n.nav-pills > li {\n  float: left; }\n  .nav-pills > li > a {\n    border-radius: 4px; }\n  .nav-pills > li + li {\n    margin-left: 2px; }\n  .nav-pills > li.active > a, .nav-pills > li.active > a:hover, .nav-pills > li.active > a:focus {\n    color: #fff;\n    background-color: #337ab7; }\n\n.nav-stacked > li {\n  float: none; }\n  .nav-stacked > li + li {\n    margin-top: 2px;\n    margin-left: 0; }\n\n.nav-justified, .nav-tabs.nav-justified {\n  width: 100%; }\n  .nav-justified > li, .nav-tabs.nav-justified > li {\n    float: none; }\n    .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n      text-align: center;\n      margin-bottom: 5px; }\n  .nav-justified > .dropdown .dropdown-menu {\n    top: auto;\n    left: auto; }\n  @media (min-width: 768px) {\n    .nav-justified > li, .nav-tabs.nav-justified > li {\n      display: table-cell;\n      width: 1%; }\n      .nav-justified > li > a, .nav-tabs.nav-justified > li > a {\n        margin-bottom: 0; } }\n\n.nav-tabs-justified, .nav-tabs.nav-justified {\n  border-bottom: 0; }\n  .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n    margin-right: 0;\n    border-radius: 4px; }\n  .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n  .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n  .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n    border: 1px solid #ddd; }\n  @media (min-width: 768px) {\n    .nav-tabs-justified > li > a, .nav-tabs.nav-justified > li > a {\n      border-bottom: 1px solid #ddd;\n      border-radius: 4px 4px 0 0; }\n    .nav-tabs-justified > .active > a, .nav-tabs.nav-justified > .active > a,\n    .nav-tabs-justified > .active > a:hover, .nav-tabs.nav-justified > .active > a:hover,\n    .nav-tabs-justified > .active > a:focus, .nav-tabs.nav-justified > .active > a:focus {\n      border-bottom-color: #fff; } }\n\n.tab-content > .tab-pane {\n  display: none; }\n\n.tab-content > .active {\n  display: block; }\n\n.nav-tabs .dropdown-menu {\n  margin-top: -1px;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar {\n  position: relative;\n  min-height: 50px;\n  margin-bottom: 20px;\n  border: 1px solid transparent; }\n  .navbar:before, .navbar:after {\n    content: \" \";\n    display: table; }\n  .navbar:after {\n    clear: both; }\n  @media (min-width: 768px) {\n    .navbar {\n      border-radius: 4px; } }\n\n.navbar-header:before, .navbar-header:after {\n  content: \" \";\n  display: table; }\n\n.navbar-header:after {\n  clear: both; }\n\n@media (min-width: 768px) {\n  .navbar-header {\n    float: left; } }\n\n.navbar-collapse {\n  overflow-x: visible;\n  padding-right: 15px;\n  padding-left: 15px;\n  border-top: 1px solid transparent;\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  -webkit-overflow-scrolling: touch; }\n  .navbar-collapse:before, .navbar-collapse:after {\n    content: \" \";\n    display: table; }\n  .navbar-collapse:after {\n    clear: both; }\n  .navbar-collapse.in {\n    overflow-y: auto; }\n  @media (min-width: 768px) {\n    .navbar-collapse {\n      width: auto;\n      border-top: 0;\n      box-shadow: none; }\n      .navbar-collapse.collapse {\n        display: block !important;\n        height: auto !important;\n        padding-bottom: 0;\n        overflow: visible !important; }\n      .navbar-collapse.in {\n        overflow-y: visible; }\n      .navbar-fixed-top .navbar-collapse,\n      .navbar-static-top .navbar-collapse,\n      .navbar-fixed-bottom .navbar-collapse {\n        padding-left: 0;\n        padding-right: 0; } }\n\n.navbar-fixed-top .navbar-collapse,\n.navbar-fixed-bottom .navbar-collapse {\n  max-height: 340px; }\n  @media (max-device-width: 480px) and (orientation: landscape) {\n    .navbar-fixed-top .navbar-collapse,\n    .navbar-fixed-bottom .navbar-collapse {\n      max-height: 200px; } }\n\n.container > .navbar-header,\n.container > .navbar-collapse,\n.container-fluid > .navbar-header,\n.container-fluid > .navbar-collapse {\n  margin-right: -15px;\n  margin-left: -15px; }\n  @media (min-width: 768px) {\n    .container > .navbar-header,\n    .container > .navbar-collapse,\n    .container-fluid > .navbar-header,\n    .container-fluid > .navbar-collapse {\n      margin-right: 0;\n      margin-left: 0; } }\n\n.navbar-static-top {\n  z-index: 1000;\n  border-width: 0 0 1px; }\n  @media (min-width: 768px) {\n    .navbar-static-top {\n      border-radius: 0; } }\n\n.navbar-fixed-top,\n.navbar-fixed-bottom {\n  position: fixed;\n  right: 0;\n  left: 0;\n  z-index: 1030; }\n  @media (min-width: 768px) {\n    .navbar-fixed-top,\n    .navbar-fixed-bottom {\n      border-radius: 0; } }\n\n.navbar-fixed-top {\n  top: 0;\n  border-width: 0 0 1px; }\n\n.navbar-fixed-bottom {\n  bottom: 0;\n  margin-bottom: 0;\n  border-width: 1px 0 0; }\n\n.navbar-brand {\n  float: left;\n  padding: 15px 15px;\n  font-size: 18px;\n  line-height: 20px;\n  height: 50px; }\n  .navbar-brand:hover, .navbar-brand:focus {\n    text-decoration: none; }\n  .navbar-brand > img {\n    display: block; }\n  @media (min-width: 768px) {\n    .navbar > .container .navbar-brand,\n    .navbar > .container-fluid .navbar-brand {\n      margin-left: -15px; } }\n\n.navbar-toggle {\n  position: relative;\n  float: right;\n  margin-right: 15px;\n  padding: 9px 10px;\n  margin-top: 8px;\n  margin-bottom: 8px;\n  background-color: transparent;\n  background-image: none;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .navbar-toggle:focus {\n    outline: 0; }\n  .navbar-toggle .icon-bar {\n    display: block;\n    width: 22px;\n    height: 2px;\n    border-radius: 1px; }\n  .navbar-toggle .icon-bar + .icon-bar {\n    margin-top: 4px; }\n  @media (min-width: 768px) {\n    .navbar-toggle {\n      display: none; } }\n\n.navbar-nav {\n  margin: 7.5px -15px; }\n  .navbar-nav > li > a {\n    padding-top: 10px;\n    padding-bottom: 10px;\n    line-height: 20px; }\n  @media (max-width: 767px) {\n    .navbar-nav .open .dropdown-menu {\n      position: static;\n      float: none;\n      width: auto;\n      margin-top: 0;\n      background-color: transparent;\n      border: 0;\n      box-shadow: none; }\n      .navbar-nav .open .dropdown-menu > li > a,\n      .navbar-nav .open .dropdown-menu .dropdown-header {\n        padding: 5px 15px 5px 25px; }\n      .navbar-nav .open .dropdown-menu > li > a {\n        line-height: 20px; }\n        .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-nav .open .dropdown-menu > li > a:focus {\n          background-image: none; } }\n  @media (min-width: 768px) {\n    .navbar-nav {\n      float: left;\n      margin: 0; }\n      .navbar-nav > li {\n        float: left; }\n        .navbar-nav > li > a {\n          padding-top: 15px;\n          padding-bottom: 15px; } }\n\n.navbar-form {\n  margin-left: -15px;\n  margin-right: -15px;\n  padding: 10px 15px;\n  border-top: 1px solid transparent;\n  border-bottom: 1px solid transparent;\n  -webkit-box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1), 0 1px 0 rgba(255, 255, 255, 0.1);\n  margin-top: 8px;\n  margin-bottom: 8px; }\n  @media (min-width: 768px) {\n    .navbar-form .form-group {\n      display: inline-block;\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .form-control {\n      display: inline-block;\n      width: auto;\n      vertical-align: middle; }\n    .navbar-form .form-control-static {\n      display: inline-block; }\n    .navbar-form .input-group {\n      display: inline-table;\n      vertical-align: middle; }\n      .navbar-form .input-group .input-group-addon,\n      .navbar-form .input-group .input-group-btn,\n      .navbar-form .input-group .form-control {\n        width: auto; }\n    .navbar-form .input-group > .form-control {\n      width: 100%; }\n    .navbar-form .control-label {\n      margin-bottom: 0;\n      vertical-align: middle; }\n    .navbar-form .radio,\n    .navbar-form .checkbox {\n      display: inline-block;\n      margin-top: 0;\n      margin-bottom: 0;\n      vertical-align: middle; }\n      .navbar-form .radio label,\n      .navbar-form .checkbox label {\n        padding-left: 0; }\n    .navbar-form .radio input[type=\"radio\"],\n    .navbar-form .checkbox input[type=\"checkbox\"] {\n      position: relative;\n      margin-left: 0; }\n    .navbar-form .has-feedback .form-control-feedback {\n      top: 0; } }\n  @media (max-width: 767px) {\n    .navbar-form .form-group {\n      margin-bottom: 5px; }\n      .navbar-form .form-group:last-child {\n        margin-bottom: 0; } }\n  @media (min-width: 768px) {\n    .navbar-form {\n      width: auto;\n      border: 0;\n      margin-left: 0;\n      margin-right: 0;\n      padding-top: 0;\n      padding-bottom: 0;\n      -webkit-box-shadow: none;\n      box-shadow: none; } }\n\n.navbar-nav > li > .dropdown-menu {\n  margin-top: 0;\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.navbar-fixed-bottom .navbar-nav > li > .dropdown-menu {\n  margin-bottom: 0;\n  border-top-right-radius: 4px;\n  border-top-left-radius: 4px;\n  border-bottom-right-radius: 0;\n  border-bottom-left-radius: 0; }\n\n.navbar-btn {\n  margin-top: 8px;\n  margin-bottom: 8px; }\n  .navbar-btn.btn-sm, .btn-group-sm > .navbar-btn.btn {\n    margin-top: 10px;\n    margin-bottom: 10px; }\n  .navbar-btn.btn-xs, .btn-group-xs > .navbar-btn.btn {\n    margin-top: 14px;\n    margin-bottom: 14px; }\n\n.navbar-text {\n  margin-top: 15px;\n  margin-bottom: 15px; }\n  @media (min-width: 768px) {\n    .navbar-text {\n      float: left;\n      margin-left: 15px;\n      margin-right: 15px; } }\n\n@media (min-width: 768px) {\n  .navbar-left {\n    float: left !important; }\n  .navbar-right {\n    float: right !important;\n    margin-right: -15px; }\n    .navbar-right ~ .navbar-right {\n      margin-right: 0; } }\n\n.navbar-default {\n  background-color: #f8f8f8;\n  border-color: #e7e7e7; }\n  .navbar-default .navbar-brand {\n    color: #777; }\n    .navbar-default .navbar-brand:hover, .navbar-default .navbar-brand:focus {\n      color: #5e5e5e;\n      background-color: transparent; }\n  .navbar-default .navbar-text {\n    color: #777; }\n  .navbar-default .navbar-nav > li > a {\n    color: #777; }\n    .navbar-default .navbar-nav > li > a:hover, .navbar-default .navbar-nav > li > a:focus {\n      color: #333;\n      background-color: transparent; }\n  .navbar-default .navbar-nav > .active > a, .navbar-default .navbar-nav > .active > a:hover, .navbar-default .navbar-nav > .active > a:focus {\n    color: #555;\n    background-color: #e7e7e7; }\n  .navbar-default .navbar-nav > .disabled > a, .navbar-default .navbar-nav > .disabled > a:hover, .navbar-default .navbar-nav > .disabled > a:focus {\n    color: #ccc;\n    background-color: transparent; }\n  .navbar-default .navbar-toggle {\n    border-color: #ddd; }\n    .navbar-default .navbar-toggle:hover, .navbar-default .navbar-toggle:focus {\n      background-color: #ddd; }\n    .navbar-default .navbar-toggle .icon-bar {\n      background-color: #888; }\n  .navbar-default .navbar-collapse,\n  .navbar-default .navbar-form {\n    border-color: #e7e7e7; }\n  .navbar-default .navbar-nav > .open > a, .navbar-default .navbar-nav > .open > a:hover, .navbar-default .navbar-nav > .open > a:focus {\n    background-color: #e7e7e7;\n    color: #555; }\n  @media (max-width: 767px) {\n    .navbar-default .navbar-nav .open .dropdown-menu > li > a {\n      color: #777; }\n      .navbar-default .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #333;\n        background-color: transparent; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .active > a, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #555;\n      background-color: #e7e7e7; }\n    .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-default .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #ccc;\n      background-color: transparent; } }\n  .navbar-default .navbar-link {\n    color: #777; }\n    .navbar-default .navbar-link:hover {\n      color: #333; }\n  .navbar-default .btn-link {\n    color: #777; }\n    .navbar-default .btn-link:hover, .navbar-default .btn-link:focus {\n      color: #333; }\n    .navbar-default .btn-link[disabled]:hover, .navbar-default .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-default .btn-link:hover,\n    fieldset[disabled] .navbar-default .btn-link:focus {\n      color: #ccc; }\n\n.navbar-inverse {\n  background-color: #222;\n  border-color: #090909; }\n  .navbar-inverse .navbar-brand {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-brand:hover, .navbar-inverse .navbar-brand:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-text {\n    color: #9d9d9d; }\n  .navbar-inverse .navbar-nav > li > a {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-nav > li > a:hover, .navbar-inverse .navbar-nav > li > a:focus {\n      color: #fff;\n      background-color: transparent; }\n  .navbar-inverse .navbar-nav > .active > a, .navbar-inverse .navbar-nav > .active > a:hover, .navbar-inverse .navbar-nav > .active > a:focus {\n    color: #fff;\n    background-color: #090909; }\n  .navbar-inverse .navbar-nav > .disabled > a, .navbar-inverse .navbar-nav > .disabled > a:hover, .navbar-inverse .navbar-nav > .disabled > a:focus {\n    color: #444;\n    background-color: transparent; }\n  .navbar-inverse .navbar-toggle {\n    border-color: #333; }\n    .navbar-inverse .navbar-toggle:hover, .navbar-inverse .navbar-toggle:focus {\n      background-color: #333; }\n    .navbar-inverse .navbar-toggle .icon-bar {\n      background-color: #fff; }\n  .navbar-inverse .navbar-collapse,\n  .navbar-inverse .navbar-form {\n    border-color: #101010; }\n  .navbar-inverse .navbar-nav > .open > a, .navbar-inverse .navbar-nav > .open > a:hover, .navbar-inverse .navbar-nav > .open > a:focus {\n    background-color: #090909;\n    color: #fff; }\n  @media (max-width: 767px) {\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .dropdown-header {\n      border-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu .divider {\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > li > a {\n      color: #9d9d9d; }\n      .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > li > a:focus {\n        color: #fff;\n        background-color: transparent; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .active > a:focus {\n      color: #fff;\n      background-color: #090909; }\n    .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:hover, .navbar-inverse .navbar-nav .open .dropdown-menu > .disabled > a:focus {\n      color: #444;\n      background-color: transparent; } }\n  .navbar-inverse .navbar-link {\n    color: #9d9d9d; }\n    .navbar-inverse .navbar-link:hover {\n      color: #fff; }\n  .navbar-inverse .btn-link {\n    color: #9d9d9d; }\n    .navbar-inverse .btn-link:hover, .navbar-inverse .btn-link:focus {\n      color: #fff; }\n    .navbar-inverse .btn-link[disabled]:hover, .navbar-inverse .btn-link[disabled]:focus,\n    fieldset[disabled] .navbar-inverse .btn-link:hover,\n    fieldset[disabled] .navbar-inverse .btn-link:focus {\n      color: #444; }\n\n.breadcrumb {\n  padding: 8px 15px;\n  margin-bottom: 20px;\n  list-style: none;\n  background-color: #f5f5f5;\n  border-radius: 4px; }\n  .breadcrumb > li {\n    display: inline-block; }\n    .breadcrumb > li + li:before {\n      content: \"/\\A0\";\n      padding: 0 5px;\n      color: #ccc; }\n  .breadcrumb > .active {\n    color: #777777; }\n\n.pagination {\n  display: inline-block;\n  padding-left: 0;\n  margin: 20px 0;\n  border-radius: 4px; }\n  .pagination > li {\n    display: inline; }\n    .pagination > li > a,\n    .pagination > li > span {\n      position: relative;\n      float: left;\n      padding: 6px 12px;\n      line-height: 1.42857;\n      text-decoration: none;\n      color: #337ab7;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      margin-left: -1px; }\n    .pagination > li:first-child > a,\n    .pagination > li:first-child > span {\n      margin-left: 0;\n      border-bottom-left-radius: 4px;\n      border-top-left-radius: 4px; }\n    .pagination > li:last-child > a,\n    .pagination > li:last-child > span {\n      border-bottom-right-radius: 4px;\n      border-top-right-radius: 4px; }\n  .pagination > li > a:hover, .pagination > li > a:focus,\n  .pagination > li > span:hover,\n  .pagination > li > span:focus {\n    z-index: 2;\n    color: #23527c;\n    background-color: #eeeeee;\n    border-color: #ddd; }\n  .pagination > .active > a, .pagination > .active > a:hover, .pagination > .active > a:focus,\n  .pagination > .active > span,\n  .pagination > .active > span:hover,\n  .pagination > .active > span:focus {\n    z-index: 3;\n    color: #fff;\n    background-color: #337ab7;\n    border-color: #337ab7;\n    cursor: default; }\n  .pagination > .disabled > span,\n  .pagination > .disabled > span:hover,\n  .pagination > .disabled > span:focus,\n  .pagination > .disabled > a,\n  .pagination > .disabled > a:hover,\n  .pagination > .disabled > a:focus {\n    color: #777777;\n    background-color: #fff;\n    border-color: #ddd;\n    cursor: not-allowed; }\n\n.pagination-lg > li > a,\n.pagination-lg > li > span {\n  padding: 10px 16px;\n  font-size: 18px;\n  line-height: 1.33333; }\n\n.pagination-lg > li:first-child > a,\n.pagination-lg > li:first-child > span {\n  border-bottom-left-radius: 6px;\n  border-top-left-radius: 6px; }\n\n.pagination-lg > li:last-child > a,\n.pagination-lg > li:last-child > span {\n  border-bottom-right-radius: 6px;\n  border-top-right-radius: 6px; }\n\n.pagination-sm > li > a,\n.pagination-sm > li > span {\n  padding: 5px 10px;\n  font-size: 12px;\n  line-height: 1.5; }\n\n.pagination-sm > li:first-child > a,\n.pagination-sm > li:first-child > span {\n  border-bottom-left-radius: 3px;\n  border-top-left-radius: 3px; }\n\n.pagination-sm > li:last-child > a,\n.pagination-sm > li:last-child > span {\n  border-bottom-right-radius: 3px;\n  border-top-right-radius: 3px; }\n\n.pager {\n  padding-left: 0;\n  margin: 20px 0;\n  list-style: none;\n  text-align: center; }\n  .pager:before, .pager:after {\n    content: \" \";\n    display: table; }\n  .pager:after {\n    clear: both; }\n  .pager li {\n    display: inline; }\n    .pager li > a,\n    .pager li > span {\n      display: inline-block;\n      padding: 5px 14px;\n      background-color: #fff;\n      border: 1px solid #ddd;\n      border-radius: 15px; }\n    .pager li > a:hover,\n    .pager li > a:focus {\n      text-decoration: none;\n      background-color: #eeeeee; }\n  .pager .next > a,\n  .pager .next > span {\n    float: right; }\n  .pager .previous > a,\n  .pager .previous > span {\n    float: left; }\n  .pager .disabled > a,\n  .pager .disabled > a:hover,\n  .pager .disabled > a:focus,\n  .pager .disabled > span {\n    color: #777777;\n    background-color: #fff;\n    cursor: not-allowed; }\n\n.label {\n  display: inline;\n  padding: .2em .6em .3em;\n  font-size: 75%;\n  font-weight: bold;\n  line-height: 1;\n  color: #fff;\n  text-align: center;\n  white-space: nowrap;\n  vertical-align: baseline;\n  border-radius: .25em; }\n  .label:empty {\n    display: none; }\n  .btn .label {\n    position: relative;\n    top: -1px; }\n\na.label:hover, a.label:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.label-default {\n  background-color: #777777; }\n  .label-default[href]:hover, .label-default[href]:focus {\n    background-color: #5e5e5e; }\n\n.label-primary {\n  background-color: #337ab7; }\n  .label-primary[href]:hover, .label-primary[href]:focus {\n    background-color: #286090; }\n\n.label-success {\n  background-color: #5cb85c; }\n  .label-success[href]:hover, .label-success[href]:focus {\n    background-color: #449d44; }\n\n.label-info {\n  background-color: #5bc0de; }\n  .label-info[href]:hover, .label-info[href]:focus {\n    background-color: #31b0d5; }\n\n.label-warning {\n  background-color: #f0ad4e; }\n  .label-warning[href]:hover, .label-warning[href]:focus {\n    background-color: #ec971f; }\n\n.label-danger {\n  background-color: #d9534f; }\n  .label-danger[href]:hover, .label-danger[href]:focus {\n    background-color: #c9302c; }\n\n.badge {\n  display: inline-block;\n  min-width: 10px;\n  padding: 3px 7px;\n  font-size: 12px;\n  font-weight: bold;\n  color: #fff;\n  line-height: 1;\n  vertical-align: middle;\n  white-space: nowrap;\n  text-align: center;\n  background-color: #777777;\n  border-radius: 10px; }\n  .badge:empty {\n    display: none; }\n  .btn .badge {\n    position: relative;\n    top: -1px; }\n  .btn-xs .badge, .btn-group-xs > .btn .badge,\n  .btn-group-xs > .btn .badge {\n    top: 0;\n    padding: 1px 5px; }\n  .list-group-item.active > .badge,\n  .nav-pills > .active > a > .badge {\n    color: #337ab7;\n    background-color: #fff; }\n  .list-group-item > .badge {\n    float: right; }\n  .list-group-item > .badge + .badge {\n    margin-right: 5px; }\n  .nav-pills > li > a > .badge {\n    margin-left: 3px; }\n\na.badge:hover, a.badge:focus {\n  color: #fff;\n  text-decoration: none;\n  cursor: pointer; }\n\n.jumbotron {\n  padding-top: 30px;\n  padding-bottom: 30px;\n  margin-bottom: 30px;\n  color: inherit;\n  background-color: #eeeeee; }\n  .jumbotron h1,\n  .jumbotron .h1 {\n    color: inherit; }\n  .jumbotron p {\n    margin-bottom: 15px;\n    font-size: 21px;\n    font-weight: 200; }\n  .jumbotron > hr {\n    border-top-color: #d5d5d5; }\n  .container .jumbotron,\n  .container-fluid .jumbotron {\n    border-radius: 6px;\n    padding-left: 15px;\n    padding-right: 15px; }\n  .jumbotron .container {\n    max-width: 100%; }\n  @media screen and (min-width: 768px) {\n    .jumbotron {\n      padding-top: 48px;\n      padding-bottom: 48px; }\n      .container .jumbotron,\n      .container-fluid .jumbotron {\n        padding-left: 60px;\n        padding-right: 60px; }\n      .jumbotron h1,\n      .jumbotron .h1 {\n        font-size: 63px; } }\n\n.thumbnail {\n  display: block;\n  padding: 4px;\n  margin-bottom: 20px;\n  line-height: 1.42857;\n  background-color: #fff;\n  border: 1px solid #ddd;\n  border-radius: 4px;\n  -webkit-transition: border 0.2s ease-in-out;\n  -o-transition: border 0.2s ease-in-out;\n  transition: border 0.2s ease-in-out; }\n  .thumbnail > img,\n  .thumbnail a > img {\n    display: block;\n    max-width: 100%;\n    height: auto;\n    margin-left: auto;\n    margin-right: auto; }\n  .thumbnail .caption {\n    padding: 9px;\n    color: #333333; }\n\na.thumbnail:hover,\na.thumbnail:focus,\na.thumbnail.active {\n  border-color: #337ab7; }\n\n.alert {\n  padding: 15px;\n  margin-bottom: 20px;\n  border: 1px solid transparent;\n  border-radius: 4px; }\n  .alert h4 {\n    margin-top: 0;\n    color: inherit; }\n  .alert .alert-link {\n    font-weight: bold; }\n  .alert > p,\n  .alert > ul {\n    margin-bottom: 0; }\n  .alert > p + p {\n    margin-top: 5px; }\n\n.alert-dismissable,\n.alert-dismissible {\n  padding-right: 35px; }\n  .alert-dismissable .close,\n  .alert-dismissible .close {\n    position: relative;\n    top: -2px;\n    right: -21px;\n    color: inherit; }\n\n.alert-success {\n  background-color: #dff0d8;\n  border-color: #d6e9c6;\n  color: #3c763d; }\n  .alert-success hr {\n    border-top-color: #c9e2b3; }\n  .alert-success .alert-link {\n    color: #2b542c; }\n\n.alert-info {\n  background-color: #d9edf7;\n  border-color: #bce8f1;\n  color: #31708f; }\n  .alert-info hr {\n    border-top-color: #a6e1ec; }\n  .alert-info .alert-link {\n    color: #245269; }\n\n.alert-warning {\n  background-color: #fcf8e3;\n  border-color: #faebcc;\n  color: #8a6d3b; }\n  .alert-warning hr {\n    border-top-color: #f7e1b5; }\n  .alert-warning .alert-link {\n    color: #66512c; }\n\n.alert-danger {\n  background-color: #f2dede;\n  border-color: #ebccd1;\n  color: #a94442; }\n  .alert-danger hr {\n    border-top-color: #e4b9c0; }\n  .alert-danger .alert-link {\n    color: #843534; }\n\n@-webkit-keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n@keyframes progress-bar-stripes {\n  from {\n    background-position: 40px 0; }\n  to {\n    background-position: 0 0; } }\n\n.progress {\n  overflow: hidden;\n  height: 20px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1); }\n\n.progress-bar {\n  float: left;\n  width: 0%;\n  height: 100%;\n  font-size: 12px;\n  line-height: 20px;\n  color: #fff;\n  text-align: center;\n  background-color: #337ab7;\n  -webkit-box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.15);\n  -webkit-transition: width 0.6s ease;\n  -o-transition: width 0.6s ease;\n  transition: width 0.6s ease; }\n\n.progress-striped .progress-bar,\n.progress-bar-striped {\n  background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n  background-size: 40px 40px; }\n\n.progress.active .progress-bar,\n.progress-bar.active {\n  -webkit-animation: progress-bar-stripes 2s linear infinite;\n  -o-animation: progress-bar-stripes 2s linear infinite;\n  animation: progress-bar-stripes 2s linear infinite; }\n\n.progress-bar-success {\n  background-color: #5cb85c; }\n  .progress-striped .progress-bar-success {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-info {\n  background-color: #5bc0de; }\n  .progress-striped .progress-bar-info {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-warning {\n  background-color: #f0ad4e; }\n  .progress-striped .progress-bar-warning {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.progress-bar-danger {\n  background-color: #d9534f; }\n  .progress-striped .progress-bar-danger {\n    background-image: -webkit-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: -o-linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent);\n    background-image: linear-gradient(45deg, rgba(255, 255, 255, 0.15) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.15) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 75%, transparent); }\n\n.media {\n  margin-top: 15px; }\n  .media:first-child {\n    margin-top: 0; }\n\n.media,\n.media-body {\n  zoom: 1;\n  overflow: hidden; }\n\n.media-body {\n  width: 10000px; }\n\n.media-object {\n  display: block; }\n  .media-object.img-thumbnail {\n    max-width: none; }\n\n.media-right,\n.media > .pull-right {\n  padding-left: 10px; }\n\n.media-left,\n.media > .pull-left {\n  padding-right: 10px; }\n\n.media-left,\n.media-right,\n.media-body {\n  display: table-cell;\n  vertical-align: top; }\n\n.media-middle {\n  vertical-align: middle; }\n\n.media-bottom {\n  vertical-align: bottom; }\n\n.media-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.media-list {\n  padding-left: 0;\n  list-style: none; }\n\n.list-group {\n  margin-bottom: 20px;\n  padding-left: 0; }\n\n.list-group-item {\n  position: relative;\n  display: block;\n  padding: 10px 15px;\n  margin-bottom: -1px;\n  background-color: #fff;\n  border: 1px solid #ddd; }\n  .list-group-item:first-child {\n    border-top-right-radius: 4px;\n    border-top-left-radius: 4px; }\n  .list-group-item:last-child {\n    margin-bottom: 0;\n    border-bottom-right-radius: 4px;\n    border-bottom-left-radius: 4px; }\n\na.list-group-item,\nbutton.list-group-item {\n  color: #555; }\n  a.list-group-item .list-group-item-heading,\n  button.list-group-item .list-group-item-heading {\n    color: #333; }\n  a.list-group-item:hover, a.list-group-item:focus,\n  button.list-group-item:hover,\n  button.list-group-item:focus {\n    text-decoration: none;\n    color: #555;\n    background-color: #f5f5f5; }\n\nbutton.list-group-item {\n  width: 100%;\n  text-align: left; }\n\n.list-group-item.disabled, .list-group-item.disabled:hover, .list-group-item.disabled:focus {\n  background-color: #eeeeee;\n  color: #777777;\n  cursor: not-allowed; }\n  .list-group-item.disabled .list-group-item-heading, .list-group-item.disabled:hover .list-group-item-heading, .list-group-item.disabled:focus .list-group-item-heading {\n    color: inherit; }\n  .list-group-item.disabled .list-group-item-text, .list-group-item.disabled:hover .list-group-item-text, .list-group-item.disabled:focus .list-group-item-text {\n    color: #777777; }\n\n.list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus {\n  z-index: 2;\n  color: #fff;\n  background-color: #337ab7;\n  border-color: #337ab7; }\n  .list-group-item.active .list-group-item-heading,\n  .list-group-item.active .list-group-item-heading > small,\n  .list-group-item.active .list-group-item-heading > .small, .list-group-item.active:hover .list-group-item-heading,\n  .list-group-item.active:hover .list-group-item-heading > small,\n  .list-group-item.active:hover .list-group-item-heading > .small, .list-group-item.active:focus .list-group-item-heading,\n  .list-group-item.active:focus .list-group-item-heading > small,\n  .list-group-item.active:focus .list-group-item-heading > .small {\n    color: inherit; }\n  .list-group-item.active .list-group-item-text, .list-group-item.active:hover .list-group-item-text, .list-group-item.active:focus .list-group-item-text {\n    color: #c7ddef; }\n\n.list-group-item-success {\n  color: #3c763d;\n  background-color: #dff0d8; }\n\na.list-group-item-success,\nbutton.list-group-item-success {\n  color: #3c763d; }\n  a.list-group-item-success .list-group-item-heading,\n  button.list-group-item-success .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-success:hover, a.list-group-item-success:focus,\n  button.list-group-item-success:hover,\n  button.list-group-item-success:focus {\n    color: #3c763d;\n    background-color: #d0e9c6; }\n  a.list-group-item-success.active, a.list-group-item-success.active:hover, a.list-group-item-success.active:focus,\n  button.list-group-item-success.active,\n  button.list-group-item-success.active:hover,\n  button.list-group-item-success.active:focus {\n    color: #fff;\n    background-color: #3c763d;\n    border-color: #3c763d; }\n\n.list-group-item-info {\n  color: #31708f;\n  background-color: #d9edf7; }\n\na.list-group-item-info,\nbutton.list-group-item-info {\n  color: #31708f; }\n  a.list-group-item-info .list-group-item-heading,\n  button.list-group-item-info .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-info:hover, a.list-group-item-info:focus,\n  button.list-group-item-info:hover,\n  button.list-group-item-info:focus {\n    color: #31708f;\n    background-color: #c4e3f3; }\n  a.list-group-item-info.active, a.list-group-item-info.active:hover, a.list-group-item-info.active:focus,\n  button.list-group-item-info.active,\n  button.list-group-item-info.active:hover,\n  button.list-group-item-info.active:focus {\n    color: #fff;\n    background-color: #31708f;\n    border-color: #31708f; }\n\n.list-group-item-warning {\n  color: #8a6d3b;\n  background-color: #fcf8e3; }\n\na.list-group-item-warning,\nbutton.list-group-item-warning {\n  color: #8a6d3b; }\n  a.list-group-item-warning .list-group-item-heading,\n  button.list-group-item-warning .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-warning:hover, a.list-group-item-warning:focus,\n  button.list-group-item-warning:hover,\n  button.list-group-item-warning:focus {\n    color: #8a6d3b;\n    background-color: #faf2cc; }\n  a.list-group-item-warning.active, a.list-group-item-warning.active:hover, a.list-group-item-warning.active:focus,\n  button.list-group-item-warning.active,\n  button.list-group-item-warning.active:hover,\n  button.list-group-item-warning.active:focus {\n    color: #fff;\n    background-color: #8a6d3b;\n    border-color: #8a6d3b; }\n\n.list-group-item-danger {\n  color: #a94442;\n  background-color: #f2dede; }\n\na.list-group-item-danger,\nbutton.list-group-item-danger {\n  color: #a94442; }\n  a.list-group-item-danger .list-group-item-heading,\n  button.list-group-item-danger .list-group-item-heading {\n    color: inherit; }\n  a.list-group-item-danger:hover, a.list-group-item-danger:focus,\n  button.list-group-item-danger:hover,\n  button.list-group-item-danger:focus {\n    color: #a94442;\n    background-color: #ebcccc; }\n  a.list-group-item-danger.active, a.list-group-item-danger.active:hover, a.list-group-item-danger.active:focus,\n  button.list-group-item-danger.active,\n  button.list-group-item-danger.active:hover,\n  button.list-group-item-danger.active:focus {\n    color: #fff;\n    background-color: #a94442;\n    border-color: #a94442; }\n\n.list-group-item-heading {\n  margin-top: 0;\n  margin-bottom: 5px; }\n\n.list-group-item-text {\n  margin-bottom: 0;\n  line-height: 1.3; }\n\n.panel {\n  margin-bottom: 20px;\n  background-color: #fff;\n  border: 1px solid transparent;\n  border-radius: 4px;\n  -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05); }\n\n.panel-body {\n  padding: 15px; }\n  .panel-body:before, .panel-body:after {\n    content: \" \";\n    display: table; }\n  .panel-body:after {\n    clear: both; }\n\n.panel-heading {\n  padding: 10px 15px;\n  border-bottom: 1px solid transparent;\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel-heading > .dropdown .dropdown-toggle {\n    color: inherit; }\n\n.panel-title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-size: 16px;\n  color: inherit; }\n  .panel-title > a,\n  .panel-title > small,\n  .panel-title > .small,\n  .panel-title > small > a,\n  .panel-title > .small > a {\n    color: inherit; }\n\n.panel-footer {\n  padding: 10px 15px;\n  background-color: #f5f5f5;\n  border-top: 1px solid #ddd;\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n\n.panel > .list-group,\n.panel > .panel-collapse > .list-group {\n  margin-bottom: 0; }\n  .panel > .list-group .list-group-item,\n  .panel > .panel-collapse > .list-group .list-group-item {\n    border-width: 1px 0;\n    border-radius: 0; }\n  .panel > .list-group:first-child .list-group-item:first-child,\n  .panel > .panel-collapse > .list-group:first-child .list-group-item:first-child {\n    border-top: 0;\n    border-top-right-radius: 3px;\n    border-top-left-radius: 3px; }\n  .panel > .list-group:last-child .list-group-item:last-child,\n  .panel > .panel-collapse > .list-group:last-child .list-group-item:last-child {\n    border-bottom: 0;\n    border-bottom-right-radius: 3px;\n    border-bottom-left-radius: 3px; }\n\n.panel > .panel-heading + .panel-collapse > .list-group .list-group-item:first-child {\n  border-top-right-radius: 0;\n  border-top-left-radius: 0; }\n\n.panel-heading + .list-group .list-group-item:first-child {\n  border-top-width: 0; }\n\n.list-group + .panel-footer {\n  border-top-width: 0; }\n\n.panel > .table,\n.panel > .table-responsive > .table,\n.panel > .panel-collapse > .table {\n  margin-bottom: 0; }\n  .panel > .table caption,\n  .panel > .table-responsive > .table caption,\n  .panel > .panel-collapse > .table caption {\n    padding-left: 15px;\n    padding-right: 15px; }\n\n.panel > .table:first-child,\n.panel > .table-responsive:first-child > .table:first-child {\n  border-top-right-radius: 3px;\n  border-top-left-radius: 3px; }\n  .panel > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table:first-child > tbody:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child,\n  .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child {\n    border-top-left-radius: 3px;\n    border-top-right-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:first-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:first-child {\n      border-top-left-radius: 3px; }\n    .panel > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table:first-child > tbody:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > thead:first-child > tr:first-child th:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child td:last-child,\n    .panel > .table-responsive:first-child > .table:first-child > tbody:first-child > tr:first-child th:last-child {\n      border-top-right-radius: 3px; }\n\n.panel > .table:last-child,\n.panel > .table-responsive:last-child > .table:last-child {\n  border-bottom-right-radius: 3px;\n  border-bottom-left-radius: 3px; }\n  .panel > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table:last-child > tfoot:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child,\n  .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child {\n    border-bottom-left-radius: 3px;\n    border-bottom-right-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:first-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:first-child {\n      border-bottom-left-radius: 3px; }\n    .panel > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table:last-child > tfoot:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tbody:last-child > tr:last-child th:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child td:last-child,\n    .panel > .table-responsive:last-child > .table:last-child > tfoot:last-child > tr:last-child th:last-child {\n      border-bottom-right-radius: 3px; }\n\n.panel > .panel-body + .table,\n.panel > .panel-body + .table-responsive,\n.panel > .table + .panel-body,\n.panel > .table-responsive + .panel-body {\n  border-top: 1px solid #ddd; }\n\n.panel > .table > tbody:first-child > tr:first-child th,\n.panel > .table > tbody:first-child > tr:first-child td {\n  border-top: 0; }\n\n.panel > .table-bordered,\n.panel > .table-responsive > .table-bordered {\n  border: 0; }\n  .panel > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-bordered > tfoot > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {\n    border-left: 0; }\n  .panel > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-bordered > tfoot > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > thead > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,\n  .panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {\n    border-right: 0; }\n  .panel > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-bordered > tbody > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > thead > tr:first-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:first-child > th {\n    border-bottom: 0; }\n  .panel > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-bordered > tfoot > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td,\n  .panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th {\n    border-bottom: 0; }\n\n.panel > .table-responsive {\n  border: 0;\n  margin-bottom: 0; }\n\n.panel-group {\n  margin-bottom: 20px; }\n  .panel-group .panel {\n    margin-bottom: 0;\n    border-radius: 4px; }\n    .panel-group .panel + .panel {\n      margin-top: 5px; }\n  .panel-group .panel-heading {\n    border-bottom: 0; }\n    .panel-group .panel-heading + .panel-collapse > .panel-body,\n    .panel-group .panel-heading + .panel-collapse > .list-group {\n      border-top: 1px solid #ddd; }\n  .panel-group .panel-footer {\n    border-top: 0; }\n    .panel-group .panel-footer + .panel-collapse .panel-body {\n      border-bottom: 1px solid #ddd; }\n\n.panel-default {\n  border-color: #ddd; }\n  .panel-default > .panel-heading {\n    color: #333333;\n    background-color: #f5f5f5;\n    border-color: #ddd; }\n    .panel-default > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #ddd; }\n    .panel-default > .panel-heading .badge {\n      color: #f5f5f5;\n      background-color: #333333; }\n  .panel-default > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #ddd; }\n\n.panel-primary {\n  border-color: #337ab7; }\n  .panel-primary > .panel-heading {\n    color: #fff;\n    background-color: #337ab7;\n    border-color: #337ab7; }\n    .panel-primary > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #337ab7; }\n    .panel-primary > .panel-heading .badge {\n      color: #337ab7;\n      background-color: #fff; }\n  .panel-primary > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #337ab7; }\n\n.panel-success {\n  border-color: #d6e9c6; }\n  .panel-success > .panel-heading {\n    color: #3c763d;\n    background-color: #dff0d8;\n    border-color: #d6e9c6; }\n    .panel-success > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #d6e9c6; }\n    .panel-success > .panel-heading .badge {\n      color: #dff0d8;\n      background-color: #3c763d; }\n  .panel-success > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #d6e9c6; }\n\n.panel-info {\n  border-color: #bce8f1; }\n  .panel-info > .panel-heading {\n    color: #31708f;\n    background-color: #d9edf7;\n    border-color: #bce8f1; }\n    .panel-info > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #bce8f1; }\n    .panel-info > .panel-heading .badge {\n      color: #d9edf7;\n      background-color: #31708f; }\n  .panel-info > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #bce8f1; }\n\n.panel-warning {\n  border-color: #faebcc; }\n  .panel-warning > .panel-heading {\n    color: #8a6d3b;\n    background-color: #fcf8e3;\n    border-color: #faebcc; }\n    .panel-warning > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #faebcc; }\n    .panel-warning > .panel-heading .badge {\n      color: #fcf8e3;\n      background-color: #8a6d3b; }\n  .panel-warning > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #faebcc; }\n\n.panel-danger {\n  border-color: #ebccd1; }\n  .panel-danger > .panel-heading {\n    color: #a94442;\n    background-color: #f2dede;\n    border-color: #ebccd1; }\n    .panel-danger > .panel-heading + .panel-collapse > .panel-body {\n      border-top-color: #ebccd1; }\n    .panel-danger > .panel-heading .badge {\n      color: #f2dede;\n      background-color: #a94442; }\n  .panel-danger > .panel-footer + .panel-collapse > .panel-body {\n    border-bottom-color: #ebccd1; }\n\n.embed-responsive {\n  position: relative;\n  display: block;\n  height: 0;\n  padding: 0;\n  overflow: hidden; }\n  .embed-responsive .embed-responsive-item,\n  .embed-responsive iframe,\n  .embed-responsive embed,\n  .embed-responsive object,\n  .embed-responsive video {\n    position: absolute;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    height: 100%;\n    width: 100%;\n    border: 0; }\n\n.embed-responsive-16by9 {\n  padding-bottom: 56.25%; }\n\n.embed-responsive-4by3 {\n  padding-bottom: 75%; }\n\n.well {\n  min-height: 20px;\n  padding: 19px;\n  margin-bottom: 20px;\n  background-color: #f5f5f5;\n  border: 1px solid #e3e3e3;\n  border-radius: 4px;\n  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);\n  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05); }\n  .well blockquote {\n    border-color: #ddd;\n    border-color: rgba(0, 0, 0, 0.15); }\n\n.well-lg {\n  padding: 24px;\n  border-radius: 6px; }\n\n.well-sm {\n  padding: 9px;\n  border-radius: 3px; }\n\n.close {\n  float: right;\n  font-size: 21px;\n  font-weight: bold;\n  line-height: 1;\n  color: #000;\n  text-shadow: 0 1px 0 #fff;\n  opacity: 0.2;\n  filter: alpha(opacity=20); }\n  .close:hover, .close:focus {\n    color: #000;\n    text-decoration: none;\n    cursor: pointer;\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\nbutton.close {\n  padding: 0;\n  cursor: pointer;\n  background: transparent;\n  border: 0;\n  -webkit-appearance: none; }\n\n.modal-open {\n  overflow: hidden; }\n\n.modal {\n  display: none;\n  overflow: hidden;\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1050;\n  -webkit-overflow-scrolling: touch;\n  outline: 0; }\n  .modal.fade .modal-dialog {\n    -webkit-transform: translate(0, -25%);\n    -ms-transform: translate(0, -25%);\n    -o-transform: translate(0, -25%);\n    transform: translate(0, -25%);\n    -webkit-transition: -webkit-transform 0.3s ease-out;\n    -moz-transition: -moz-transform 0.3s ease-out;\n    -o-transition: -o-transform 0.3s ease-out;\n    transition: transform 0.3s ease-out; }\n  .modal.in .modal-dialog {\n    -webkit-transform: translate(0, 0);\n    -ms-transform: translate(0, 0);\n    -o-transform: translate(0, 0);\n    transform: translate(0, 0); }\n\n.modal-open .modal {\n  overflow-x: hidden;\n  overflow-y: auto; }\n\n.modal-dialog {\n  position: relative;\n  width: auto;\n  margin: 10px; }\n\n.modal-content {\n  position: relative;\n  background-color: #fff;\n  border: 1px solid #999;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  box-shadow: 0 3px 9px rgba(0, 0, 0, 0.5);\n  background-clip: padding-box;\n  outline: 0; }\n\n.modal-backdrop {\n  position: fixed;\n  top: 0;\n  right: 0;\n  bottom: 0;\n  left: 0;\n  z-index: 1040;\n  background-color: #000; }\n  .modal-backdrop.fade {\n    opacity: 0;\n    filter: alpha(opacity=0); }\n  .modal-backdrop.in {\n    opacity: 0.5;\n    filter: alpha(opacity=50); }\n\n.modal-header {\n  padding: 15px;\n  border-bottom: 1px solid #e5e5e5; }\n  .modal-header:before, .modal-header:after {\n    content: \" \";\n    display: table; }\n  .modal-header:after {\n    clear: both; }\n\n.modal-header .close {\n  margin-top: -2px; }\n\n.modal-title {\n  margin: 0;\n  line-height: 1.42857; }\n\n.modal-body {\n  position: relative;\n  padding: 15px; }\n\n.modal-footer {\n  padding: 15px;\n  text-align: right;\n  border-top: 1px solid #e5e5e5; }\n  .modal-footer:before, .modal-footer:after {\n    content: \" \";\n    display: table; }\n  .modal-footer:after {\n    clear: both; }\n  .modal-footer .btn + .btn {\n    margin-left: 5px;\n    margin-bottom: 0; }\n  .modal-footer .btn-group .btn + .btn {\n    margin-left: -1px; }\n  .modal-footer .btn-block + .btn-block {\n    margin-left: 0; }\n\n.modal-scrollbar-measure {\n  position: absolute;\n  top: -9999px;\n  width: 50px;\n  height: 50px;\n  overflow: scroll; }\n\n@media (min-width: 768px) {\n  .modal-dialog {\n    width: 600px;\n    margin: 30px auto; }\n  .modal-content {\n    -webkit-box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);\n    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5); }\n  .modal-sm {\n    width: 300px; } }\n\n@media (min-width: 992px) {\n  .modal-lg {\n    width: 900px; } }\n\n.tooltip {\n  position: absolute;\n  z-index: 1070;\n  display: block;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 12px;\n  opacity: 0;\n  filter: alpha(opacity=0); }\n  .tooltip.in {\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .tooltip.top {\n    margin-top: -3px;\n    padding: 5px 0; }\n  .tooltip.right {\n    margin-left: 3px;\n    padding: 0 5px; }\n  .tooltip.bottom {\n    margin-top: 3px;\n    padding: 5px 0; }\n  .tooltip.left {\n    margin-left: -3px;\n    padding: 0 5px; }\n\n.tooltip-inner {\n  max-width: 200px;\n  padding: 3px 8px;\n  color: #fff;\n  text-align: center;\n  background-color: #000;\n  border-radius: 4px; }\n\n.tooltip-arrow {\n  position: absolute;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.tooltip.top .tooltip-arrow {\n  bottom: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-left .tooltip-arrow {\n  bottom: 0;\n  right: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.top-right .tooltip-arrow {\n  bottom: 0;\n  left: 5px;\n  margin-bottom: -5px;\n  border-width: 5px 5px 0;\n  border-top-color: #000; }\n\n.tooltip.right .tooltip-arrow {\n  top: 50%;\n  left: 0;\n  margin-top: -5px;\n  border-width: 5px 5px 5px 0;\n  border-right-color: #000; }\n\n.tooltip.left .tooltip-arrow {\n  top: 50%;\n  right: 0;\n  margin-top: -5px;\n  border-width: 5px 0 5px 5px;\n  border-left-color: #000; }\n\n.tooltip.bottom .tooltip-arrow {\n  top: 0;\n  left: 50%;\n  margin-left: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-left .tooltip-arrow {\n  top: 0;\n  right: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.tooltip.bottom-right .tooltip-arrow {\n  top: 0;\n  left: 5px;\n  margin-top: -5px;\n  border-width: 0 5px 5px;\n  border-bottom-color: #000; }\n\n.popover {\n  position: absolute;\n  top: 0;\n  left: 0;\n  z-index: 1060;\n  display: none;\n  max-width: 276px;\n  padding: 1px;\n  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;\n  font-style: normal;\n  font-weight: normal;\n  letter-spacing: normal;\n  line-break: auto;\n  line-height: 1.42857;\n  text-align: left;\n  text-align: start;\n  text-decoration: none;\n  text-shadow: none;\n  text-transform: none;\n  white-space: normal;\n  word-break: normal;\n  word-spacing: normal;\n  word-wrap: normal;\n  font-size: 14px;\n  background-color: #fff;\n  background-clip: padding-box;\n  border: 1px solid #ccc;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  border-radius: 6px;\n  -webkit-box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);\n  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2); }\n  .popover.top {\n    margin-top: -10px; }\n  .popover.right {\n    margin-left: 10px; }\n  .popover.bottom {\n    margin-top: 10px; }\n  .popover.left {\n    margin-left: -10px; }\n\n.popover-title {\n  margin: 0;\n  padding: 8px 14px;\n  font-size: 14px;\n  background-color: #f7f7f7;\n  border-bottom: 1px solid #ebebeb;\n  border-radius: 5px 5px 0 0; }\n\n.popover-content {\n  padding: 9px 14px; }\n\n.popover > .arrow, .popover > .arrow:after {\n  position: absolute;\n  display: block;\n  width: 0;\n  height: 0;\n  border-color: transparent;\n  border-style: solid; }\n\n.popover > .arrow {\n  border-width: 11px; }\n\n.popover > .arrow:after {\n  border-width: 10px;\n  content: \"\"; }\n\n.popover.top > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-bottom-width: 0;\n  border-top-color: #999999;\n  border-top-color: rgba(0, 0, 0, 0.25);\n  bottom: -11px; }\n  .popover.top > .arrow:after {\n    content: \" \";\n    bottom: 1px;\n    margin-left: -10px;\n    border-bottom-width: 0;\n    border-top-color: #fff; }\n\n.popover.right > .arrow {\n  top: 50%;\n  left: -11px;\n  margin-top: -11px;\n  border-left-width: 0;\n  border-right-color: #999999;\n  border-right-color: rgba(0, 0, 0, 0.25); }\n  .popover.right > .arrow:after {\n    content: \" \";\n    left: 1px;\n    bottom: -10px;\n    border-left-width: 0;\n    border-right-color: #fff; }\n\n.popover.bottom > .arrow {\n  left: 50%;\n  margin-left: -11px;\n  border-top-width: 0;\n  border-bottom-color: #999999;\n  border-bottom-color: rgba(0, 0, 0, 0.25);\n  top: -11px; }\n  .popover.bottom > .arrow:after {\n    content: \" \";\n    top: 1px;\n    margin-left: -10px;\n    border-top-width: 0;\n    border-bottom-color: #fff; }\n\n.popover.left > .arrow {\n  top: 50%;\n  right: -11px;\n  margin-top: -11px;\n  border-right-width: 0;\n  border-left-color: #999999;\n  border-left-color: rgba(0, 0, 0, 0.25); }\n  .popover.left > .arrow:after {\n    content: \" \";\n    right: 1px;\n    border-right-width: 0;\n    border-left-color: #fff;\n    bottom: -10px; }\n\n.carousel {\n  position: relative; }\n\n.carousel-inner {\n  position: relative;\n  overflow: hidden;\n  width: 100%; }\n  .carousel-inner > .item {\n    display: none;\n    position: relative;\n    -webkit-transition: 0.6s ease-in-out left;\n    -o-transition: 0.6s ease-in-out left;\n    transition: 0.6s ease-in-out left; }\n    .carousel-inner > .item > img,\n    .carousel-inner > .item > a > img {\n      display: block;\n      max-width: 100%;\n      height: auto;\n      line-height: 1; }\n    @media all and (transform-3d), (-webkit-transform-3d) {\n      .carousel-inner > .item {\n        -webkit-transition: -webkit-transform 0.6s ease-in-out;\n        -moz-transition: -moz-transform 0.6s ease-in-out;\n        -o-transition: -o-transform 0.6s ease-in-out;\n        transition: transform 0.6s ease-in-out;\n        -webkit-backface-visibility: hidden;\n        -moz-backface-visibility: hidden;\n        backface-visibility: hidden;\n        -webkit-perspective: 1000px;\n        -moz-perspective: 1000px;\n        perspective: 1000px; }\n        .carousel-inner > .item.next, .carousel-inner > .item.active.right {\n          -webkit-transform: translate3d(100%, 0, 0);\n          transform: translate3d(100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.prev, .carousel-inner > .item.active.left {\n          -webkit-transform: translate3d(-100%, 0, 0);\n          transform: translate3d(-100%, 0, 0);\n          left: 0; }\n        .carousel-inner > .item.next.left, .carousel-inner > .item.prev.right, .carousel-inner > .item.active {\n          -webkit-transform: translate3d(0, 0, 0);\n          transform: translate3d(0, 0, 0);\n          left: 0; } }\n  .carousel-inner > .active,\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    display: block; }\n  .carousel-inner > .active {\n    left: 0; }\n  .carousel-inner > .next,\n  .carousel-inner > .prev {\n    position: absolute;\n    top: 0;\n    width: 100%; }\n  .carousel-inner > .next {\n    left: 100%; }\n  .carousel-inner > .prev {\n    left: -100%; }\n  .carousel-inner > .next.left,\n  .carousel-inner > .prev.right {\n    left: 0; }\n  .carousel-inner > .active.left {\n    left: -100%; }\n  .carousel-inner > .active.right {\n    left: 100%; }\n\n.carousel-control {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 15%;\n  opacity: 0.5;\n  filter: alpha(opacity=50);\n  font-size: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);\n  background-color: transparent; }\n  .carousel-control.left {\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.0001) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#80000000', endColorstr='#00000000', GradientType=1); }\n  .carousel-control.right {\n    left: auto;\n    right: 0;\n    background-image: -webkit-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: -o-linear-gradient(left, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-image: linear-gradient(to right, rgba(0, 0, 0, 0.0001) 0%, rgba(0, 0, 0, 0.5) 100%);\n    background-repeat: repeat-x;\n    filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#00000000', endColorstr='#80000000', GradientType=1); }\n  .carousel-control:hover, .carousel-control:focus {\n    outline: 0;\n    color: #fff;\n    text-decoration: none;\n    opacity: 0.9;\n    filter: alpha(opacity=90); }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right {\n    position: absolute;\n    top: 50%;\n    margin-top: -10px;\n    z-index: 5;\n    display: inline-block; }\n  .carousel-control .icon-prev,\n  .carousel-control .glyphicon-chevron-left {\n    left: 50%;\n    margin-left: -10px; }\n  .carousel-control .icon-next,\n  .carousel-control .glyphicon-chevron-right {\n    right: 50%;\n    margin-right: -10px; }\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 20px;\n    height: 20px;\n    line-height: 1;\n    font-family: serif; }\n  .carousel-control .icon-prev:before {\n    content: '\\2039'; }\n  .carousel-control .icon-next:before {\n    content: '\\203A'; }\n\n.carousel-indicators {\n  position: absolute;\n  bottom: 10px;\n  left: 50%;\n  z-index: 15;\n  width: 60%;\n  margin-left: -30%;\n  padding-left: 0;\n  list-style: none;\n  text-align: center; }\n  .carousel-indicators li {\n    display: inline-block;\n    width: 10px;\n    height: 10px;\n    margin: 1px;\n    text-indent: -999px;\n    border: 1px solid #fff;\n    border-radius: 10px;\n    cursor: pointer;\n    background-color: #000 \\9;\n    background-color: transparent; }\n  .carousel-indicators .active {\n    margin: 0;\n    width: 12px;\n    height: 12px;\n    background-color: #fff; }\n\n.carousel-caption {\n  position: absolute;\n  left: 15%;\n  right: 15%;\n  bottom: 20px;\n  z-index: 10;\n  padding-top: 20px;\n  padding-bottom: 20px;\n  color: #fff;\n  text-align: center;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6); }\n  .carousel-caption .btn {\n    text-shadow: none; }\n\n@media screen and (min-width: 768px) {\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-prev,\n  .carousel-control .icon-next {\n    width: 30px;\n    height: 30px;\n    margin-top: -10px;\n    font-size: 30px; }\n  .carousel-control .glyphicon-chevron-left,\n  .carousel-control .icon-prev {\n    margin-left: -10px; }\n  .carousel-control .glyphicon-chevron-right,\n  .carousel-control .icon-next {\n    margin-right: -10px; }\n  .carousel-caption {\n    left: 20%;\n    right: 20%;\n    padding-bottom: 30px; }\n  .carousel-indicators {\n    bottom: 20px; } }\n\n.clearfix:before, .clearfix:after {\n  content: \" \";\n  display: table; }\n\n.clearfix:after {\n  clear: both; }\n\n.center-block {\n  display: block;\n  margin-left: auto;\n  margin-right: auto; }\n\n.pull-right {\n  float: right !important; }\n\n.pull-left {\n  float: left !important; }\n\n.hide {\n  display: none !important; }\n\n.show {\n  display: block !important; }\n\n.invisible {\n  visibility: hidden; }\n\n.text-hide {\n  font: 0/0 a;\n  color: transparent;\n  text-shadow: none;\n  background-color: transparent;\n  border: 0; }\n\n.hidden {\n  display: none !important; }\n\n.affix {\n  position: fixed; }\n\n@-ms-viewport {\n  width: device-width; }\n\n.visible-xs {\n  display: none !important; }\n\n.visible-sm {\n  display: none !important; }\n\n.visible-md {\n  display: none !important; }\n\n.visible-lg {\n  display: none !important; }\n\n.visible-xs-block,\n.visible-xs-inline,\n.visible-xs-inline-block,\n.visible-sm-block,\n.visible-sm-inline,\n.visible-sm-inline-block,\n.visible-md-block,\n.visible-md-inline,\n.visible-md-inline-block,\n.visible-lg-block,\n.visible-lg-inline,\n.visible-lg-inline-block {\n  display: none !important; }\n\n@media (max-width: 767px) {\n  .visible-xs {\n    display: block !important; }\n  table.visible-xs {\n    display: table !important; }\n  tr.visible-xs {\n    display: table-row !important; }\n  th.visible-xs,\n  td.visible-xs {\n    display: table-cell !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-block {\n    display: block !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline {\n    display: inline !important; } }\n\n@media (max-width: 767px) {\n  .visible-xs-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm {\n    display: block !important; }\n  table.visible-sm {\n    display: table !important; }\n  tr.visible-sm {\n    display: table-row !important; }\n  th.visible-sm,\n  td.visible-sm {\n    display: table-cell !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-block {\n    display: block !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline {\n    display: inline !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .visible-sm-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md {\n    display: block !important; }\n  table.visible-md {\n    display: table !important; }\n  tr.visible-md {\n    display: table-row !important; }\n  th.visible-md,\n  td.visible-md {\n    display: table-cell !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-block {\n    display: block !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline {\n    display: inline !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .visible-md-inline-block {\n    display: inline-block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg {\n    display: block !important; }\n  table.visible-lg {\n    display: table !important; }\n  tr.visible-lg {\n    display: table-row !important; }\n  th.visible-lg,\n  td.visible-lg {\n    display: table-cell !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-block {\n    display: block !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline {\n    display: inline !important; } }\n\n@media (min-width: 1200px) {\n  .visible-lg-inline-block {\n    display: inline-block !important; } }\n\n@media (max-width: 767px) {\n  .hidden-xs {\n    display: none !important; } }\n\n@media (min-width: 768px) and (max-width: 991px) {\n  .hidden-sm {\n    display: none !important; } }\n\n@media (min-width: 992px) and (max-width: 1199px) {\n  .hidden-md {\n    display: none !important; } }\n\n@media (min-width: 1200px) {\n  .hidden-lg {\n    display: none !important; } }\n\n.visible-print {\n  display: none !important; }\n\n@media print {\n  .visible-print {\n    display: block !important; }\n  table.visible-print {\n    display: table !important; }\n  tr.visible-print {\n    display: table-row !important; }\n  th.visible-print,\n  td.visible-print {\n    display: table-cell !important; } }\n\n.visible-print-block {\n  display: none !important; }\n  @media print {\n    .visible-print-block {\n      display: block !important; } }\n\n.visible-print-inline {\n  display: none !important; }\n  @media print {\n    .visible-print-inline {\n      display: inline !important; } }\n\n.visible-print-inline-block {\n  display: none !important; }\n  @media print {\n    .visible-print-inline-block {\n      display: inline-block !important; } }\n\n@media print {\n  .hidden-print {\n    display: none !important; } }\n\nbody {\n  background-color: #e7e7e7;\n  color: #0c0c0c;\n  font-family: 'Exo 2', sans-serif;\n  margin: 30px;\n  padding-bottom: 15px;\n  padding-top: 15px; }\n\ncanvas {\n  margin: 0 auto; }\n\nnav {\n  background-color: #0b6ba7 !important; }\n\nbutton,\nform,\ninput,\nlegend {\n  margin: 6px 0; }\n\n.jumbotron {\n  background-image: url(" + __webpack_require__(42) + ");\n  background-position: left top -280px;\n  background-size: cover;\n  color: #fff; }\n\n.display-3 {\n  margin-top: 60px; }\n\n@media (max-width: 992px) {\n  .jumbotron {\n    background-position: left top -140px; } }\n\n@media (max-width: 768px) {\n  .jumbotron {\n    background-position: left top -140px;\n    background-size: auto; } }\n\n.drawing {\n  margin: 0 auto;\n  padding: 24px; }\n\n.drawing-container {\n  margin: 0 auto;\n  padding: 24px; }\n\n.drawing-canvas {\n  margin: 0 auto; }\n\n.palette-container {\n  color: #fff;\n  font-size: 36px;\n  background-color: #808080;\n  border-radius: 12px;\n  margin: 0 auto;\n  padding: 24px; }\n\n.palette-item {\n  border: 2px solid #fff;\n  border-radius: 12px;\n  box-shadow: -2px 2px 1px 1px #0c0c0c;\n  display: inline-block;\n  height: 48px;\n  margin: 6px;\n  width: 48px; }\n\n.feed-header {\n  background-color: #808080;\n  border-radius: 12px;\n  color: #fff;\n  font-size: 36px;\n  margin: 0 auto;\n  padding: 24px;\n  text-align: center; }\n\n.feed-container {\n  margin: 0 auto;\n  padding: 24px;\n  text-align: center; }\n\n.form-control {\n  padding: 2px 6px; }\n\n.signed-in {\n  color: #fff;\n  font-size: 24px;\n  padding-left: 24px; }\n", ""]);

	// exports


/***/ },
/* 36 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "f4769f9bdb7466be65088239c12046d1.eot";

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "448c34a56d699c29117adc64c43affeb.woff2";

/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "fa2772327f55d8198301fdb8bcfc8158.woff";

/***/ },
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "e18bbf611f2a2e43afc071aa2f4e1512.ttf";

/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "89889688147bd7575d6327160d64e760.svg";

/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__.p + "15ebb8427b162aecea89795b92c74e21.png";

/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];

	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}

		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();

		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

		var styles = listToStyles(list);
		addStylesToDom(styles, options);

		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}

	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}

	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}

	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}

	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}

	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}

	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}

	function addStyle(obj, options) {
		var styleElement, update, remove;

		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}

		update(obj);

		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}

	var replaceText = (function () {
		var textStore = [];

		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();

	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;

		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}

	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;

		if(media) {
			styleElement.setAttribute("media", media)
		}

		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}

	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;

		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}

		var blob = new Blob([css], { type: "text/css" });

		var oldSrc = linkElement.href;

		linkElement.href = URL.createObjectURL(blob);

		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["$"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["jQuery"] = __webpack_require__(2);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["getFormFields"] = __webpack_require__(7);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = global["paper"] = __webpack_require__(3);
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }
]);
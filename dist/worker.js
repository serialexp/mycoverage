;(() => {
  "use strict"
  var e,
    t,
    n = {
      606: function (e, t, n) {
        var o =
            (this && this.__assign) ||
            function () {
              return (o =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, o = arguments.length; n < o; n++)
                    for (var r in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                  return e
                }).apply(this, arguments)
            },
          r =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (r, a) {
                function i(e) {
                  try {
                    s(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  try {
                    s(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, c)
                }
                s((o = o.apply(e, t || [])).next())
              })
            },
          a =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                o,
                r,
                a,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (a = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function c(a) {
                return function (c) {
                  return (function (a) {
                    if (n) throw new TypeError("Generator is already executing.")
                    for (; i; )
                      try {
                        if (
                          ((n = 1),
                          o &&
                            (r =
                              2 & a[0]
                                ? o.return
                                : a[0]
                                ? o.throw || ((r = o.return) && r.call(o), 0)
                                : o.next) &&
                            !(r = r.call(o, a[1])).done)
                        )
                          return r
                        switch (((o = 0), r && (a = [2 & a[0], r.value]), a[0])) {
                          case 0:
                          case 1:
                            r = a
                            break
                          case 4:
                            return i.label++, { value: a[1], done: !1 }
                          case 5:
                            i.label++, (o = a[1]), (a = [0])
                            continue
                          case 7:
                            ;(a = i.ops.pop()), i.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = i.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0])
                              )
                            ) {
                              i = 0
                              continue
                            }
                            if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                              i.label = a[1]
                              break
                            }
                            if (6 === a[0] && i.label < r[1]) {
                              ;(i.label = r[1]), (r = a)
                              break
                            }
                            if (r && i.label < r[2]) {
                              ;(i.label = r[2]), i.ops.push(a)
                              break
                            }
                            r[2] && i.ops.pop(), i.trys.pop()
                            continue
                        }
                        a = t.call(e, i)
                      } catch (e) {
                        ;(a = [6, e]), (o = 0)
                      } finally {
                        n = r = 0
                      }
                    if (5 & a[0]) throw a[1]
                    return { value: a[0] ? a[1] : void 0, done: !0 }
                  })([a, c])
                }
              }
            },
          i =
            (this && this.__spreadArray) ||
            function (e, t) {
              for (var n = 0, o = t.length, r = e.length; n < o; n++, r++) e[r] = t[n]
              return e
            },
          c =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoberturaCoverage = void 0)
        var s = n(456),
          l = n(589),
          u = c(n(320)),
          d = u.default.object({
            statements: u.default.number(),
            coveredstatements: u.default.number(),
            conditionals: u.default.number(),
            coveredconditionals: u.default.number(),
            methods: u.default.number(),
            coveredmethods: u.default.number(),
            elements: u.default.number(),
            coveredelements: u.default.number(),
          }),
          v = u.default.object({
            coverage: u.default.object({
              "lines-valid": u.default.number(),
              "lines-covered": u.default.number(),
              "line-rate": u.default.number(),
              "branches-valid": u.default.number(),
              "branches-covered": u.default.number(),
              "branch-rate": u.default.number(),
              timestamp: u.default.number(),
              complexity: u.default.number(),
              version: u.default.string(),
              sources: u.default.object({ source: u.default.string() }),
              metrics: d,
              packages: u.default
                .array()
                .items(
                  u.default.object({
                    name: u.default.string(),
                    "line-rate": u.default.number(),
                    "branch-rate": u.default.number(),
                    metrics: d,
                    files: u.default
                      .array()
                      .items(
                        u.default.object({
                          name: u.default.string(),
                          filename: u.default.string(),
                          "line-rate": u.default.number(),
                          "branch-rate": u.default.number(),
                          metrics: d,
                          lines: u.default
                            .array()
                            .items(
                              u.default.object({
                                branch: u.default.boolean(),
                                number: u.default.number(),
                                hits: u.default.number(),
                                coveredConditions: u.default.number(),
                                conditions: u.default.number(),
                                "condition-coverage": u.default.string(),
                              })
                            ),
                          functions: u.default
                            .array()
                            .items(
                              u.default.object({
                                name: u.default.string(),
                                number: u.default.number(),
                                hits: u.default.number(),
                                signature: u.default.string(),
                              })
                            ),
                        })
                      ),
                  })
                )
                .min(1)
                .required(),
            }),
          }),
          f = (function () {
            function e() {
              this.data = { coverage: { version: "0.1", packages: [] } }
            }
            return (
              (e.prototype.init = function (e) {
                return r(this, void 0, void 0, function () {
                  var t = this
                  return a(this, function (n) {
                    return [
                      2,
                      new Promise(function (n, r) {
                        l.parseString(e, function (e, a) {
                          var i
                          e && r(e)
                          var c = {
                              coverage: o(o({}, a.coverage.$), {
                                sources: { source: a.coverage.sources[0].source[0] },
                                packages:
                                  null === (i = a.coverage.packages[0].package) || void 0 === i
                                    ? void 0
                                    : i.map(function (e) {
                                        var t
                                        return o(o({}, e.$), {
                                          files:
                                            null === (t = e.classes[0].class) || void 0 === t
                                              ? void 0
                                              : t.map(function (e) {
                                                  var t, n, r, a
                                                  return o(o({}, e.$), {
                                                    lines:
                                                      null ===
                                                        (n =
                                                          null === (t = e.lines[0]) || void 0 === t
                                                            ? void 0
                                                            : t.line) || void 0 === n
                                                        ? void 0
                                                        : n.map(function (e) {
                                                            var t = e.$
                                                            if (t["condition-coverage"]) {
                                                              var n = /\(([0-9]+\/[0-9]+)\)/.exec(
                                                                t["condition-coverage"]
                                                              )
                                                              if (n && n[1]) {
                                                                var r = n[1].split("/")
                                                                ;(t.conditions = r[1]),
                                                                  (t.coveredConditions = r[0])
                                                              }
                                                            }
                                                            return o({}, t)
                                                          }),
                                                    functions:
                                                      null ===
                                                        (a =
                                                          null === (r = e.methods[0]) ||
                                                          void 0 === r
                                                            ? void 0
                                                            : r.method) || void 0 === a
                                                        ? void 0
                                                        : a.map(function (e) {
                                                            return o(
                                                              o({}, e.$),
                                                              e.lines[0].line[0].$
                                                            )
                                                          }),
                                                  })
                                                }),
                                        })
                                      }),
                              }),
                            },
                            s = v.validate(c),
                            l = s.error,
                            u = s.value
                          if (l) throw l
                          t.updateMetrics(u), (t.data = u), n()
                        })
                      }),
                    ]
                  })
                })
              }),
              (e.prototype.updateMetrics = function (e) {
                var t = (e.coverage.metrics = {
                    elements: 0,
                    coveredelements: 0,
                    methods: 0,
                    hits: 0,
                    coveredmethods: 0,
                    conditionals: 0,
                    coveredconditionals: 0,
                    statements: 0,
                    coveredstatements: 0,
                  }),
                  n = {}
                return (
                  e.coverage.packages.forEach(function (e) {
                    n[e.name] = e.metrics = {
                      elements: 0,
                      coveredelements: 0,
                      methods: 0,
                      hits: 0,
                      coveredmethods: 0,
                      conditionals: 0,
                      coveredconditionals: 0,
                      statements: 0,
                      coveredstatements: 0,
                    }
                  }),
                  e.coverage.packages.forEach(function (t) {
                    for (var o = t.name.split("."), r = 1; r < o.length; r++) {
                      var a = o.slice(0, r).join(".")
                      n[a] ||
                        ((n[a] = {
                          elements: 0,
                          coveredelements: 0,
                          methods: 0,
                          hits: 0,
                          coveredmethods: 0,
                          conditionals: 0,
                          coveredconditionals: 0,
                          statements: 0,
                          coveredstatements: 0,
                        }),
                        e.coverage.packages.push({
                          name: a,
                          "line-rate": "0",
                          "branch-rate": "0",
                          files: [],
                          metrics: n[a],
                        }))
                    }
                  }),
                  e.coverage.packages.forEach(function (e) {
                    for (var o = [], r = e.name.split("."), a = 1; a < r.length; a++) {
                      var c = r.slice(0, a).join("."),
                        s = n[c]
                      s && o.push(s)
                    }
                    var l = n[e.name]
                    l && o.push(l),
                      e.files.forEach(function (e) {
                        var n,
                          r,
                          a = (e.metrics = {
                            elements: 0,
                            coveredelements: 0,
                            methods: 0,
                            hits: 0,
                            coveredmethods: 0,
                            conditionals: 0,
                            coveredconditionals: 0,
                            statements: 0,
                            coveredstatements: 0,
                          })
                        null === (n = e.lines) ||
                          void 0 === n ||
                          n.forEach(function (e) {
                            i(i([t], o), [a]).forEach(function (t) {
                              if (e.branch) {
                                if (void 0 === e.coveredConditions || isNaN(e.coveredConditions))
                                  throw (console.log(e), Error("Invalid line"))
                                ;(t.elements += e.conditions),
                                  (t.coveredelements += e.coveredConditions),
                                  (t.conditionals += e.conditions),
                                  (t.coveredconditionals += e.coveredConditions),
                                  (t.hits += e.hits)
                              } else t.elements++, t.statements++, (t.hits += e.hits), e.hits > 0 && (t.coveredstatements++, t.coveredelements++)
                            })
                          }),
                          null === (r = e.functions) ||
                            void 0 === r ||
                            r.forEach(function (e) {
                              i(i([t], o), [a]).forEach(function (t) {
                                t.elements++,
                                  t.methods++,
                                  (t.hits += e.hits),
                                  e.hits > 0 && (t.coveredelements++, t.coveredmethods++)
                              })
                            })
                      })
                  }),
                  e
                )
              }),
              (e.prototype.mergeCoverage = function (e, t, n, o) {
                var r = this.data.coverage.packages.find(function (t) {
                  return t.name === e
                })
                r || ((r = { name: e, files: [] }), this.data.coverage.packages.push(r))
                var a = r.files.find(function (e) {
                  return e.name === t
                })
                a || ((a = { name: t, lines: [], functions: [] }), r.files.push(a))
                var i = a.coverageData ? a.coverageData : s.CoverageData.fromCoberturaFile(a),
                  c = s.CoverageData.fromString(n, o)
                i.merge(c)
                var l = i.toCoberturaFile(),
                  u = l.functions,
                  d = l.lines
                ;(a.lines = d), (a.functions = u), (a.coverageData = i)
              }),
              e
            )
          })()
        t.CoberturaCoverage = f
      },
      456: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoverageData = void 0)
        var n = (function () {
          function e() {
            ;(this.typeToStringMap = { branch: "cond", statement: "stmt", function: "func" }),
              (this.coverage = {})
          }
          return (
            (e.prototype.addCoverage = function (e, t) {
              this.coverage[e] || (this.coverage[e] = [])
              var n = this.coverage[e]
              n && n.push(t)
            }),
            (e.fromCoberturaFile = function (t, n) {
              var o,
                r,
                a = new e()
              return (
                null === (o = t.lines) ||
                  void 0 === o ||
                  o.forEach(function (e) {
                    var t, o
                    e.branch
                      ? a.addCoverage(e.number.toString(), {
                          type: "branch",
                          line: e.number,
                          hits: e.hits,
                          conditionals: e.conditions,
                          coveredConditionals: e.coveredConditions,
                          hitsBySource: n ? ((t = {}), (t[n] = e.hits), t) : {},
                        })
                      : a.addCoverage(e.number.toString(), {
                          type: "statement",
                          line: e.number,
                          hits: e.hits,
                          hitsBySource: n ? ((o = {}), (o[n] = e.hits), o) : {},
                        })
                  }),
                null === (r = t.functions) ||
                  void 0 === r ||
                  r.forEach(function (e) {
                    var t
                    a.addCoverage(e.number.toString(), {
                      type: "function",
                      line: e.number,
                      hits: e.hits,
                      signature: e.signature,
                      name: e.name,
                      hitsBySource: n ? ((t = {}), (t[n] = e.hits), t) : {},
                    })
                  }),
                a
              )
            }),
            (e.fromString = function (t, n) {
              var o = new e(),
                r = function (e) {
                  return null == e
                    ? void 0
                    : e
                        .split(";")
                        .map(function (e) {
                          return e.split("=")
                        })
                        .reduce(function (e, t, n) {
                          return (e[t[0] || ""] = t[1]), e
                        }, {})
                }
              return (
                t.split("\n").forEach(function (e) {
                  var t,
                    a,
                    i,
                    c = e.split(",")
                  switch (c[0]) {
                    case "stmt":
                      var s = r(c[3]),
                        l = parseInt(c[2] || "")
                      o.addCoverage(c[1] || "", {
                        type: "statement",
                        line: parseInt(c[1] || ""),
                        hits: l,
                        hitsBySource: s || (n ? ((t = {}), (t[n] = l), t) : {}),
                      })
                      break
                    case "cond":
                      ;(s = r(c[5])),
                        (l = parseInt(c[2] || "")),
                        o.addCoverage(c[1] || "", {
                          type: "branch",
                          line: parseInt(c[1] || ""),
                          hits: parseInt(c[2] || ""),
                          coveredConditionals: parseInt(c[3] || ""),
                          conditionals: parseInt(c[4] || ""),
                          hitsBySource: s || (n ? ((a = {}), (a[n] = l), a) : {}),
                        })
                      break
                    case "func":
                      ;(s = r(c[5])),
                        (l = parseInt(c[2] || "")),
                        o.addCoverage(c[1] || "", {
                          type: "function",
                          line: parseInt(c[1] || ""),
                          hits: parseInt(c[2] || ""),
                          signature: c[3] || "",
                          name: c[4] || "",
                          hitsBySource: s || (n ? ((i = {}), (i[n] = l), i) : {}),
                        })
                  }
                }),
                o
              )
            }),
            (e.prototype.toCoberturaFile = function () {
              var e,
                t = this,
                n = [],
                o = []
              return (
                null === (e = Object.keys(this.coverage)) ||
                  void 0 === e ||
                  e.forEach(function (e) {
                    var r
                    null === (r = t.coverage[e]) ||
                      void 0 === r ||
                      r.forEach(function (e) {
                        t.typeToStringMap[e.type],
                          "statement" === e.type
                            ? n.push({ branch: !1, number: e.line, hits: e.hits })
                            : "branch" === e.type
                            ? n.push({
                                branch: !0,
                                number: e.line,
                                hits: e.hits,
                                conditions: e.conditionals,
                                coveredConditions: e.coveredConditionals,
                              })
                            : "function" === e.type &&
                              o.push({
                                name: e.name,
                                number: e.line,
                                hits: e.hits,
                                signature: e.signature,
                              })
                      })
                  }),
                { lines: n, functions: o }
              )
            }),
            (e.prototype.toString = function () {
              var e,
                t = this,
                n = []
              return (
                null === (e = Object.keys(this.coverage)) ||
                  void 0 === e ||
                  e.forEach(function (e) {
                    var o
                    null === (o = t.coverage[e]) ||
                      void 0 === o ||
                      o.forEach(function (e) {
                        var o = t.typeToStringMap[e.type],
                          r = Object.keys(e.hitsBySource)
                            .map(function (t) {
                              return t + "=" + e.hitsBySource[t]
                            })
                            .join(";")
                        "statement" === e.type
                          ? n.push(o + "," + e.line + "," + e.hits + "," + r)
                          : "branch" === e.type
                          ? n.push(
                              o +
                                "," +
                                e.line +
                                "," +
                                e.hits +
                                "," +
                                e.coveredConditionals +
                                "," +
                                e.conditionals +
                                "," +
                                r
                            )
                          : "function" === e.type &&
                            n.push(
                              o +
                                "," +
                                e.line +
                                "," +
                                e.hits +
                                "," +
                                e.signature +
                                "," +
                                e.name +
                                "," +
                                r
                            )
                      })
                  }),
                n.join("\n")
              )
            }),
            (e.prototype.merge = function (e) {
              var t = this
              Object.keys(e.coverage).forEach(function (n) {
                var o = t.coverage[n],
                  r = e.coverage[n]
                r && o
                  ? null == r ||
                    r.forEach(function (e) {
                      var r = o.find(function (t) {
                        return t.type === e.type
                      })
                      r
                        ? (Object.keys(e.hitsBySource).forEach(function (t) {
                            var n = e.hitsBySource[t]
                            n && (r.hitsBySource[t] = n)
                          }),
                          (r.hits = r.hits + e.hits),
                          "branch" === r.type &&
                            "branch" === e.type &&
                            (r.coveredConditionals = Math.max(
                              r.coveredConditionals,
                              e.coveredConditionals
                            )))
                        : t.addCoverage(n, e)
                    })
                  : null == r ||
                    r.forEach(function (e) {
                      t.addCoverage(n, e)
                    })
              })
            }),
            e
          )
        })()
        t.CoverageData = n
      },
      93: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.coveredPercentage = void 0),
          (t.coveredPercentage = function (e) {
            if (!e) return 0
            var t =
              ((e.coveredstatements + e.coveredconditionals + e.coveredmethods) /
                (e.statements + e.conditionals + e.methods)) *
              100
            return isNaN(t) ? 0 : null != t ? t : 0
          })
      },
      115: function (e, t, n) {
        var o =
            (this && this.__assign) ||
            function () {
              return (o =
                Object.assign ||
                function (e) {
                  for (var t, n = 1, o = arguments.length; n < o; n++)
                    for (var r in (t = arguments[n]))
                      Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                  return e
                }).apply(this, arguments)
            },
          r =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (r, a) {
                function i(e) {
                  try {
                    s(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  try {
                    s(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, c)
                }
                s((o = o.apply(e, t || [])).next())
              })
            },
          a =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                o,
                r,
                a,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (a = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function c(a) {
                return function (c) {
                  return (function (a) {
                    if (n) throw new TypeError("Generator is already executing.")
                    for (; i; )
                      try {
                        if (
                          ((n = 1),
                          o &&
                            (r =
                              2 & a[0]
                                ? o.return
                                : a[0]
                                ? o.throw || ((r = o.return) && r.call(o), 0)
                                : o.next) &&
                            !(r = r.call(o, a[1])).done)
                        )
                          return r
                        switch (((o = 0), r && (a = [2 & a[0], r.value]), a[0])) {
                          case 0:
                          case 1:
                            r = a
                            break
                          case 4:
                            return i.label++, { value: a[1], done: !1 }
                          case 5:
                            i.label++, (o = a[1]), (a = [0])
                            continue
                          case 7:
                            ;(a = i.ops.pop()), i.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = i.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0])
                              )
                            ) {
                              i = 0
                              continue
                            }
                            if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                              i.label = a[1]
                              break
                            }
                            if (6 === a[0] && i.label < r[1]) {
                              ;(i.label = r[1]), (r = a)
                              break
                            }
                            if (r && i.label < r[2]) {
                              ;(i.label = r[2]), i.ops.push(a)
                              break
                            }
                            r[2] && i.ops.pop(), i.trys.pop()
                            continue
                        }
                        a = t.call(e, i)
                      } catch (e) {
                        ;(a = [6, e]), (o = 0)
                      } finally {
                        n = r = 0
                      }
                    if (5 & a[0]) throw a[1]
                    return { value: a[0] ? a[1] : void 0, done: !0 }
                  })([a, c])
                }
              }
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.insertCoverageData = void 0)
        var c = n(456),
          s = n(93),
          l = i(n(673))
        t.insertCoverageData = function (e, t, n) {
          return r(void 0, void 0, void 0, function () {
            var i, u, d, v, f
            return a(this, function (m) {
              switch (m.label) {
                case 0:
                  return (
                    (i = l.default),
                    (u = []),
                    (d = []),
                    e.packages.forEach(function (e) {
                      return r(void 0, void 0, void 0, function () {
                        var t, r, i, c, l, d, v, f, m, g, h, p, b, y, C, w, _, k
                        return a(this, function (a) {
                          return (
                            (t = e.name.length - e.name.replace(/\./g, "").length),
                            (r = o(o({}, n), {
                              name: e.name,
                              statements:
                                null !==
                                  (c =
                                    null === (i = e.metrics) || void 0 === i
                                      ? void 0
                                      : i.statements) && void 0 !== c
                                  ? c
                                  : 0,
                              conditionals:
                                null !==
                                  (d =
                                    null === (l = e.metrics) || void 0 === l
                                      ? void 0
                                      : l.conditionals) && void 0 !== d
                                  ? d
                                  : 0,
                              methods:
                                null !==
                                  (f =
                                    null === (v = e.metrics) || void 0 === v
                                      ? void 0
                                      : v.methods) && void 0 !== f
                                  ? f
                                  : 0,
                              elements:
                                null !==
                                  (g =
                                    null === (m = e.metrics) || void 0 === m
                                      ? void 0
                                      : m.elements) && void 0 !== g
                                  ? g
                                  : 0,
                              coveredStatements:
                                null !==
                                  (p =
                                    null === (h = e.metrics) || void 0 === h
                                      ? void 0
                                      : h.coveredstatements) && void 0 !== p
                                  ? p
                                  : 0,
                              coveredConditionals:
                                null !==
                                  (y =
                                    null === (b = e.metrics) || void 0 === b
                                      ? void 0
                                      : b.coveredconditionals) && void 0 !== y
                                  ? y
                                  : 0,
                              coveredMethods:
                                null !==
                                  (w =
                                    null === (C = e.metrics) || void 0 === C
                                      ? void 0
                                      : C.coveredmethods) && void 0 !== w
                                  ? w
                                  : 0,
                              coveredElements:
                                null !==
                                  (k =
                                    null === (_ = e.metrics) || void 0 === _
                                      ? void 0
                                      : _.coveredelements) && void 0 !== k
                                  ? k
                                  : 0,
                              coveredPercentage: s.coveredPercentage(e.metrics),
                              depth: t,
                            })),
                            u.push(r),
                            [2]
                          )
                        })
                      })
                    }),
                    console.log("Creating all packages"),
                    [4, i.packageCoverage.createMany({ data: u })]
                  )
                case 1:
                  return (
                    m.sent(),
                    console.log("Retrieving created package ids"),
                    [
                      4,
                      i.packageCoverage.findMany({ select: { id: !0, name: !0 }, where: o({}, n) }),
                    ]
                  )
                case 2:
                  return (
                    (v = m.sent()),
                    (f = {}),
                    v.forEach(function (e) {
                      f[e.name] = e.id
                    }),
                    console.log("Creating file coverage data"),
                    e.packages.forEach(function (e) {
                      return r(void 0, void 0, void 0, function () {
                        return a(this, function (n) {
                          return (
                            e.files.forEach(function (n) {
                              var o,
                                r,
                                a,
                                i,
                                l,
                                u,
                                v,
                                m,
                                g,
                                h,
                                p,
                                b,
                                y,
                                C,
                                w,
                                _,
                                k = c.CoverageData.fromCoberturaFile(n, t)
                              d.push({
                                name: n.name,
                                packageCoverageId: f[e.name],
                                statements:
                                  null !==
                                    (r =
                                      null === (o = n.metrics) || void 0 === o
                                        ? void 0
                                        : o.statements) && void 0 !== r
                                    ? r
                                    : 0,
                                conditionals:
                                  null !==
                                    (i =
                                      null === (a = n.metrics) || void 0 === a
                                        ? void 0
                                        : a.conditionals) && void 0 !== i
                                    ? i
                                    : 0,
                                methods:
                                  null !==
                                    (u =
                                      null === (l = n.metrics) || void 0 === l
                                        ? void 0
                                        : l.methods) && void 0 !== u
                                    ? u
                                    : 0,
                                coveredStatements:
                                  null !==
                                    (m =
                                      null === (v = n.metrics) || void 0 === v
                                        ? void 0
                                        : v.coveredstatements) && void 0 !== m
                                    ? m
                                    : 0,
                                coveredConditionals:
                                  null !==
                                    (h =
                                      null === (g = n.metrics) || void 0 === g
                                        ? void 0
                                        : g.coveredconditionals) && void 0 !== h
                                    ? h
                                    : 0,
                                coveredMethods:
                                  null !==
                                    (b =
                                      null === (p = n.metrics) || void 0 === p
                                        ? void 0
                                        : p.coveredmethods) && void 0 !== b
                                    ? b
                                    : 0,
                                coverageData: k.toString(),
                                coveredElements:
                                  null !==
                                    (C =
                                      null === (y = n.metrics) || void 0 === y
                                        ? void 0
                                        : y.coveredelements) && void 0 !== C
                                    ? C
                                    : 0,
                                elements:
                                  null !==
                                    (_ =
                                      null === (w = n.metrics) || void 0 === w
                                        ? void 0
                                        : w.elements) && void 0 !== _
                                    ? _
                                    : 0,
                                coveredPercentage: s.coveredPercentage(n.metrics),
                              })
                            }),
                            [2]
                          )
                        })
                      })
                    }),
                    console.log("Inserting file coverage data"),
                    [4, i.fileCoverage.createMany({ data: d })]
                  )
                case 3:
                  return m.sent(), [2]
              }
            })
          })
        }
      },
      801: function (e, t, n) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (r, a) {
                function i(e) {
                  try {
                    s(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  try {
                    s(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, c)
                }
                s((o = o.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                o,
                r,
                a,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (a = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function c(a) {
                return function (c) {
                  return (function (a) {
                    if (n) throw new TypeError("Generator is already executing.")
                    for (; i; )
                      try {
                        if (
                          ((n = 1),
                          o &&
                            (r =
                              2 & a[0]
                                ? o.return
                                : a[0]
                                ? o.throw || ((r = o.return) && r.call(o), 0)
                                : o.next) &&
                            !(r = r.call(o, a[1])).done)
                        )
                          return r
                        switch (((o = 0), r && (a = [2 & a[0], r.value]), a[0])) {
                          case 0:
                          case 1:
                            r = a
                            break
                          case 4:
                            return i.label++, { value: a[1], done: !1 }
                          case 5:
                            i.label++, (o = a[1]), (a = [0])
                            continue
                          case 7:
                            ;(a = i.ops.pop()), i.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = i.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0])
                              )
                            ) {
                              i = 0
                              continue
                            }
                            if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                              i.label = a[1]
                              break
                            }
                            if (6 === a[0] && i.label < r[1]) {
                              ;(i.label = r[1]), (r = a)
                              break
                            }
                            if (r && i.label < r[2]) {
                              ;(i.label = r[2]), i.ops.push(a)
                              break
                            }
                            r[2] && i.ops.pop(), i.trys.pop()
                            continue
                        }
                        a = t.call(e, i)
                      } catch (e) {
                        ;(a = [6, e]), (o = 0)
                      } finally {
                        n = r = 0
                      }
                    if (5 & a[0]) throw a[1]
                    return { value: a[0] ? a[1] : void 0, done: !0 }
                  })([a, c])
                }
              }
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.combineCoverageWorker = void 0)
        var i = n(606),
          c = n(93),
          s = n(115),
          l = n(4),
          u = n(686),
          d = a(n(673))
        ;(t.combineCoverageWorker = new u.Worker(
          "combinecoverage",
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t,
                n,
                a,
                l,
                u,
                v,
                f,
                m,
                g,
                h,
                p,
                b,
                y,
                C,
                w,
                _,
                k,
                E,
                S,
                j,
                x,
                I,
                P,
                M,
                D,
                O,
                B,
                F,
                q,
                T,
                N,
                W,
                z,
                $,
                R,
                G,
                L,
                Q,
                A,
                J,
                U,
                H,
                K,
                V,
                X,
                Y,
                Z,
                ee,
                te,
                ne,
                oe,
                re,
                ae,
                ie,
                ce,
                se,
                le
              return r(this, function (ue) {
                switch (ue.label) {
                  case 0:
                    ;(t = e.data),
                      (n = t.commit),
                      (a = t.testInstance),
                      (l = t.namespaceSlug),
                      (u = t.repositorySlug),
                      (ue.label = 1)
                  case 1:
                    return (
                      ue.trys.push([1, 14, , 16]),
                      console.log("Executing combine coverage job"),
                      (v = d.default),
                      (f = null),
                      a
                        ? [
                            4,
                            v.test.findFirst({
                              where: { id: null !== (k = a.testId) && void 0 !== k ? k : void 0 },
                            }),
                          ]
                        : [3, 8]
                    )
                  case 2:
                    if (!(f = ue.sent()))
                      throw new Error("Cannot combine coverage for testInstance without a test")
                    return [
                      4,
                      v.testInstance.aggregate({ _sum: { dataSize: !0 }, where: { testId: f.id } }),
                    ]
                  case 3:
                    if (
                      ((m = ue.sent()),
                      console.log(
                        "Total size of combinable data estimated at: " +
                          (m._sum.dataSize || 0) / 1024 / 1024 +
                          "MB"
                      ),
                      m && m._sum.dataSize && m._sum.dataSize > 104857600)
                    )
                      throw new Error("Data to combine is inordinately big, cancelling.")
                    return [
                      4,
                      v.testInstance.findMany({
                        where: { testId: f.id },
                        orderBy: { createdDate: "desc" },
                        include: {
                          PackageCoverage: {
                            select: {
                              name: !0,
                              FileCoverage: { select: { name: !0, coverageData: !0 } },
                            },
                          },
                        },
                      }),
                    ]
                  case 4:
                    return (
                      (g = ue.sent()),
                      (h = new i.CoberturaCoverage()),
                      console.log("Merging coverage information for all test instances"),
                      (p = 0),
                      (b = new Date()),
                      g.forEach(function (e) {
                        e.PackageCoverage.forEach(function (e) {
                          return o(void 0, void 0, void 0, function () {
                            var t
                            return r(this, function (n) {
                              return (
                                null === (t = e.FileCoverage) ||
                                  void 0 === t ||
                                  t.forEach(function (t) {
                                    p++,
                                      h.mergeCoverage(
                                        e.name,
                                        t.name,
                                        t.coverageData,
                                        null == f ? void 0 : f.testName
                                      )
                                  }),
                                [2]
                              )
                            })
                          })
                        })
                      }),
                      h.updateMetrics(h.data),
                      console.log(
                        "Combined coverage results for " +
                          p +
                          " files in " +
                          (new Date().getTime() - b.getTime()) +
                          "ms"
                      ),
                      console.log(
                        "Test instance combination with previous test instances result: " +
                          (null === (E = h.data.coverage.metrics) || void 0 === E
                            ? void 0
                            : E.coveredelements) +
                          "/" +
                          (null === (S = h.data.coverage.metrics) || void 0 === S
                            ? void 0
                            : S.elements) +
                          " covered based on " +
                          g.length +
                          " instances"
                      ),
                      console.log("Deleting existing results for test"),
                      [4, v.packageCoverage.deleteMany({ where: { testId: f.id } })]
                    )
                  case 5:
                    return (
                      ue.sent(),
                      console.log("Updating coverage summary data for test"),
                      [
                        4,
                        v.test.update({
                          where: { id: f.id },
                          data: {
                            statements:
                              null !==
                                (x =
                                  null === (j = h.data.coverage.metrics) || void 0 === j
                                    ? void 0
                                    : j.statements) && void 0 !== x
                                ? x
                                : 0,
                            conditionals:
                              null !==
                                (P =
                                  null === (I = h.data.coverage.metrics) || void 0 === I
                                    ? void 0
                                    : I.conditionals) && void 0 !== P
                                ? P
                                : 0,
                            methods:
                              null !==
                                (D =
                                  null === (M = h.data.coverage.metrics) || void 0 === M
                                    ? void 0
                                    : M.methods) && void 0 !== D
                                ? D
                                : 0,
                            elements:
                              null !==
                                (B =
                                  null === (O = h.data.coverage.metrics) || void 0 === O
                                    ? void 0
                                    : O.elements) && void 0 !== B
                                ? B
                                : 0,
                            hits:
                              null !==
                                (q =
                                  null === (F = h.data.coverage.metrics) || void 0 === F
                                    ? void 0
                                    : F.hits) && void 0 !== q
                                ? q
                                : 0,
                            coveredStatements:
                              null !==
                                (N =
                                  null === (T = h.data.coverage.metrics) || void 0 === T
                                    ? void 0
                                    : T.coveredstatements) && void 0 !== N
                                ? N
                                : 0,
                            coveredConditionals:
                              null !==
                                (z =
                                  null === (W = h.data.coverage.metrics) || void 0 === W
                                    ? void 0
                                    : W.coveredconditionals) && void 0 !== z
                                ? z
                                : 0,
                            coveredMethods:
                              null !==
                                (R =
                                  null === ($ = h.data.coverage.metrics) || void 0 === $
                                    ? void 0
                                    : $.coveredmethods) && void 0 !== R
                                ? R
                                : 0,
                            coveredElements:
                              null !==
                                (L =
                                  null === (G = h.data.coverage.metrics) || void 0 === G
                                    ? void 0
                                    : G.coveredelements) && void 0 !== L
                                ? L
                                : 0,
                            coveredPercentage: c.coveredPercentage(h.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 6:
                    return (
                      ue.sent(),
                      console.log("Inserting new package and file coverage for test"),
                      [4, s.insertCoverageData(h.data.coverage, void 0, { testId: f.id })]
                    )
                  case 7:
                    ue.sent(), (ue.label = 8)
                  case 8:
                    if (!n) throw Error("Cannot combine coverage without a commit")
                    return (
                      console.log("Combining test coverage results for commit"),
                      [
                        4,
                        v.test.findMany({
                          where: { commitId: n.id },
                          orderBy: { createdDate: "desc" },
                          include: { PackageCoverage: { include: { FileCoverage: !0 } } },
                        }),
                      ]
                    )
                  case 9:
                    return (
                      (y = ue.sent()),
                      (C = {}),
                      y.forEach(function (e) {
                        C[e.testName] = e
                      }),
                      console.log("Found " + Object.keys(C).length + " tests to combine."),
                      (w = new i.CoberturaCoverage()),
                      Object.values(C).forEach(function (e) {
                        return o(void 0, void 0, void 0, function () {
                          return r(this, function (t) {
                            return (
                              console.log(
                                "Combining: " +
                                  e.testName +
                                  " with " +
                                  e.coveredElements +
                                  "/" +
                                  e.elements +
                                  " covered",
                                e.PackageCoverage.length + " packages"
                              ),
                              e.PackageCoverage.forEach(function (t) {
                                return o(void 0, void 0, void 0, function () {
                                  var n
                                  return r(this, function (o) {
                                    return (
                                      null === (n = t.FileCoverage) ||
                                        void 0 === n ||
                                        n.forEach(function (n) {
                                          w.mergeCoverage(
                                            t.name,
                                            n.name,
                                            n.coverageData,
                                            e.testName
                                          )
                                        }),
                                      [2]
                                    )
                                  })
                                })
                              }),
                              [2]
                            )
                          })
                        })
                      }),
                      w.updateMetrics(w.data),
                      console.log(
                        "All test combination result " +
                          (null === (Q = w.data.coverage.metrics) || void 0 === Q
                            ? void 0
                            : Q.coveredelements) +
                          "/" +
                          (null === (A = w.data.coverage.metrics) || void 0 === A
                            ? void 0
                            : A.elements) +
                          " covered"
                      ),
                      console.log("Deleting existing results for commit"),
                      [4, v.packageCoverage.deleteMany({ where: { commitId: n.id } })]
                    )
                  case 10:
                    return (
                      ue.sent(),
                      console.log("Updating coverage summary data for commit", n.id),
                      [
                        4,
                        v.commit.update({
                          where: { id: n.id },
                          data: {
                            statements:
                              null !==
                                (U =
                                  null === (J = w.data.coverage.metrics) || void 0 === J
                                    ? void 0
                                    : J.statements) && void 0 !== U
                                ? U
                                : 0,
                            conditionals:
                              null !==
                                (K =
                                  null === (H = w.data.coverage.metrics) || void 0 === H
                                    ? void 0
                                    : H.conditionals) && void 0 !== K
                                ? K
                                : 0,
                            methods:
                              null !==
                                (X =
                                  null === (V = w.data.coverage.metrics) || void 0 === V
                                    ? void 0
                                    : V.methods) && void 0 !== X
                                ? X
                                : 0,
                            elements:
                              null !==
                                (Z =
                                  null === (Y = w.data.coverage.metrics) || void 0 === Y
                                    ? void 0
                                    : Y.elements) && void 0 !== Z
                                ? Z
                                : 0,
                            hits:
                              null !==
                                (te =
                                  null === (ee = w.data.coverage.metrics) || void 0 === ee
                                    ? void 0
                                    : ee.hits) && void 0 !== te
                                ? te
                                : 0,
                            coveredStatements:
                              null !==
                                (oe =
                                  null === (ne = w.data.coverage.metrics) || void 0 === ne
                                    ? void 0
                                    : ne.coveredstatements) && void 0 !== oe
                                ? oe
                                : 0,
                            coveredConditionals:
                              null !==
                                (ae =
                                  null === (re = w.data.coverage.metrics) || void 0 === re
                                    ? void 0
                                    : re.coveredconditionals) && void 0 !== ae
                                ? ae
                                : 0,
                            coveredMethods:
                              null !==
                                (ce =
                                  null === (ie = w.data.coverage.metrics) || void 0 === ie
                                    ? void 0
                                    : ie.coveredmethods) && void 0 !== ce
                                ? ce
                                : 0,
                            coveredElements:
                              null !==
                                (le =
                                  null === (se = w.data.coverage.metrics) || void 0 === se
                                    ? void 0
                                    : se.coveredelements) && void 0 !== le
                                ? le
                                : 0,
                            coveredPercentage: c.coveredPercentage(w.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 11:
                    return (
                      ue.sent(),
                      console.log("Inserting new package and file coverage for commit"),
                      [4, s.insertCoverageData(w.data.coverage, void 0, { commitId: n.id })]
                    )
                  case 12:
                    return (
                      ue.sent(),
                      [
                        4,
                        v.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            namespace: l,
                            repository: u,
                            message:
                              "Combined coverage for commit " +
                              n.ref.substr(0, 10) +
                              (a
                                ? " and test instance " +
                                  a.id +
                                  " for test " +
                                  (null == f ? void 0 : f.testName)
                                : ""),
                          },
                        }),
                      ]
                    )
                  case 13:
                    return ue.sent(), [2, !0]
                  case 14:
                    return (
                      (_ = ue.sent()),
                      [
                        4,
                        d.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            namespace: l,
                            repository: u,
                            message:
                              "Failure processing test instance " +
                              (null == a ? void 0 : a.id) +
                              ", error " +
                              _.message,
                          },
                        }),
                      ]
                    )
                  case 15:
                    return ue.sent(), [2, !1]
                  case 16:
                    return [2]
                }
              })
            })
          },
          { connection: l.queueConfig }
        )),
          t.combineCoverageWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.combineCoverageWorker.on("failed", function (e, t) {
            console.log(e.id + " has failed with " + t.message)
          })
      },
      914: function (e, t, n) {
        var o =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (r, a) {
                function i(e) {
                  try {
                    s(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  try {
                    s(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, c)
                }
                s((o = o.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__generator) ||
            function (e, t) {
              var n,
                o,
                r,
                a,
                i = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (a = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function c(a) {
                return function (c) {
                  return (function (a) {
                    if (n) throw new TypeError("Generator is already executing.")
                    for (; i; )
                      try {
                        if (
                          ((n = 1),
                          o &&
                            (r =
                              2 & a[0]
                                ? o.return
                                : a[0]
                                ? o.throw || ((r = o.return) && r.call(o), 0)
                                : o.next) &&
                            !(r = r.call(o, a[1])).done)
                        )
                          return r
                        switch (((o = 0), r && (a = [2 & a[0], r.value]), a[0])) {
                          case 0:
                          case 1:
                            r = a
                            break
                          case 4:
                            return i.label++, { value: a[1], done: !1 }
                          case 5:
                            i.label++, (o = a[1]), (a = [0])
                            continue
                          case 7:
                            ;(a = i.ops.pop()), i.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = i.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== a[0] && 2 !== a[0])
                              )
                            ) {
                              i = 0
                              continue
                            }
                            if (3 === a[0] && (!r || (a[1] > r[0] && a[1] < r[3]))) {
                              i.label = a[1]
                              break
                            }
                            if (6 === a[0] && i.label < r[1]) {
                              ;(i.label = r[1]), (r = a)
                              break
                            }
                            if (r && i.label < r[2]) {
                              ;(i.label = r[2]), i.ops.push(a)
                              break
                            }
                            r[2] && i.ops.pop(), i.trys.pop()
                            continue
                        }
                        a = t.call(e, i)
                      } catch (e) {
                        ;(a = [6, e]), (o = 0)
                      } finally {
                        n = r = 0
                      }
                    if (5 & a[0]) throw a[1]
                    return { value: a[0] ? a[1] : void 0, done: !0 }
                  })([a, c])
                }
              }
            },
          a =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.uploadWorker = void 0)
        var i = n(115),
          c = n(533),
          s = n(4),
          l = a(n(673)),
          u = n(686)
        ;(t.uploadWorker = new u.Worker(
          "upload",
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t, n, o, a, s, u, d, v, f, m
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    ;(t = e.data),
                      (n = t.coverageFile),
                      (o = t.commit),
                      (a = t.test),
                      (s = t.testInstance),
                      (u = t.namespaceSlug),
                      (d = t.repositorySlug),
                      (r.label = 1)
                  case 1:
                    if (
                      (r.trys.push([1, 4, , 6]),
                      console.log("Executing process upload job"),
                      (v = l.default),
                      !(f = n.data.coverage))
                    )
                      throw new Error(
                        "No coverage information in the input file, cannot read first project."
                      )
                    return (
                      console.log("Creating package and file information for test instance"),
                      [4, i.insertCoverageData(f, a.testName, { testInstanceId: s.id })]
                    )
                  case 2:
                    return (
                      r.sent(),
                      console.log("Inserted all package and file information"),
                      [
                        4,
                        v.jobLog.create({
                          data: {
                            name: "processupload",
                            namespace: u,
                            repository: d,
                            message:
                              "Processed upload information for commit " +
                              o.ref.substr(0, 10) +
                              (s ? " and test instance " + s.id + " and test" + a.testName : ""),
                          },
                        }),
                      ]
                    )
                  case 3:
                    return r.sent(), c.combineCoverageJob(o, u, d, s), [3, 6]
                  case 4:
                    return (
                      (m = r.sent()),
                      console.error(m),
                      [
                        4,
                        l.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            namespace: u,
                            repository: d,
                            message: "Failure processing " + m.message,
                          },
                        }),
                      ]
                    )
                  case 5:
                    return r.sent(), [2, !1]
                  case 6:
                    return [2]
                }
              })
            })
          },
          { connection: s.queueConfig, concurrency: 4 }
        )),
          t.uploadWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.uploadWorker.on("failed", function (e, t) {
            console.log(e.id + " has failed with " + t.message)
          })
      },
      533: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.combineCoverageJob = t.combineCoverageQueue = void 0)
        var o = n(4),
          r = n(686)
        ;(t.combineCoverageQueue = new r.Queue("combinecoverage", { connection: o.queueConfig })),
          (t.combineCoverageJob = function (e, n, o, r) {
            return (
              console.log("Adding new combine coverage job for " + e.ref),
              t.combineCoverageQueue.add(
                "combinecoverage",
                { commit: e, testInstance: r, namespaceSlug: n, repositorySlug: o },
                { removeOnComplete: !0, removeOnFail: 3 }
              )
            )
          })
      },
      4: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.queueConfig = void 0),
          (t.queueConfig = {
            host: process.env.REDIS_HOST,
            port: parseInt(process.env.REDIS_PORT || ""),
            db: parseInt(process.env.REDIS_DB || "0"),
          })
      },
      673: function (e, t, n) {
        var o =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, n, o) {
                  void 0 === o && (o = n),
                    Object.defineProperty(e, o, {
                      enumerable: !0,
                      get: function () {
                        return t[n]
                      },
                    })
                }
              : function (e, t, n, o) {
                  void 0 === o && (o = n), (e[o] = t[n])
                }),
          r =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var n in e)
                "default" === n || Object.prototype.hasOwnProperty.call(t, n) || o(t, e, n)
            }
        Object.defineProperty(t, "__esModule", { value: !0 })
        var a = n(21),
          i = n(212),
          c = a.enhancePrisma(i.PrismaClient)
        r(n(212), t)
        var s = new c({ log: [{ emit: "event", level: "query" }] })
        t.default = s
      },
      212: (e) => {
        e.exports = require("@prisma/client")
      },
      21: (e) => {
        e.exports = require("blitz")
      },
      686: (e) => {
        e.exports = require("bullmq")
      },
      320: (e) => {
        e.exports = require("joi")
      },
      589: (e) => {
        e.exports = require("xml2js")
      },
    },
    o = {}
  function r(e) {
    var t = o[e]
    if (void 0 !== t) return t.exports
    var a = (o[e] = { exports: {} })
    return n[e].call(a.exports, a, a.exports, r), a.exports
  }
  ;(e = r(914)),
    (t = r(801)),
    e.uploadWorker.resume(),
    t.combineCoverageWorker.resume(),
    console.log("started")
})()

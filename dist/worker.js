;(() => {
  "use strict"
  var e,
    t,
    o = {
      606: function (e, t, o) {
        var n =
            (this && this.__assign) ||
            function () {
              return (n =
                Object.assign ||
                function (e) {
                  for (var t, o = 1, n = arguments.length; o < n; o++)
                    for (var r in (t = arguments[o]))
                      Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                  return e
                }).apply(this, arguments)
            },
          r =
            (this && this.__awaiter) ||
            function (e, t, o, n) {
              return new (o || (o = Promise))(function (r, i) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof o
                        ? t
                        : new o(function (e) {
                            e(t)
                          })).then(a, c)
                }
                s((n = n.apply(e, t || [])).next())
              })
            },
          i =
            (this && this.__generator) ||
            function (e, t) {
              var o,
                n,
                r,
                i,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (i = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this
                  }),
                i
              )
              function c(i) {
                return function (c) {
                  return (function (i) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (r =
                              2 & i[0]
                                ? n.return
                                : i[0]
                                ? n.throw || ((r = n.return) && r.call(n), 0)
                                : n.next) &&
                            !(r = r.call(n, i[1])).done)
                        )
                          return r
                        switch (((n = 0), r && (i = [2 & i[0], r.value]), i[0])) {
                          case 0:
                          case 1:
                            r = i
                            break
                          case 4:
                            return a.label++, { value: i[1], done: !1 }
                          case 5:
                            a.label++, (n = i[1]), (i = [0])
                            continue
                          case 7:
                            ;(i = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = a.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === i[0] && (!r || (i[1] > r[0] && i[1] < r[3]))) {
                              a.label = i[1]
                              break
                            }
                            if (6 === i[0] && a.label < r[1]) {
                              ;(a.label = r[1]), (r = i)
                              break
                            }
                            if (r && a.label < r[2]) {
                              ;(a.label = r[2]), a.ops.push(i)
                              break
                            }
                            r[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        i = t.call(e, a)
                      } catch (e) {
                        ;(i = [6, e]), (n = 0)
                      } finally {
                        o = r = 0
                      }
                    if (5 & i[0]) throw i[1]
                    return { value: i[0] ? i[1] : void 0, done: !0 }
                  })([i, c])
                }
              }
            },
          a =
            (this && this.__spreadArray) ||
            function (e, t) {
              for (var o = 0, n = t.length, r = e.length; o < n; o++, r++) e[r] = t[o]
              return e
            },
          c =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoberturaCoverage = void 0)
        var s = o(456),
          l = o(589),
          d = c(o(320)),
          u = d.default.object({
            statements: d.default.number(),
            coveredstatements: d.default.number(),
            conditionals: d.default.number(),
            coveredconditionals: d.default.number(),
            methods: d.default.number(),
            coveredmethods: d.default.number(),
            elements: d.default.number(),
            coveredelements: d.default.number(),
          }),
          v = d.default.object({
            coverage: d.default.object({
              "lines-valid": d.default.number(),
              "lines-covered": d.default.number(),
              "line-rate": d.default.number(),
              "branches-valid": d.default.number(),
              "branches-covered": d.default.number(),
              "branch-rate": d.default.number(),
              timestamp: d.default.number(),
              complexity: d.default.number(),
              version: d.default.string(),
              sources: d.default.object({ source: d.default.string() }),
              metrics: u,
              packages: d.default
                .array()
                .items(
                  d.default.object({
                    name: d.default.string(),
                    "line-rate": d.default.number(),
                    "branch-rate": d.default.number(),
                    metrics: u,
                    files: d.default
                      .array()
                      .items(
                        d.default.object({
                          name: d.default.string(),
                          filename: d.default.string(),
                          "line-rate": d.default.number(),
                          "branch-rate": d.default.number(),
                          metrics: u,
                          lines: d.default
                            .array()
                            .items(
                              d.default.object({
                                branch: d.default.boolean(),
                                number: d.default.number(),
                                hits: d.default.number(),
                                coveredConditions: d.default.number(),
                                conditions: d.default.number(),
                                "condition-coverage": d.default.string(),
                              })
                            ),
                          functions: d.default
                            .array()
                            .items(
                              d.default.object({
                                name: d.default.string(),
                                number: d.default.number(),
                                hits: d.default.number(),
                                signature: d.default.string(),
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
          m = (function () {
            function e() {
              this.data = { coverage: { version: "0.1", packages: [] } }
            }
            return (
              (e.prototype.init = function (e) {
                return r(this, void 0, void 0, function () {
                  var t = this
                  return i(this, function (o) {
                    return [
                      2,
                      new Promise(function (o, r) {
                        l.parseString(e, function (e, i) {
                          var a
                          e && r(e)
                          var c = {
                              coverage: n(n({}, i.coverage.$), {
                                sources: { source: i.coverage.sources[0].source[0] },
                                packages:
                                  null === (a = i.coverage.packages[0].package) || void 0 === a
                                    ? void 0
                                    : a.map(function (e) {
                                        var t
                                        return n(n({}, e.$), {
                                          files:
                                            null === (t = e.classes[0].class) || void 0 === t
                                              ? void 0
                                              : t.map(function (e) {
                                                  var t, o, r, i
                                                  return n(n({}, e.$), {
                                                    lines:
                                                      null ===
                                                        (o =
                                                          null === (t = e.lines[0]) || void 0 === t
                                                            ? void 0
                                                            : t.line) || void 0 === o
                                                        ? void 0
                                                        : o.map(function (e) {
                                                            var t = e.$
                                                            if (t["condition-coverage"]) {
                                                              var o = /\(([0-9]+\/[0-9]+)\)/.exec(
                                                                t["condition-coverage"]
                                                              )
                                                              if (o && o[1]) {
                                                                var r = o[1].split("/")
                                                                ;(t.conditions = r[1]),
                                                                  (t.coveredConditions = r[0])
                                                              }
                                                            }
                                                            return n({}, t)
                                                          }),
                                                    functions:
                                                      null ===
                                                        (i =
                                                          null === (r = e.methods[0]) ||
                                                          void 0 === r
                                                            ? void 0
                                                            : r.method) || void 0 === i
                                                        ? void 0
                                                        : i.map(function (e) {
                                                            return n(
                                                              n({}, e.$),
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
                            d = s.value
                          if (l) throw l
                          t.updateMetrics(d), (t.data = d), o()
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
                  o = {}
                return (
                  e.coverage.packages.forEach(function (e) {
                    o[e.name] = e.metrics = {
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
                    for (var n = t.name.split("."), r = 1; r < n.length; r++) {
                      var i = n.slice(0, r).join(".")
                      o[i] ||
                        ((o[i] = {
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
                          name: i,
                          "line-rate": "0",
                          "branch-rate": "0",
                          files: [],
                          metrics: o[i],
                        }))
                    }
                  }),
                  e.coverage.packages.forEach(function (e) {
                    for (var n = [], r = e.name.split("."), i = 1; i < r.length; i++) {
                      var c = r.slice(0, i).join("."),
                        s = o[c]
                      s && n.push(s)
                    }
                    var l = o[e.name]
                    l && n.push(l),
                      e.files.forEach(function (e) {
                        var o,
                          r,
                          i = (e.metrics = {
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
                        null === (o = e.lines) ||
                          void 0 === o ||
                          o.forEach(function (e) {
                            a(a([t], n), [i]).forEach(function (t) {
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
                              a(a([t], n), [i]).forEach(function (t) {
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
              (e.prototype.mergeCoverage = function (e, t, o, n) {
                var r = this.data.coverage.packages.find(function (t) {
                  return t.name === e
                })
                r || ((r = { name: e, files: [] }), this.data.coverage.packages.push(r))
                var i = r.files.find(function (e) {
                  return e.name === t
                })
                i || ((i = { name: t, lines: [], functions: [] }), r.files.push(i))
                var a = i.coverageData ? i.coverageData : s.CoverageData.fromCoberturaFile(i),
                  c = s.CoverageData.fromString(o, n)
                a.merge(c)
                var l = a.toCoberturaFile(),
                  d = l.functions,
                  u = l.lines
                ;(i.lines = u), (i.functions = d), (i.coverageData = a)
              }),
              e
            )
          })()
        t.CoberturaCoverage = m
      },
      456: (e, t) => {
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoverageData = void 0)
        var o = (function () {
          function e() {
            ;(this.typeToStringMap = { branch: "cond", statement: "stmt", function: "func" }),
              (this.coverage = {})
          }
          return (
            (e.prototype.addCoverage = function (e, t) {
              this.coverage[e] || (this.coverage[e] = [])
              var o = this.coverage[e]
              o && o.push(t)
            }),
            (e.fromCoberturaFile = function (t, o) {
              var n,
                r,
                i = new e()
              return (
                null === (n = t.lines) ||
                  void 0 === n ||
                  n.forEach(function (e) {
                    var t, n
                    e.branch
                      ? i.addCoverage(e.number.toString(), {
                          type: "branch",
                          line: e.number,
                          hits: e.hits,
                          conditionals: e.conditions,
                          coveredConditionals: e.coveredConditions,
                          hitsBySource: o ? ((t = {}), (t[o] = e.hits), t) : {},
                        })
                      : i.addCoverage(e.number.toString(), {
                          type: "statement",
                          line: e.number,
                          hits: e.hits,
                          hitsBySource: o ? ((n = {}), (n[o] = e.hits), n) : {},
                        })
                  }),
                null === (r = t.functions) ||
                  void 0 === r ||
                  r.forEach(function (e) {
                    var t
                    i.addCoverage(e.number.toString(), {
                      type: "function",
                      line: e.number,
                      hits: e.hits,
                      signature: e.signature,
                      name: e.name,
                      hitsBySource: o ? ((t = {}), (t[o] = e.hits), t) : {},
                    })
                  }),
                i
              )
            }),
            (e.fromString = function (t, o) {
              var n = new e(),
                r = function (e) {
                  return null == e
                    ? void 0
                    : e
                        .split(";")
                        .map(function (e) {
                          return e.split("=")
                        })
                        .reduce(function (e, t, o) {
                          return (e[t[0] || ""] = t[1]), e
                        }, {})
                }
              return (
                t.split("\n").forEach(function (e) {
                  var t,
                    i,
                    a,
                    c = e.split(",")
                  switch (c[0]) {
                    case "stmt":
                      var s = r(c[3]),
                        l = parseInt(c[2] || "")
                      n.addCoverage(c[1] || "", {
                        type: "statement",
                        line: parseInt(c[1] || ""),
                        hits: l,
                        hitsBySource: s || (o ? ((t = {}), (t[o] = l), t) : {}),
                      })
                      break
                    case "cond":
                      ;(s = r(c[5])),
                        (l = parseInt(c[2] || "")),
                        n.addCoverage(c[1] || "", {
                          type: "branch",
                          line: parseInt(c[1] || ""),
                          hits: parseInt(c[2] || ""),
                          coveredConditionals: parseInt(c[3] || ""),
                          conditionals: parseInt(c[4] || ""),
                          hitsBySource: s || (o ? ((i = {}), (i[o] = l), i) : {}),
                        })
                      break
                    case "func":
                      ;(s = r(c[5])),
                        (l = parseInt(c[2] || "")),
                        n.addCoverage(c[1] || "", {
                          type: "function",
                          line: parseInt(c[1] || ""),
                          hits: parseInt(c[2] || ""),
                          signature: c[3] || "",
                          name: c[4] || "",
                          hitsBySource: s || (o ? ((a = {}), (a[o] = l), a) : {}),
                        })
                  }
                }),
                n
              )
            }),
            (e.prototype.toCoberturaFile = function () {
              var e,
                t = this,
                o = [],
                n = []
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
                            ? o.push({ branch: !1, number: e.line, hits: e.hits })
                            : "branch" === e.type
                            ? o.push({
                                branch: !0,
                                number: e.line,
                                hits: e.hits,
                                conditions: e.conditionals,
                                coveredConditions: e.coveredConditionals,
                              })
                            : "function" === e.type &&
                              n.push({
                                name: e.name,
                                number: e.line,
                                hits: e.hits,
                                signature: e.signature,
                              })
                      })
                  }),
                { lines: o, functions: n }
              )
            }),
            (e.prototype.toString = function () {
              var e,
                t = this,
                o = []
              return (
                null === (e = Object.keys(this.coverage)) ||
                  void 0 === e ||
                  e.forEach(function (e) {
                    var n
                    null === (n = t.coverage[e]) ||
                      void 0 === n ||
                      n.forEach(function (e) {
                        var n = t.typeToStringMap[e.type],
                          r = Object.keys(e.hitsBySource)
                            .map(function (t) {
                              return t + "=" + e.hitsBySource[t]
                            })
                            .join(";")
                        "statement" === e.type
                          ? o.push(n + "," + e.line + "," + e.hits + "," + r)
                          : "branch" === e.type
                          ? o.push(
                              n +
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
                            o.push(
                              n +
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
                o.join("\n")
              )
            }),
            (e.prototype.merge = function (e) {
              var t = this
              Object.keys(e.coverage).forEach(function (o) {
                var n = t.coverage[o],
                  r = e.coverage[o]
                r && n
                  ? null == r ||
                    r.forEach(function (e) {
                      var r = n.find(function (t) {
                        return t.type === e.type
                      })
                      r
                        ? (Object.keys(e.hitsBySource).forEach(function (t) {
                            var o = e.hitsBySource[t]
                            o && (r.hitsBySource[t] = o)
                          }),
                          (r.hits = r.hits + e.hits),
                          "branch" === r.type &&
                            "branch" === e.type &&
                            (r.coveredConditionals = Math.max(
                              r.coveredConditionals,
                              e.coveredConditionals
                            )))
                        : t.addCoverage(o, e)
                    })
                  : null == r ||
                    r.forEach(function (e) {
                      t.addCoverage(o, e)
                    })
              })
            }),
            e
          )
        })()
        t.CoverageData = o
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
      801: function (e, t, o) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, o, n) {
              return new (o || (o = Promise))(function (r, i) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof o
                        ? t
                        : new o(function (e) {
                            e(t)
                          })).then(a, c)
                }
                s((n = n.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__generator) ||
            function (e, t) {
              var o,
                n,
                r,
                i,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (i = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this
                  }),
                i
              )
              function c(i) {
                return function (c) {
                  return (function (i) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (r =
                              2 & i[0]
                                ? n.return
                                : i[0]
                                ? n.throw || ((r = n.return) && r.call(n), 0)
                                : n.next) &&
                            !(r = r.call(n, i[1])).done)
                        )
                          return r
                        switch (((n = 0), r && (i = [2 & i[0], r.value]), i[0])) {
                          case 0:
                          case 1:
                            r = i
                            break
                          case 4:
                            return a.label++, { value: i[1], done: !1 }
                          case 5:
                            a.label++, (n = i[1]), (i = [0])
                            continue
                          case 7:
                            ;(i = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = a.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === i[0] && (!r || (i[1] > r[0] && i[1] < r[3]))) {
                              a.label = i[1]
                              break
                            }
                            if (6 === i[0] && a.label < r[1]) {
                              ;(a.label = r[1]), (r = i)
                              break
                            }
                            if (r && a.label < r[2]) {
                              ;(a.label = r[2]), a.ops.push(i)
                              break
                            }
                            r[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        i = t.call(e, a)
                      } catch (e) {
                        ;(i = [6, e]), (n = 0)
                      } finally {
                        o = r = 0
                      }
                    if (5 & i[0]) throw i[1]
                    return { value: i[0] ? i[1] : void 0, done: !0 }
                  })([i, c])
                }
              }
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.combineCoverageWorker = void 0)
        var a = o(606),
          c = o(456),
          s = o(93),
          l = o(4),
          d = o(686),
          u = i(o(673))
        ;(t.combineCoverageWorker = new d.Worker(
          "combinecoverage",
          function (e) {
            return n(void 0, void 0, void 0, function () {
              var t,
                o,
                i,
                l,
                d,
                v,
                m,
                f,
                h,
                g,
                p,
                b,
                y,
                C,
                w,
                k,
                _,
                E,
                P,
                S,
                j,
                x,
                I,
                M,
                D,
                O,
                F,
                B,
                q,
                W,
                N,
                T,
                $,
                L,
                Q,
                R,
                A,
                G,
                J,
                U,
                z,
                H,
                K,
                V,
                X,
                Y,
                Z,
                ee,
                te,
                oe,
                ne,
                re
              return r(this, function (ie) {
                switch (ie.label) {
                  case 0:
                    return (
                      ie.trys.push([0, 12, , 14]),
                      (t = e.data),
                      (o = t.commit),
                      (i = t.testInstance),
                      console.log("Executing combine coverage job"),
                      (l = u.default),
                      i
                        ? [
                            4,
                            l.test.findFirst({
                              where: { id: null !== (b = i.testId) && void 0 !== b ? b : void 0 },
                            }),
                          ]
                        : [3, 6]
                    )
                  case 1:
                    if (!(d = ie.sent()))
                      throw Error("Cannot combine coverage for testInstance without a test")
                    return [
                      4,
                      l.testInstance.findMany({
                        where: { testId: d.id },
                        orderBy: { createdDate: "desc" },
                        include: { PackageCoverage: { include: { FileCoverage: !0 } } },
                      }),
                    ]
                  case 2:
                    return (
                      (v = ie.sent()),
                      (m = new a.CoberturaCoverage()),
                      console.log("Merging coverage information for all test instances"),
                      v.forEach(function (e) {
                        e.PackageCoverage.forEach(function (e) {
                          return n(void 0, void 0, void 0, function () {
                            var t
                            return r(this, function (o) {
                              return (
                                null === (t = e.FileCoverage) ||
                                  void 0 === t ||
                                  t.forEach(function (t) {
                                    m.mergeCoverage(e.name, t.name, t.coverageData, d.testName)
                                  }),
                                [2]
                              )
                            })
                          })
                        })
                      }),
                      m.updateMetrics(m.data),
                      console.log(
                        "Test instance combination with previous test instances result: " +
                          (null === (y = m.data.coverage.metrics) || void 0 === y
                            ? void 0
                            : y.coveredelements) +
                          "/" +
                          (null === (C = m.data.coverage.metrics) || void 0 === C
                            ? void 0
                            : C.elements) +
                          " covered based on " +
                          v.length +
                          " instances"
                      ),
                      console.log("Deleting existing results for test"),
                      [4, l.packageCoverage.deleteMany({ where: { testId: d.id } })]
                    )
                  case 3:
                    return (
                      ie.sent(),
                      console.log("Updating coverage summary data for test"),
                      [
                        4,
                        l.test.update({
                          where: { id: d.id },
                          data: {
                            statements:
                              null !==
                                (k =
                                  null === (w = m.data.coverage.metrics) || void 0 === w
                                    ? void 0
                                    : w.statements) && void 0 !== k
                                ? k
                                : 0,
                            conditionals:
                              null !==
                                (E =
                                  null === (_ = m.data.coverage.metrics) || void 0 === _
                                    ? void 0
                                    : _.conditionals) && void 0 !== E
                                ? E
                                : 0,
                            methods:
                              null !==
                                (S =
                                  null === (P = m.data.coverage.metrics) || void 0 === P
                                    ? void 0
                                    : P.methods) && void 0 !== S
                                ? S
                                : 0,
                            elements:
                              null !==
                                (x =
                                  null === (j = m.data.coverage.metrics) || void 0 === j
                                    ? void 0
                                    : j.elements) && void 0 !== x
                                ? x
                                : 0,
                            hits:
                              null !==
                                (M =
                                  null === (I = m.data.coverage.metrics) || void 0 === I
                                    ? void 0
                                    : I.hits) && void 0 !== M
                                ? M
                                : 0,
                            coveredStatements:
                              null !==
                                (O =
                                  null === (D = m.data.coverage.metrics) || void 0 === D
                                    ? void 0
                                    : D.coveredstatements) && void 0 !== O
                                ? O
                                : 0,
                            coveredConditionals:
                              null !==
                                (B =
                                  null === (F = m.data.coverage.metrics) || void 0 === F
                                    ? void 0
                                    : F.coveredconditionals) && void 0 !== B
                                ? B
                                : 0,
                            coveredMethods:
                              null !==
                                (W =
                                  null === (q = m.data.coverage.metrics) || void 0 === q
                                    ? void 0
                                    : q.coveredmethods) && void 0 !== W
                                ? W
                                : 0,
                            coveredElements:
                              null !==
                                (T =
                                  null === (N = m.data.coverage.metrics) || void 0 === N
                                    ? void 0
                                    : N.coveredelements) && void 0 !== T
                                ? T
                                : 0,
                            coveredPercentage: s.coveredPercentage(m.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 4:
                    return (
                      ie.sent(),
                      console.log("Inserting new package and file coverage for test"),
                      [
                        4,
                        Promise.all(
                          m.data.coverage.packages.map(function (e) {
                            return n(void 0, void 0, void 0, function () {
                              var t, o, n, i, a, u, v, m, f, h, g, p, b, y, C, w, k, _, E, P, S
                              return r(this, function (r) {
                                return (
                                  (t = e.name.length - e.name.replace(/\./g, "").length),
                                  (o = {
                                    name: e.name,
                                    testId: d.id,
                                    statements:
                                      null !==
                                        (i =
                                          null === (n = e.metrics) || void 0 === n
                                            ? void 0
                                            : n.statements) && void 0 !== i
                                        ? i
                                        : 0,
                                    conditionals:
                                      null !==
                                        (u =
                                          null === (a = e.metrics) || void 0 === a
                                            ? void 0
                                            : a.conditionals) && void 0 !== u
                                        ? u
                                        : 0,
                                    methods:
                                      null !==
                                        (m =
                                          null === (v = e.metrics) || void 0 === v
                                            ? void 0
                                            : v.methods) && void 0 !== m
                                        ? m
                                        : 0,
                                    elements:
                                      null !==
                                        (h =
                                          null === (f = e.metrics) || void 0 === f
                                            ? void 0
                                            : f.elements) && void 0 !== h
                                        ? h
                                        : 0,
                                    hits:
                                      null !==
                                        (p =
                                          null === (g = e.metrics) || void 0 === g
                                            ? void 0
                                            : g.hits) && void 0 !== p
                                        ? p
                                        : 0,
                                    coveredStatements:
                                      null !==
                                        (y =
                                          null === (b = e.metrics) || void 0 === b
                                            ? void 0
                                            : b.coveredstatements) && void 0 !== y
                                        ? y
                                        : 0,
                                    coveredConditionals:
                                      null !==
                                        (w =
                                          null === (C = e.metrics) || void 0 === C
                                            ? void 0
                                            : C.coveredconditionals) && void 0 !== w
                                        ? w
                                        : 0,
                                    coveredMethods:
                                      null !==
                                        (_ =
                                          null === (k = e.metrics) || void 0 === k
                                            ? void 0
                                            : k.coveredmethods) && void 0 !== _
                                        ? _
                                        : 0,
                                    coveredElements:
                                      null !==
                                        (P =
                                          null === (E = e.metrics) || void 0 === E
                                            ? void 0
                                            : E.coveredelements) && void 0 !== P
                                        ? P
                                        : 0,
                                    coveredPercentage: s.coveredPercentage(e.metrics),
                                    depth: t,
                                    FileCoverage: {
                                      create:
                                        null === (S = e.files) || void 0 === S
                                          ? void 0
                                          : S.map(function (e) {
                                              var t,
                                                o,
                                                n,
                                                r,
                                                i,
                                                a,
                                                l,
                                                d,
                                                u,
                                                v,
                                                m,
                                                f,
                                                h,
                                                g,
                                                p,
                                                b,
                                                y,
                                                C,
                                                w = e.coverageData
                                                  ? e.coverageData
                                                  : c.CoverageData.fromCoberturaFile(e)
                                              return {
                                                name: e.name,
                                                statements:
                                                  null !==
                                                    (o =
                                                      null === (t = e.metrics) || void 0 === t
                                                        ? void 0
                                                        : t.statements) && void 0 !== o
                                                    ? o
                                                    : 0,
                                                conditionals:
                                                  null !==
                                                    (r =
                                                      null === (n = e.metrics) || void 0 === n
                                                        ? void 0
                                                        : n.conditionals) && void 0 !== r
                                                    ? r
                                                    : 0,
                                                methods:
                                                  null !==
                                                    (a =
                                                      null === (i = e.metrics) || void 0 === i
                                                        ? void 0
                                                        : i.methods) && void 0 !== a
                                                    ? a
                                                    : 0,
                                                hits:
                                                  null !==
                                                    (d =
                                                      null === (l = e.metrics) || void 0 === l
                                                        ? void 0
                                                        : l.hits) && void 0 !== d
                                                    ? d
                                                    : 0,
                                                coveredStatements:
                                                  null !==
                                                    (v =
                                                      null === (u = e.metrics) || void 0 === u
                                                        ? void 0
                                                        : u.coveredstatements) && void 0 !== v
                                                    ? v
                                                    : 0,
                                                coveredConditionals:
                                                  null !==
                                                    (f =
                                                      null === (m = e.metrics) || void 0 === m
                                                        ? void 0
                                                        : m.coveredconditionals) && void 0 !== f
                                                    ? f
                                                    : 0,
                                                coveredMethods:
                                                  null !==
                                                    (g =
                                                      null === (h = e.metrics) || void 0 === h
                                                        ? void 0
                                                        : h.coveredmethods) && void 0 !== g
                                                    ? g
                                                    : 0,
                                                coverageData: w.toString(),
                                                coveredElements:
                                                  null !==
                                                    (b =
                                                      null === (p = e.metrics) || void 0 === p
                                                        ? void 0
                                                        : p.coveredelements) && void 0 !== b
                                                    ? b
                                                    : 0,
                                                elements:
                                                  null !==
                                                    (C =
                                                      null === (y = e.metrics) || void 0 === y
                                                        ? void 0
                                                        : y.elements) && void 0 !== C
                                                    ? C
                                                    : 0,
                                                coveredPercentage: s.coveredPercentage(e.metrics),
                                              }
                                            }),
                                    },
                                  }),
                                  [2, l.packageCoverage.create({ data: o })]
                                )
                              })
                            })
                          })
                        ),
                      ]
                    )
                  case 5:
                    ie.sent(), (ie.label = 6)
                  case 6:
                    if (!o) throw Error("Cannot combine coverage without a commit")
                    return (
                      console.log("Combining test coverage results for commit"),
                      [
                        4,
                        l.test.findMany({
                          where: { commitId: o.id },
                          orderBy: { createdDate: "desc" },
                          include: { PackageCoverage: { include: { FileCoverage: !0 } } },
                        }),
                      ]
                    )
                  case 7:
                    return (
                      (f = ie.sent()),
                      (h = {}),
                      f.forEach(function (e) {
                        h[e.testName] = e
                      }),
                      console.log("Found " + Object.keys(h).length + " tests to combine."),
                      (g = new a.CoberturaCoverage()),
                      Object.values(h).forEach(function (e) {
                        return n(void 0, void 0, void 0, function () {
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
                                return n(void 0, void 0, void 0, function () {
                                  var o
                                  return r(this, function (n) {
                                    return (
                                      null === (o = t.FileCoverage) ||
                                        void 0 === o ||
                                        o.forEach(function (o) {
                                          g.mergeCoverage(
                                            t.name,
                                            o.name,
                                            o.coverageData,
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
                      g.updateMetrics(g.data),
                      console.log(
                        "All test combination result " +
                          (null === ($ = g.data.coverage.metrics) || void 0 === $
                            ? void 0
                            : $.coveredelements) +
                          "/" +
                          (null === (L = g.data.coverage.metrics) || void 0 === L
                            ? void 0
                            : L.elements) +
                          " covered"
                      ),
                      console.log("Deleting existing results for commit"),
                      [4, l.packageCoverage.deleteMany({ where: { commitId: o.id } })]
                    )
                  case 8:
                    return (
                      ie.sent(),
                      console.log("Updating coverage summary data for commit"),
                      [
                        4,
                        l.commit.update({
                          where: { id: o.id },
                          data: {
                            statements:
                              null !==
                                (R =
                                  null === (Q = g.data.coverage.metrics) || void 0 === Q
                                    ? void 0
                                    : Q.statements) && void 0 !== R
                                ? R
                                : 0,
                            conditionals:
                              null !==
                                (G =
                                  null === (A = g.data.coverage.metrics) || void 0 === A
                                    ? void 0
                                    : A.conditionals) && void 0 !== G
                                ? G
                                : 0,
                            methods:
                              null !==
                                (U =
                                  null === (J = g.data.coverage.metrics) || void 0 === J
                                    ? void 0
                                    : J.methods) && void 0 !== U
                                ? U
                                : 0,
                            elements:
                              null !==
                                (H =
                                  null === (z = g.data.coverage.metrics) || void 0 === z
                                    ? void 0
                                    : z.elements) && void 0 !== H
                                ? H
                                : 0,
                            hits:
                              null !==
                                (V =
                                  null === (K = g.data.coverage.metrics) || void 0 === K
                                    ? void 0
                                    : K.hits) && void 0 !== V
                                ? V
                                : 0,
                            coveredStatements:
                              null !==
                                (Y =
                                  null === (X = g.data.coverage.metrics) || void 0 === X
                                    ? void 0
                                    : X.coveredstatements) && void 0 !== Y
                                ? Y
                                : 0,
                            coveredConditionals:
                              null !==
                                (ee =
                                  null === (Z = g.data.coverage.metrics) || void 0 === Z
                                    ? void 0
                                    : Z.coveredconditionals) && void 0 !== ee
                                ? ee
                                : 0,
                            coveredMethods:
                              null !==
                                (oe =
                                  null === (te = g.data.coverage.metrics) || void 0 === te
                                    ? void 0
                                    : te.coveredmethods) && void 0 !== oe
                                ? oe
                                : 0,
                            coveredElements:
                              null !==
                                (re =
                                  null === (ne = g.data.coverage.metrics) || void 0 === ne
                                    ? void 0
                                    : ne.coveredelements) && void 0 !== re
                                ? re
                                : 0,
                            coveredPercentage: s.coveredPercentage(g.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 9:
                    return (
                      ie.sent(),
                      console.log("Inserting new package and file coverage for commit"),
                      [
                        4,
                        Promise.all(
                          g.data.coverage.packages.map(function (e) {
                            return n(void 0, void 0, void 0, function () {
                              var t, n, i, a, d, u, v, m, f, h, g, p, b, y, C, w, k, _, E, P, S
                              return r(this, function (r) {
                                switch (r.label) {
                                  case 0:
                                    return (
                                      (t = e.name.length - e.name.replace(/\./g, "").length),
                                      (n = {
                                        name: e.name,
                                        commitId: o.id,
                                        statements:
                                          null !==
                                            (a =
                                              null === (i = e.metrics) || void 0 === i
                                                ? void 0
                                                : i.statements) && void 0 !== a
                                            ? a
                                            : 0,
                                        conditionals:
                                          null !==
                                            (u =
                                              null === (d = e.metrics) || void 0 === d
                                                ? void 0
                                                : d.conditionals) && void 0 !== u
                                            ? u
                                            : 0,
                                        methods:
                                          null !==
                                            (m =
                                              null === (v = e.metrics) || void 0 === v
                                                ? void 0
                                                : v.methods) && void 0 !== m
                                            ? m
                                            : 0,
                                        elements:
                                          null !==
                                            (h =
                                              null === (f = e.metrics) || void 0 === f
                                                ? void 0
                                                : f.elements) && void 0 !== h
                                            ? h
                                            : 0,
                                        hits:
                                          null !==
                                            (p =
                                              null === (g = e.metrics) || void 0 === g
                                                ? void 0
                                                : g.hits) && void 0 !== p
                                            ? p
                                            : 0,
                                        coveredStatements:
                                          null !==
                                            (y =
                                              null === (b = e.metrics) || void 0 === b
                                                ? void 0
                                                : b.coveredstatements) && void 0 !== y
                                            ? y
                                            : 0,
                                        coveredConditionals:
                                          null !==
                                            (w =
                                              null === (C = e.metrics) || void 0 === C
                                                ? void 0
                                                : C.coveredconditionals) && void 0 !== w
                                            ? w
                                            : 0,
                                        coveredMethods:
                                          null !==
                                            (_ =
                                              null === (k = e.metrics) || void 0 === k
                                                ? void 0
                                                : k.coveredmethods) && void 0 !== _
                                            ? _
                                            : 0,
                                        coveredElements:
                                          null !==
                                            (P =
                                              null === (E = e.metrics) || void 0 === E
                                                ? void 0
                                                : E.coveredelements) && void 0 !== P
                                            ? P
                                            : 0,
                                        coveredPercentage: s.coveredPercentage(e.metrics),
                                        depth: t,
                                        FileCoverage: {
                                          create:
                                            null === (S = e.files) || void 0 === S
                                              ? void 0
                                              : S.map(function (e) {
                                                  var t,
                                                    o,
                                                    n,
                                                    r,
                                                    i,
                                                    a,
                                                    l,
                                                    d,
                                                    u,
                                                    v,
                                                    m,
                                                    f,
                                                    h,
                                                    g,
                                                    p,
                                                    b,
                                                    y,
                                                    C,
                                                    w = e.coverageData
                                                      ? e.coverageData
                                                      : c.CoverageData.fromCoberturaFile(e)
                                                  return {
                                                    name: e.name,
                                                    statements:
                                                      null !==
                                                        (o =
                                                          null === (t = e.metrics) || void 0 === t
                                                            ? void 0
                                                            : t.statements) && void 0 !== o
                                                        ? o
                                                        : 0,
                                                    conditionals:
                                                      null !==
                                                        (r =
                                                          null === (n = e.metrics) || void 0 === n
                                                            ? void 0
                                                            : n.conditionals) && void 0 !== r
                                                        ? r
                                                        : 0,
                                                    methods:
                                                      null !==
                                                        (a =
                                                          null === (i = e.metrics) || void 0 === i
                                                            ? void 0
                                                            : i.methods) && void 0 !== a
                                                        ? a
                                                        : 0,
                                                    hits:
                                                      null !==
                                                        (d =
                                                          null === (l = e.metrics) || void 0 === l
                                                            ? void 0
                                                            : l.hits) && void 0 !== d
                                                        ? d
                                                        : 0,
                                                    coveredStatements:
                                                      null !==
                                                        (v =
                                                          null === (u = e.metrics) || void 0 === u
                                                            ? void 0
                                                            : u.coveredstatements) && void 0 !== v
                                                        ? v
                                                        : 0,
                                                    coveredConditionals:
                                                      null !==
                                                        (f =
                                                          null === (m = e.metrics) || void 0 === m
                                                            ? void 0
                                                            : m.coveredconditionals) && void 0 !== f
                                                        ? f
                                                        : 0,
                                                    coveredMethods:
                                                      null !==
                                                        (g =
                                                          null === (h = e.metrics) || void 0 === h
                                                            ? void 0
                                                            : h.coveredmethods) && void 0 !== g
                                                        ? g
                                                        : 0,
                                                    coverageData: w.toString(),
                                                    coveredElements:
                                                      null !==
                                                        (b =
                                                          null === (p = e.metrics) || void 0 === p
                                                            ? void 0
                                                            : p.coveredelements) && void 0 !== b
                                                        ? b
                                                        : 0,
                                                    elements:
                                                      null !==
                                                        (C =
                                                          null === (y = e.metrics) || void 0 === y
                                                            ? void 0
                                                            : y.elements) && void 0 !== C
                                                        ? C
                                                        : 0,
                                                    coveredPercentage: s.coveredPercentage(
                                                      e.metrics
                                                    ),
                                                  }
                                                }),
                                        },
                                      }),
                                      [4, l.packageCoverage.create({ data: n })]
                                    )
                                  case 1:
                                    return r.sent(), [2]
                                }
                              })
                            })
                          })
                        ),
                      ]
                    )
                  case 10:
                    return (
                      ie.sent(),
                      [
                        4,
                        l.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            message:
                              "Combined coverage for commit " +
                              o.id +
                              (i ? " and test instance " + i.id : ""),
                          },
                        }),
                      ]
                    )
                  case 11:
                    return ie.sent(), [2, !0]
                  case 12:
                    return (
                      (p = ie.sent()),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            message: "Failure processing " + p.message,
                          },
                        }),
                      ]
                    )
                  case 13:
                    return ie.sent(), [2, !1]
                  case 14:
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
      914: function (e, t, o) {
        var n =
            (this && this.__awaiter) ||
            function (e, t, o, n) {
              return new (o || (o = Promise))(function (r, i) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    i(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof o
                        ? t
                        : new o(function (e) {
                            e(t)
                          })).then(a, c)
                }
                s((n = n.apply(e, t || [])).next())
              })
            },
          r =
            (this && this.__generator) ||
            function (e, t) {
              var o,
                n,
                r,
                i,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & r[0]) throw r[1]
                    return r[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (i = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (i[Symbol.iterator] = function () {
                    return this
                  }),
                i
              )
              function c(i) {
                return function (c) {
                  return (function (i) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (r =
                              2 & i[0]
                                ? n.return
                                : i[0]
                                ? n.throw || ((r = n.return) && r.call(n), 0)
                                : n.next) &&
                            !(r = r.call(n, i[1])).done)
                        )
                          return r
                        switch (((n = 0), r && (i = [2 & i[0], r.value]), i[0])) {
                          case 0:
                          case 1:
                            r = i
                            break
                          case 4:
                            return a.label++, { value: i[1], done: !1 }
                          case 5:
                            a.label++, (n = i[1]), (i = [0])
                            continue
                          case 7:
                            ;(i = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (r = (r = a.trys).length > 0 && r[r.length - 1]) ||
                                (6 !== i[0] && 2 !== i[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === i[0] && (!r || (i[1] > r[0] && i[1] < r[3]))) {
                              a.label = i[1]
                              break
                            }
                            if (6 === i[0] && a.label < r[1]) {
                              ;(a.label = r[1]), (r = i)
                              break
                            }
                            if (r && a.label < r[2]) {
                              ;(a.label = r[2]), a.ops.push(i)
                              break
                            }
                            r[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        i = t.call(e, a)
                      } catch (e) {
                        ;(i = [6, e]), (n = 0)
                      } finally {
                        o = r = 0
                      }
                    if (5 & i[0]) throw i[1]
                    return { value: i[0] ? i[1] : void 0, done: !0 }
                  })([i, c])
                }
              }
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.uploadWorker = void 0)
        var a = o(456),
          c = o(93),
          s = o(533),
          l = o(4),
          d = i(o(673)),
          u = o(686)
        ;(t.uploadWorker = new u.Worker(
          "upload",
          function (e) {
            return n(void 0, void 0, void 0, function () {
              var t, o, i, l, u, v, m, f
              return r(this, function (h) {
                switch (h.label) {
                  case 0:
                    if (
                      (h.trys.push([0, 3, , 5]),
                      (t = e.data),
                      (o = t.coverageFile),
                      (i = t.commit),
                      (l = t.test),
                      (u = t.testInstance),
                      console.log("Executing process upload job"),
                      (v = d.default),
                      !(m = o.data.coverage))
                    )
                      throw new Error(
                        "No coverage information in the input file, cannot read first project."
                      )
                    return (
                      console.log("Creating package and file information for test instance"),
                      [
                        4,
                        Promise.all(
                          m.packages.map(function (e) {
                            return n(void 0, void 0, void 0, function () {
                              var t, o, n, i, s, d, m, f, h, g, p, b, y, C, w, k, _, E, P
                              return r(this, function (r) {
                                switch (r.label) {
                                  case 0:
                                    return (
                                      (t = e.name.length - e.name.replace(/\./g, "").length),
                                      (o = {
                                        name: e.name,
                                        testInstanceId: u.id,
                                        statements:
                                          null !==
                                            (i =
                                              null === (n = e.metrics) || void 0 === n
                                                ? void 0
                                                : n.statements) && void 0 !== i
                                            ? i
                                            : 0,
                                        conditionals:
                                          null !==
                                            (d =
                                              null === (s = e.metrics) || void 0 === s
                                                ? void 0
                                                : s.conditionals) && void 0 !== d
                                            ? d
                                            : 0,
                                        methods:
                                          null !==
                                            (f =
                                              null === (m = e.metrics) || void 0 === m
                                                ? void 0
                                                : m.methods) && void 0 !== f
                                            ? f
                                            : 0,
                                        elements:
                                          null !==
                                            (g =
                                              null === (h = e.metrics) || void 0 === h
                                                ? void 0
                                                : h.elements) && void 0 !== g
                                            ? g
                                            : 0,
                                        coveredStatements:
                                          null !==
                                            (b =
                                              null === (p = e.metrics) || void 0 === p
                                                ? void 0
                                                : p.coveredstatements) && void 0 !== b
                                            ? b
                                            : 0,
                                        coveredConditionals:
                                          null !==
                                            (C =
                                              null === (y = e.metrics) || void 0 === y
                                                ? void 0
                                                : y.coveredconditionals) && void 0 !== C
                                            ? C
                                            : 0,
                                        coveredMethods:
                                          null !==
                                            (k =
                                              null === (w = e.metrics) || void 0 === w
                                                ? void 0
                                                : w.coveredmethods) && void 0 !== k
                                            ? k
                                            : 0,
                                        coveredElements:
                                          null !==
                                            (E =
                                              null === (_ = e.metrics) || void 0 === _
                                                ? void 0
                                                : _.coveredelements) && void 0 !== E
                                            ? E
                                            : 0,
                                        coveredPercentage: c.coveredPercentage(e.metrics),
                                        depth: t,
                                        FileCoverage: {
                                          create:
                                            null === (P = e.files) || void 0 === P
                                              ? void 0
                                              : P.map(function (e) {
                                                  var t,
                                                    o,
                                                    n,
                                                    r,
                                                    i,
                                                    s,
                                                    d,
                                                    u,
                                                    v,
                                                    m,
                                                    f,
                                                    h,
                                                    g,
                                                    p,
                                                    b,
                                                    y,
                                                    C = a.CoverageData.fromCoberturaFile(
                                                      e,
                                                      l.testName
                                                    )
                                                  return {
                                                    name: e.name,
                                                    statements:
                                                      null !==
                                                        (o =
                                                          null === (t = e.metrics) || void 0 === t
                                                            ? void 0
                                                            : t.statements) && void 0 !== o
                                                        ? o
                                                        : 0,
                                                    conditionals:
                                                      null !==
                                                        (r =
                                                          null === (n = e.metrics) || void 0 === n
                                                            ? void 0
                                                            : n.conditionals) && void 0 !== r
                                                        ? r
                                                        : 0,
                                                    methods:
                                                      null !==
                                                        (s =
                                                          null === (i = e.metrics) || void 0 === i
                                                            ? void 0
                                                            : i.methods) && void 0 !== s
                                                        ? s
                                                        : 0,
                                                    coveredStatements:
                                                      null !==
                                                        (u =
                                                          null === (d = e.metrics) || void 0 === d
                                                            ? void 0
                                                            : d.coveredstatements) && void 0 !== u
                                                        ? u
                                                        : 0,
                                                    coveredConditionals:
                                                      null !==
                                                        (m =
                                                          null === (v = e.metrics) || void 0 === v
                                                            ? void 0
                                                            : v.coveredconditionals) && void 0 !== m
                                                        ? m
                                                        : 0,
                                                    coveredMethods:
                                                      null !==
                                                        (h =
                                                          null === (f = e.metrics) || void 0 === f
                                                            ? void 0
                                                            : f.coveredmethods) && void 0 !== h
                                                        ? h
                                                        : 0,
                                                    coverageData: C.toString(),
                                                    coveredElements:
                                                      null !==
                                                        (p =
                                                          null === (g = e.metrics) || void 0 === g
                                                            ? void 0
                                                            : g.coveredelements) && void 0 !== p
                                                        ? p
                                                        : 0,
                                                    elements:
                                                      null !==
                                                        (y =
                                                          null === (b = e.metrics) || void 0 === b
                                                            ? void 0
                                                            : b.elements) && void 0 !== y
                                                        ? y
                                                        : 0,
                                                    coveredPercentage: c.coveredPercentage(
                                                      e.metrics
                                                    ),
                                                  }
                                                }),
                                        },
                                      }),
                                      [4, v.packageCoverage.create({ data: o })]
                                    )
                                  case 1:
                                    return r.sent(), [2]
                                }
                              })
                            })
                          })
                        ),
                      ]
                    )
                  case 1:
                    return (
                      h.sent(),
                      console.log("Inserted all package and file information"),
                      [
                        4,
                        v.jobLog.create({
                          data: {
                            name: "processupload",
                            message:
                              "Processed upload information for commit " +
                              i.id +
                              (u ? " and test instance " + u.id : ""),
                          },
                        }),
                      ]
                    )
                  case 2:
                    return h.sent(), s.combineCoverageJob(i, u), [3, 5]
                  case 3:
                    return (
                      (f = h.sent()),
                      [
                        4,
                        d.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            message: "Failure processing " + f.message,
                          },
                        }),
                      ]
                    )
                  case 4:
                    return h.sent(), [2, !1]
                  case 5:
                    return [2]
                }
              })
            })
          },
          { connection: l.queueConfig, concurrency: 4 }
        )),
          t.uploadWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.uploadWorker.on("failed", function (e, t) {
            console.log(e.id + " has failed with " + t.message)
          })
      },
      533: (e, t, o) => {
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.combineCoverageJob = t.combineCoverageQueue = void 0)
        var n = o(4),
          r = o(686)
        ;(t.combineCoverageQueue = new r.Queue("combinecoverage", { connection: n.queueConfig })),
          (t.combineCoverageJob = function (e, o) {
            return (
              console.log("Adding new combine coverage job for " + e.ref),
              t.combineCoverageQueue.add(
                "combinecoverage",
                { commit: e, testInstance: o },
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
      673: function (e, t, o) {
        var n =
            (this && this.__createBinding) ||
            (Object.create
              ? function (e, t, o, n) {
                  void 0 === n && (n = o),
                    Object.defineProperty(e, n, {
                      enumerable: !0,
                      get: function () {
                        return t[o]
                      },
                    })
                }
              : function (e, t, o, n) {
                  void 0 === n && (n = o), (e[n] = t[o])
                }),
          r =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var o in e)
                "default" === o || Object.prototype.hasOwnProperty.call(t, o) || n(t, e, o)
            }
        Object.defineProperty(t, "__esModule", { value: !0 })
        var i = o(21),
          a = o(212),
          c = i.enhancePrisma(a.PrismaClient)
        r(o(212), t), (t.default = new c())
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
    n = {}
  function r(e) {
    var t = n[e]
    if (void 0 !== t) return t.exports
    var i = (n[e] = { exports: {} })
    return o[e].call(i.exports, i, i.exports, r), i.exports
  }
  ;(e = r(914)),
    (t = r(801)),
    e.uploadWorker.resume(),
    t.combineCoverageWorker.resume(),
    console.log("started")
})()

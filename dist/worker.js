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
                    for (var i in (t = arguments[o]))
                      Object.prototype.hasOwnProperty.call(t, i) && (e[i] = t[i])
                  return e
                }).apply(this, arguments)
            },
          i =
            (this && this.__awaiter) ||
            function (e, t, o, n) {
              return new (o || (o = Promise))(function (i, r) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? i(e.value)
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
                i,
                r,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1]
                    return i[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (r = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (r[Symbol.iterator] = function () {
                    return this
                  }),
                r
              )
              function c(r) {
                return function (c) {
                  return (function (r) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (i =
                              2 & r[0]
                                ? n.return
                                : r[0]
                                ? n.throw || ((i = n.return) && i.call(n), 0)
                                : n.next) &&
                            !(i = i.call(n, r[1])).done)
                        )
                          return i
                        switch (((n = 0), i && (r = [2 & r[0], i.value]), r[0])) {
                          case 0:
                          case 1:
                            i = r
                            break
                          case 4:
                            return a.label++, { value: r[1], done: !1 }
                          case 5:
                            a.label++, (n = r[1]), (r = [0])
                            continue
                          case 7:
                            ;(r = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (i = (i = a.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== r[0] && 2 !== r[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === r[0] && (!i || (r[1] > i[0] && r[1] < i[3]))) {
                              a.label = r[1]
                              break
                            }
                            if (6 === r[0] && a.label < i[1]) {
                              ;(a.label = i[1]), (i = r)
                              break
                            }
                            if (i && a.label < i[2]) {
                              ;(a.label = i[2]), a.ops.push(r)
                              break
                            }
                            i[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        r = t.call(e, a)
                      } catch (e) {
                        ;(r = [6, e]), (n = 0)
                      } finally {
                        o = i = 0
                      }
                    if (5 & r[0]) throw r[1]
                    return { value: r[0] ? r[1] : void 0, done: !0 }
                  })([r, c])
                }
              }
            },
          a =
            (this && this.__spreadArray) ||
            function (e, t) {
              for (var o = 0, n = t.length, i = e.length; o < n; o++, i++) e[i] = t[o]
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
                return i(this, void 0, void 0, function () {
                  var t = this
                  return r(this, function (o) {
                    return [
                      2,
                      new Promise(function (o, i) {
                        l.parseString(e, function (e, r) {
                          var a
                          e && i(e)
                          var c = {
                              coverage: n(n({}, r.coverage.$), {
                                sources: { source: r.coverage.sources[0].source[0] },
                                packages:
                                  null === (a = r.coverage.packages[0].package) || void 0 === a
                                    ? void 0
                                    : a.map(function (e) {
                                        var t
                                        return n(n({}, e.$), {
                                          files:
                                            null === (t = e.classes[0].class) || void 0 === t
                                              ? void 0
                                              : t.map(function (e) {
                                                  var t, o, i, r
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
                                                                var i = o[1].split("/")
                                                                ;(t.conditions = i[1]),
                                                                  (t.coveredConditions = i[0])
                                                              }
                                                            }
                                                            return n({}, t)
                                                          }),
                                                    functions:
                                                      null ===
                                                        (r =
                                                          null === (i = e.methods[0]) ||
                                                          void 0 === i
                                                            ? void 0
                                                            : i.method) || void 0 === r
                                                        ? void 0
                                                        : r.map(function (e) {
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
                    for (var n = t.name.split("."), i = 1; i < n.length; i++) {
                      var r = n.slice(0, i).join(".")
                      o[r] ||
                        ((o[r] = {
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
                          name: r,
                          "line-rate": "0",
                          "branch-rate": "0",
                          files: [],
                          metrics: o[r],
                        }))
                    }
                  }),
                  e.coverage.packages.forEach(function (e) {
                    for (var n = [], i = e.name.split("."), r = 1; r < i.length; r++) {
                      var c = i.slice(0, r).join("."),
                        s = o[c]
                      s && n.push(s)
                    }
                    var l = o[e.name]
                    l && n.push(l),
                      e.files.forEach(function (e) {
                        var o,
                          i,
                          r = (e.metrics = {
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
                            a(a([t], n), [r]).forEach(function (t) {
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
                          null === (i = e.functions) ||
                            void 0 === i ||
                            i.forEach(function (e) {
                              a(a([t], n), [r]).forEach(function (t) {
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
                var i = this.data.coverage.packages.find(function (t) {
                  return t.name === e
                })
                i || ((i = { name: e, files: [] }), this.data.coverage.packages.push(i))
                var r = i.files.find(function (e) {
                  return e.name === t
                })
                r || ((r = { name: t, lines: [], functions: [] }), i.files.push(r))
                var a = r.coverageData ? r.coverageData : s.CoverageData.fromCoberturaFile(r),
                  c = s.CoverageData.fromString(o, n)
                a.merge(c)
                var l = a.toCoberturaFile(),
                  d = l.functions,
                  u = l.lines
                ;(r.lines = u), (r.functions = d), (r.coverageData = a)
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
                i,
                r = new e()
              return (
                null === (n = t.lines) ||
                  void 0 === n ||
                  n.forEach(function (e) {
                    var t, n
                    e.branch
                      ? r.addCoverage(e.number.toString(), {
                          type: "branch",
                          line: e.number,
                          hits: e.hits,
                          conditionals: e.conditions,
                          coveredConditionals: e.coveredConditions,
                          hitsBySource: o ? ((t = {}), (t[o] = e.hits), t) : {},
                        })
                      : r.addCoverage(e.number.toString(), {
                          type: "statement",
                          line: e.number,
                          hits: e.hits,
                          hitsBySource: o ? ((n = {}), (n[o] = e.hits), n) : {},
                        })
                  }),
                null === (i = t.functions) ||
                  void 0 === i ||
                  i.forEach(function (e) {
                    var t
                    r.addCoverage(e.number.toString(), {
                      type: "function",
                      line: e.number,
                      hits: e.hits,
                      signature: e.signature,
                      name: e.name,
                      hitsBySource: o ? ((t = {}), (t[o] = e.hits), t) : {},
                    })
                  }),
                r
              )
            }),
            (e.fromString = function (t, o) {
              var n = new e(),
                i = function (e) {
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
                    r,
                    a,
                    c = e.split(",")
                  switch (c[0]) {
                    case "stmt":
                      var s = i(c[3]),
                        l = parseInt(c[2] || "")
                      n.addCoverage(c[1] || "", {
                        type: "statement",
                        line: parseInt(c[1] || ""),
                        hits: l,
                        hitsBySource: s || (o ? ((t = {}), (t[o] = l), t) : {}),
                      })
                      break
                    case "cond":
                      ;(s = i(c[5])),
                        (l = parseInt(c[2] || "")),
                        n.addCoverage(c[1] || "", {
                          type: "branch",
                          line: parseInt(c[1] || ""),
                          hits: parseInt(c[2] || ""),
                          coveredConditionals: parseInt(c[3] || ""),
                          conditionals: parseInt(c[4] || ""),
                          hitsBySource: s || (o ? ((r = {}), (r[o] = l), r) : {}),
                        })
                      break
                    case "func":
                      ;(s = i(c[5])),
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
                    var i
                    null === (i = t.coverage[e]) ||
                      void 0 === i ||
                      i.forEach(function (e) {
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
                          i = Object.keys(e.hitsBySource)
                            .map(function (t) {
                              return t + "=" + e.hitsBySource[t]
                            })
                            .join(";")
                        "statement" === e.type
                          ? o.push(n + "," + e.line + "," + e.hits + "," + i)
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
                                i
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
                                i
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
                  i = e.coverage[o]
                i && n
                  ? null == i ||
                    i.forEach(function (e) {
                      var i = n.find(function (t) {
                        return t.type === e.type
                      })
                      i
                        ? (Object.keys(e.hitsBySource).forEach(function (t) {
                            var o = e.hitsBySource[t]
                            o && (i.hitsBySource[t] = o)
                          }),
                          (i.hits = i.hits + e.hits),
                          "branch" === i.type &&
                            "branch" === e.type &&
                            (i.coveredConditionals = Math.max(
                              i.coveredConditionals,
                              e.coveredConditionals
                            )))
                        : t.addCoverage(o, e)
                    })
                  : null == i ||
                    i.forEach(function (e) {
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
              return new (o || (o = Promise))(function (i, r) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? i(e.value)
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
                i,
                r,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1]
                    return i[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (r = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (r[Symbol.iterator] = function () {
                    return this
                  }),
                r
              )
              function c(r) {
                return function (c) {
                  return (function (r) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (i =
                              2 & r[0]
                                ? n.return
                                : r[0]
                                ? n.throw || ((i = n.return) && i.call(n), 0)
                                : n.next) &&
                            !(i = i.call(n, r[1])).done)
                        )
                          return i
                        switch (((n = 0), i && (r = [2 & r[0], i.value]), r[0])) {
                          case 0:
                          case 1:
                            i = r
                            break
                          case 4:
                            return a.label++, { value: r[1], done: !1 }
                          case 5:
                            a.label++, (n = r[1]), (r = [0])
                            continue
                          case 7:
                            ;(r = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (i = (i = a.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== r[0] && 2 !== r[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === r[0] && (!i || (r[1] > i[0] && r[1] < i[3]))) {
                              a.label = r[1]
                              break
                            }
                            if (6 === r[0] && a.label < i[1]) {
                              ;(a.label = i[1]), (i = r)
                              break
                            }
                            if (i && a.label < i[2]) {
                              ;(a.label = i[2]), a.ops.push(r)
                              break
                            }
                            i[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        r = t.call(e, a)
                      } catch (e) {
                        ;(r = [6, e]), (n = 0)
                      } finally {
                        o = i = 0
                      }
                    if (5 & r[0]) throw r[1]
                    return { value: r[0] ? r[1] : void 0, done: !0 }
                  })([r, c])
                }
              }
            },
          r =
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
          u = r(o(673))
        ;(t.combineCoverageWorker = new d.Worker(
          "combinecoverage",
          function (e) {
            return n(void 0, void 0, void 0, function () {
              var t,
                o,
                r,
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
                Q,
                R,
                A,
                G,
                J,
                L,
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
                ne
              return i(this, function (ie) {
                switch (ie.label) {
                  case 0:
                    return (
                      (t = e.data),
                      (o = t.commit),
                      (r = t.testInstance),
                      console.log("Executing combine coverage job"),
                      (l = u.default),
                      r
                        ? [
                            4,
                            l.test.findFirst({
                              where: { id: null !== (p = r.testId) && void 0 !== p ? p : void 0 },
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
                            return i(this, function (o) {
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
                          (null === (b = m.data.coverage.metrics) || void 0 === b
                            ? void 0
                            : b.coveredelements) +
                          "/" +
                          (null === (y = m.data.coverage.metrics) || void 0 === y
                            ? void 0
                            : y.elements) +
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
                                (w =
                                  null === (C = m.data.coverage.metrics) || void 0 === C
                                    ? void 0
                                    : C.statements) && void 0 !== w
                                ? w
                                : 0,
                            conditionals:
                              null !==
                                (_ =
                                  null === (k = m.data.coverage.metrics) || void 0 === k
                                    ? void 0
                                    : k.conditionals) && void 0 !== _
                                ? _
                                : 0,
                            methods:
                              null !==
                                (P =
                                  null === (E = m.data.coverage.metrics) || void 0 === E
                                    ? void 0
                                    : E.methods) && void 0 !== P
                                ? P
                                : 0,
                            elements:
                              null !==
                                (j =
                                  null === (S = m.data.coverage.metrics) || void 0 === S
                                    ? void 0
                                    : S.elements) && void 0 !== j
                                ? j
                                : 0,
                            hits:
                              null !==
                                (I =
                                  null === (x = m.data.coverage.metrics) || void 0 === x
                                    ? void 0
                                    : x.hits) && void 0 !== I
                                ? I
                                : 0,
                            coveredStatements:
                              null !==
                                (D =
                                  null === (M = m.data.coverage.metrics) || void 0 === M
                                    ? void 0
                                    : M.coveredstatements) && void 0 !== D
                                ? D
                                : 0,
                            coveredConditionals:
                              null !==
                                (F =
                                  null === (O = m.data.coverage.metrics) || void 0 === O
                                    ? void 0
                                    : O.coveredconditionals) && void 0 !== F
                                ? F
                                : 0,
                            coveredMethods:
                              null !==
                                (q =
                                  null === (B = m.data.coverage.metrics) || void 0 === B
                                    ? void 0
                                    : B.coveredmethods) && void 0 !== q
                                ? q
                                : 0,
                            coveredElements:
                              null !==
                                (N =
                                  null === (W = m.data.coverage.metrics) || void 0 === W
                                    ? void 0
                                    : W.coveredelements) && void 0 !== N
                                ? N
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
                              var t, o, n, r, a, u, v, m, f, h, g, p, b, y, C, w, k, _, E, P, S
                              return i(this, function (i) {
                                return (
                                  (t = e.name.length - e.name.replace(/\./g, "").length),
                                  (o = {
                                    name: e.name,
                                    testId: d.id,
                                    statements:
                                      null !==
                                        (r =
                                          null === (n = e.metrics) || void 0 === n
                                            ? void 0
                                            : n.statements) && void 0 !== r
                                        ? r
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
                                                i,
                                                r,
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
                                                    (i =
                                                      null === (n = e.metrics) || void 0 === n
                                                        ? void 0
                                                        : n.conditionals) && void 0 !== i
                                                    ? i
                                                    : 0,
                                                methods:
                                                  null !==
                                                    (a =
                                                      null === (r = e.metrics) || void 0 === r
                                                        ? void 0
                                                        : r.methods) && void 0 !== a
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
                          return i(this, function (t) {
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
                                  return i(this, function (n) {
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
                          (null === (T = g.data.coverage.metrics) || void 0 === T
                            ? void 0
                            : T.coveredelements) +
                          "/" +
                          (null === ($ = g.data.coverage.metrics) || void 0 === $
                            ? void 0
                            : $.elements) +
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
                                (L =
                                  null === (J = g.data.coverage.metrics) || void 0 === J
                                    ? void 0
                                    : J.methods) && void 0 !== L
                                ? L
                                : 0,
                            elements:
                              null !==
                                (z =
                                  null === (U = g.data.coverage.metrics) || void 0 === U
                                    ? void 0
                                    : U.elements) && void 0 !== z
                                ? z
                                : 0,
                            hits:
                              null !==
                                (K =
                                  null === (H = g.data.coverage.metrics) || void 0 === H
                                    ? void 0
                                    : H.hits) && void 0 !== K
                                ? K
                                : 0,
                            coveredStatements:
                              null !==
                                (X =
                                  null === (V = g.data.coverage.metrics) || void 0 === V
                                    ? void 0
                                    : V.coveredstatements) && void 0 !== X
                                ? X
                                : 0,
                            coveredConditionals:
                              null !==
                                (Z =
                                  null === (Y = g.data.coverage.metrics) || void 0 === Y
                                    ? void 0
                                    : Y.coveredconditionals) && void 0 !== Z
                                ? Z
                                : 0,
                            coveredMethods:
                              null !==
                                (te =
                                  null === (ee = g.data.coverage.metrics) || void 0 === ee
                                    ? void 0
                                    : ee.coveredmethods) && void 0 !== te
                                ? te
                                : 0,
                            coveredElements:
                              null !==
                                (ne =
                                  null === (oe = g.data.coverage.metrics) || void 0 === oe
                                    ? void 0
                                    : oe.coveredelements) && void 0 !== ne
                                ? ne
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
                              var t, n, r, a, d, u, v, m, f, h, g, p, b, y, C, w, k, _, E, P, S
                              return i(this, function (i) {
                                switch (i.label) {
                                  case 0:
                                    return (
                                      (t = e.name.length - e.name.replace(/\./g, "").length),
                                      (n = {
                                        name: e.name,
                                        commitId: o.id,
                                        statements:
                                          null !==
                                            (a =
                                              null === (r = e.metrics) || void 0 === r
                                                ? void 0
                                                : r.statements) && void 0 !== a
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
                                                    i,
                                                    r,
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
                                                        (i =
                                                          null === (n = e.metrics) || void 0 === n
                                                            ? void 0
                                                            : n.conditionals) && void 0 !== i
                                                        ? i
                                                        : 0,
                                                    methods:
                                                      null !==
                                                        (a =
                                                          null === (r = e.metrics) || void 0 === r
                                                            ? void 0
                                                            : r.methods) && void 0 !== a
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
                                    return i.sent(), [2]
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
                              (r ? " and test instance " + r.id : ""),
                          },
                        }),
                      ]
                    )
                  case 11:
                    return ie.sent(), [2, !0]
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
              return new (o || (o = Promise))(function (i, r) {
                function a(e) {
                  try {
                    s(n.next(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function c(e) {
                  try {
                    s(n.throw(e))
                  } catch (e) {
                    r(e)
                  }
                }
                function s(e) {
                  var t
                  e.done
                    ? i(e.value)
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
                i,
                r,
                a = {
                  label: 0,
                  sent: function () {
                    if (1 & i[0]) throw i[1]
                    return i[1]
                  },
                  trys: [],
                  ops: [],
                }
              return (
                (r = { next: c(0), throw: c(1), return: c(2) }),
                "function" == typeof Symbol &&
                  (r[Symbol.iterator] = function () {
                    return this
                  }),
                r
              )
              function c(r) {
                return function (c) {
                  return (function (r) {
                    if (o) throw new TypeError("Generator is already executing.")
                    for (; a; )
                      try {
                        if (
                          ((o = 1),
                          n &&
                            (i =
                              2 & r[0]
                                ? n.return
                                : r[0]
                                ? n.throw || ((i = n.return) && i.call(n), 0)
                                : n.next) &&
                            !(i = i.call(n, r[1])).done)
                        )
                          return i
                        switch (((n = 0), i && (r = [2 & r[0], i.value]), r[0])) {
                          case 0:
                          case 1:
                            i = r
                            break
                          case 4:
                            return a.label++, { value: r[1], done: !1 }
                          case 5:
                            a.label++, (n = r[1]), (r = [0])
                            continue
                          case 7:
                            ;(r = a.ops.pop()), a.trys.pop()
                            continue
                          default:
                            if (
                              !(
                                (i = (i = a.trys).length > 0 && i[i.length - 1]) ||
                                (6 !== r[0] && 2 !== r[0])
                              )
                            ) {
                              a = 0
                              continue
                            }
                            if (3 === r[0] && (!i || (r[1] > i[0] && r[1] < i[3]))) {
                              a.label = r[1]
                              break
                            }
                            if (6 === r[0] && a.label < i[1]) {
                              ;(a.label = i[1]), (i = r)
                              break
                            }
                            if (i && a.label < i[2]) {
                              ;(a.label = i[2]), a.ops.push(r)
                              break
                            }
                            i[2] && a.ops.pop(), a.trys.pop()
                            continue
                        }
                        r = t.call(e, a)
                      } catch (e) {
                        ;(r = [6, e]), (n = 0)
                      } finally {
                        o = i = 0
                      }
                    if (5 & r[0]) throw r[1]
                    return { value: r[0] ? r[1] : void 0, done: !0 }
                  })([r, c])
                }
              }
            },
          r =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.uploadWorker = void 0)
        var a = o(456),
          c = o(93),
          s = o(533),
          l = o(4),
          d = r(o(673)),
          u = o(686)
        ;(t.uploadWorker = new u.Worker(
          "upload",
          function (e) {
            return n(void 0, void 0, void 0, function () {
              var t, o, r, l, u, v, m
              return i(this, function (f) {
                switch (f.label) {
                  case 0:
                    if (
                      ((t = e.data),
                      (o = t.coverageFile),
                      (r = t.commit),
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
                              var t, o, n, r, s, d, m, f, h, g, p, b, y, C, w, k, _, E, P
                              return i(this, function (i) {
                                switch (i.label) {
                                  case 0:
                                    return (
                                      (t = e.name.length - e.name.replace(/\./g, "").length),
                                      (o = {
                                        name: e.name,
                                        testInstanceId: u.id,
                                        statements:
                                          null !==
                                            (r =
                                              null === (n = e.metrics) || void 0 === n
                                                ? void 0
                                                : n.statements) && void 0 !== r
                                            ? r
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
                                                    i,
                                                    r,
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
                                                        (i =
                                                          null === (n = e.metrics) || void 0 === n
                                                            ? void 0
                                                            : n.conditionals) && void 0 !== i
                                                        ? i
                                                        : 0,
                                                    methods:
                                                      null !==
                                                        (s =
                                                          null === (r = e.metrics) || void 0 === r
                                                            ? void 0
                                                            : r.methods) && void 0 !== s
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
                                    return i.sent(), [2]
                                }
                              })
                            })
                          })
                        ),
                      ]
                    )
                  case 1:
                    return (
                      f.sent(),
                      console.log("Inserted all package and file information"),
                      [
                        4,
                        v.jobLog.create({
                          data: {
                            name: "processupload",
                            message:
                              "Processed upload information for commit " +
                              r.id +
                              (u ? " and test instance " + u.id : ""),
                          },
                        }),
                      ]
                    )
                  case 2:
                    return f.sent(), s.combineCoverageJob(r, u), [2]
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
          i = o(686)
        ;(t.combineCoverageQueue = new i.Queue("combinecoverage", { connection: n.queueConfig })),
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
          i =
            (this && this.__exportStar) ||
            function (e, t) {
              for (var o in e)
                "default" === o || Object.prototype.hasOwnProperty.call(t, o) || n(t, e, o)
            }
        Object.defineProperty(t, "__esModule", { value: !0 })
        var r = o(21),
          a = o(212),
          c = r.enhancePrisma(a.PrismaClient)
        i(o(212), t), (t.default = new c())
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
  function i(e) {
    var t = n[e]
    if (void 0 !== t) return t.exports
    var r = (n[e] = { exports: {} })
    return o[e].call(r.exports, r, r.exports, i), r.exports
  }
  ;(e = i(914)),
    (t = i(801)),
    e.uploadWorker.resume(),
    t.combineCoverageWorker.resume(),
    console.log("started")
})()

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
                    c(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  try {
                    c(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, s)
                }
                c((o = o.apply(e, t || [])).next())
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
                (a = { next: s(0), throw: s(1), return: s(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function s(a) {
                return function (s) {
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
                  })([a, s])
                }
              }
            },
          i =
            (this && this.__spreadArray) ||
            function (e, t) {
              for (var n = 0, o = t.length, r = e.length; n < o; n++, r++) e[r] = t[n]
              return e
            },
          s =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoberturaCoverage = void 0)
        var c = n(456),
          l = n(589),
          u = s(n(320)),
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
                    metrics: d,
                    files: u.default
                      .array()
                      .items(
                        u.default.object({
                          name: u.default.string(),
                          filename: u.default.string(),
                          metrics: d,
                          coverageData: u.default.any(),
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
              (e.prototype.init = function (t, n) {
                return r(this, void 0, void 0, function () {
                  var r = this
                  return a(this, function (a) {
                    return [
                      2,
                      new Promise(function (a, i) {
                        l.parseString(t, function (t, s) {
                          var l
                          t && i(t)
                          var u =
                            null === (l = s.coverage.packages[0].package) || void 0 === l
                              ? void 0
                              : l.map(function (e) {
                                  var t,
                                    r = o(o({}, e.$), {
                                      files:
                                        null === (t = e.classes[0].class) || void 0 === t
                                          ? void 0
                                          : t
                                              .map(function (e) {
                                                var t,
                                                  r,
                                                  a,
                                                  i,
                                                  s = o(o({}, e.$), {
                                                    lines:
                                                      (null ===
                                                        (r =
                                                          null === (t = e.lines[0]) || void 0 === t
                                                            ? void 0
                                                            : t.line) || void 0 === r
                                                        ? void 0
                                                        : r.map(function (e) {
                                                            var t = e.$
                                                            if (t["condition-coverage"]) {
                                                              var n = /\(([0-9]+\/[0-9]+)\)/.exec(
                                                                t["condition-coverage"]
                                                              )
                                                              if (n && n[1]) {
                                                                var o = n[1].split("/")
                                                                ;(t.conditions = o[1]),
                                                                  (t.coveredConditions = o[0])
                                                              }
                                                            }
                                                            return "true" === t.branch
                                                              ? {
                                                                  hits: parseInt(t.hits),
                                                                  number: parseInt(t.number),
                                                                  branch: !0,
                                                                  conditions: t.conditions
                                                                    ? parseInt(t.conditions)
                                                                    : void 0,
                                                                  coveredConditions:
                                                                    t.coveredConditions
                                                                      ? parseInt(
                                                                          t.coveredConditions
                                                                        )
                                                                      : void 0,
                                                                  "condition-coverage":
                                                                    t["condition-coverage"],
                                                                }
                                                              : {
                                                                  hits: parseInt(t.hits),
                                                                  number: parseInt(t.number),
                                                                  branch: !1,
                                                                }
                                                          })) || [],
                                                    functions:
                                                      (null ===
                                                        (i =
                                                          null === (a = e.methods[0]) ||
                                                          void 0 === a
                                                            ? void 0
                                                            : a.method) || void 0 === i
                                                        ? void 0
                                                        : i.map(function (e) {
                                                            var t = o(
                                                              o({}, e.$),
                                                              e.lines[0].line[0].$
                                                            )
                                                            return {
                                                              name: t.name,
                                                              hits: parseInt(t.hits),
                                                              signature: t.signature,
                                                              number: parseInt(t.number),
                                                            }
                                                          })) || [],
                                                  })
                                                return (
                                                  delete s["line-rate"],
                                                  delete s["branch-rate"],
                                                  o(o({}, s), {
                                                    coverageData: c.CoverageData.fromCoberturaFile(
                                                      s,
                                                      n
                                                    ),
                                                  })
                                                )
                                              })
                                              .sort(function (e, t) {
                                                return e.name.localeCompare(t.name)
                                              }),
                                    })
                                  return delete r["line-rate"], delete r["branch-rate"], r
                                })
                          u.sort(function (e, t) {
                            return e.name.localeCompare(t.name)
                          })
                          var d = {
                              coverage: o(o({}, s.coverage.$), {
                                sources: { source: s.coverage.sources[0].source[0] },
                                packages: u,
                              }),
                            },
                            f = v.validate(d),
                            m = f.error,
                            h = f.value
                          if (m) throw m
                          e.updateMetrics(h), (r.data = h), a()
                        })
                      }),
                    ]
                  })
                })
              }),
              (e.updateMetrics = function (e) {
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
                    for (
                      var o = t.name.includes(".") ? t.name.split(".") : [t.name], r = 1;
                      r < o.length;
                      r++
                    ) {
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
                        e.coverage.packages.push({ name: a, files: [], metrics: n[a] }))
                    }
                  }),
                  e.coverage.packages.sort(function (e, t) {
                    return e.name.localeCompare(t.name)
                  }),
                  e.coverage.packages.forEach(function (e) {
                    for (
                      var o = [],
                        r = [],
                        a = e.name.includes(".") ? e.name.split(".") : [e.name],
                        s = 1;
                      s < a.length;
                      s++
                    ) {
                      var c = a.slice(0, s).join(".")
                      r.push(c)
                      var l = n[c]
                      l && o.push(l)
                    }
                    r.push(e.name)
                    var u = n[e.name]
                    u && o.push(u),
                      e.files.forEach(function (e) {
                        var r,
                          a,
                          s,
                          c = (e.metrics = {
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
                        null === (r = n.src) || void 0 === r || r.elements,
                          null === (a = e.lines) ||
                            void 0 === a ||
                            a.forEach(function (e) {
                              i(i([t], o), [c]).forEach(function (t) {
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
                          null === (s = e.functions) ||
                            void 0 === s ||
                            s.forEach(function (e) {
                              i(i([t], o), [c]).forEach(function (t) {
                                t.elements++,
                                  t.methods++,
                                  (t.hits += e.hits),
                                  e.hits > 0 && (t.coveredelements++, t.coveredmethods++)
                              })
                            })
                      })
                  }),
                  []
                )
              }),
              (e.prototype.mergeCoverageString = function (e, t, n, o) {
                var r = c.CoverageData.fromString(n, o)
                this.mergeCoverage(e, t, r)
              }),
              (e.prototype.mergeCoverage = function (e, t, n) {
                var o = this.data.coverage.packages.find(function (t) {
                  return t.name === e
                })
                o ||
                  ((o = { name: e, files: [] }),
                  this.data.coverage.packages.push(o),
                  this.data.coverage.packages.sort(function (e, t) {
                    return e.name.localeCompare(t.name)
                  }))
                var r = o.files.find(function (e) {
                  return e.name === t
                })
                if (r) {
                  if (!r.coverageData)
                    throw (
                      (console.log("no coverage data"),
                      new Error("No coverage data defined on file to merge"))
                    )
                  var a = r.coverageData,
                    i = n
                  a.merge(i)
                  var s = a.toCoberturaFile()
                  ;(l = s.functions), (u = s.lines), (r.lines = u), (r.functions = l)
                } else {
                  ;(r = { name: t, lines: [], functions: [], coverageData: n }),
                    o.files.push(r),
                    o.files.sort(function (e, t) {
                      return e.name.localeCompare(t.name)
                    })
                  var c = n.toCoberturaFile(),
                    l = c.functions,
                    u = c.lines
                  ;(r.lines = u), (r.functions = l)
                }
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
              n &&
                (n.push(t),
                n.sort(function (e, t) {
                  var n = e.type.localeCompare(t.type)
                  return 0 === n && "function" === e.type && "function" === t.type
                    ? e.name.localeCompare(t.name)
                    : n
                }))
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
                          conditionals: e.conditions ? e.conditions : 0,
                          coveredConditionals: e.coveredConditions ? e.coveredConditions : 0,
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
                    s = e.trim().split(",")
                  switch (s[0]) {
                    case "stmt":
                      var c = r(s[3]),
                        l = parseInt(s[2] || "")
                      o.addCoverage(s[1] || "", {
                        type: "statement",
                        line: parseInt(s[1] || ""),
                        hits: l,
                        hitsBySource: c || (n ? ((t = {}), (t[n] = l), t) : {}),
                      })
                      break
                    case "cond":
                      ;(c = r(s[5])),
                        (l = parseInt(s[2] || "")),
                        o.addCoverage(s[1] || "", {
                          type: "branch",
                          line: parseInt(s[1] || ""),
                          hits: parseInt(s[2] || ""),
                          coveredConditionals: parseInt(s[3] || ""),
                          conditionals: parseInt(s[4] || ""),
                          hitsBySource: c || (n ? ((a = {}), (a[n] = l), a) : {}),
                        })
                      break
                    case "func":
                      ;(c = r(s[5])),
                        (l = parseInt(s[2] || "")),
                        o.addCoverage(s[1] || "", {
                          type: "function",
                          line: parseInt(s[1] || ""),
                          hits: parseInt(s[2] || ""),
                          signature: s[3] || "",
                          name: s[4] || "",
                          hitsBySource: c || (n ? ((i = {}), (i[n] = l), i) : {}),
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
                      r
                        .sort(function (e, t) {
                          return e.type.localeCompare(t.type)
                        })
                        .forEach(function (e) {
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
                            .sort(function (e, t) {
                              return e.localeCompare(t)
                            })
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
                      var r
                      ;(r =
                        "function" === e.type && e.name
                          ? o.find(function (t) {
                              return t.type === e.type && t.name === e.name
                            })
                          : (e.type,
                            o.find(function (t) {
                              return t.type === e.type
                            })))
                        ? (Object.keys(e.hitsBySource).forEach(function (t) {
                            var n = e.hitsBySource[t]
                            void 0 !== n && (r.hitsBySource[t] = (r.hitsBySource[t] || 0) + n)
                          }),
                          (r.hits = r.hits + e.hits),
                          "branch" === r.type &&
                            "branch" === e.type &&
                            ((r.coveredConditionals = Math.max(
                              r.coveredConditionals,
                              e.coveredConditionals
                            )),
                            (r.conditionals = Math.max(r.conditionals, e.conditionals))))
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
                    c(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  try {
                    c(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, s)
                }
                c((o = o.apply(e, t || [])).next())
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
                (a = { next: s(0), throw: s(1), return: s(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function s(a) {
                return function (s) {
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
                  })([a, s])
                }
              }
            },
          i =
            (this && this.__importDefault) ||
            function (e) {
              return e && e.__esModule ? e : { default: e }
            }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.insertCoverageData = void 0)
        var s = n(456),
          c = n(93),
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
                        var t, r, i, s, l, d, v, f, m, h, g, p, b, y, C, w, k, _, S
                        return a(this, function (a) {
                          return (
                            (t = e.name.length - e.name.replace(/\./g, "").length),
                            (r = o(o({}, n), {
                              name: e.name,
                              statements:
                                null !==
                                  (s =
                                    null === (i = e.metrics) || void 0 === i
                                      ? void 0
                                      : i.statements) && void 0 !== s
                                  ? s
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
                                  (h =
                                    null === (m = e.metrics) || void 0 === m
                                      ? void 0
                                      : m.elements) && void 0 !== h
                                  ? h
                                  : 0,
                              hits: null === (g = e.metrics) || void 0 === g ? void 0 : g.hits,
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
                                  (S =
                                    null === (_ = e.metrics) || void 0 === _
                                      ? void 0
                                      : _.coveredelements) && void 0 !== S
                                  ? S
                                  : 0,
                              coveredPercentage: c.coveredPercentage(e.metrics),
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
                                h,
                                g,
                                p,
                                b,
                                y,
                                C,
                                w,
                                k,
                                _,
                                S,
                                E = s.CoverageData.fromCoberturaFile(n, t)
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
                                hits:
                                  null !==
                                    (m =
                                      null === (v = n.metrics) || void 0 === v ? void 0 : v.hits) &&
                                  void 0 !== m
                                    ? m
                                    : 0,
                                coveredStatements:
                                  null !==
                                    (g =
                                      null === (h = n.metrics) || void 0 === h
                                        ? void 0
                                        : h.coveredstatements) && void 0 !== g
                                    ? g
                                    : 0,
                                coveredConditionals:
                                  null !==
                                    (b =
                                      null === (p = n.metrics) || void 0 === p
                                        ? void 0
                                        : p.coveredconditionals) && void 0 !== b
                                    ? b
                                    : 0,
                                coveredMethods:
                                  null !==
                                    (C =
                                      null === (y = n.metrics) || void 0 === y
                                        ? void 0
                                        : y.coveredmethods) && void 0 !== C
                                    ? C
                                    : 0,
                                coverageData: E.toString(),
                                coveredElements:
                                  null !==
                                    (k =
                                      null === (w = n.metrics) || void 0 === w
                                        ? void 0
                                        : w.coveredelements) && void 0 !== k
                                    ? k
                                    : 0,
                                elements:
                                  null !==
                                    (S =
                                      null === (_ = n.metrics) || void 0 === _
                                        ? void 0
                                        : _.elements) && void 0 !== S
                                    ? S
                                    : 0,
                                coveredPercentage: c.coveredPercentage(n.metrics),
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
                    c(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  try {
                    c(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, s)
                }
                c((o = o.apply(e, t || [])).next())
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
                (a = { next: s(0), throw: s(1), return: s(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function s(a) {
                return function (s) {
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
                  })([a, s])
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
          s = n(93),
          c = n(115),
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
                h,
                g,
                p,
                b,
                y,
                C,
                w,
                k,
                _,
                S,
                E,
                j,
                x,
                I,
                P,
                D,
                M,
                O,
                B,
                F,
                T,
                q,
                N,
                W,
                $,
                z,
                G,
                R,
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
                se,
                ce,
                le,
                ue,
                de
              return r(this, function (ve) {
                switch (ve.label) {
                  case 0:
                    ;(t = e.data),
                      (n = t.commit),
                      (a = t.testInstance),
                      (l = t.namespaceSlug),
                      (u = t.repositorySlug),
                      (v = null),
                      (ve.label = 1)
                  case 1:
                    return (
                      ve.trys.push([1, 14, , 16]),
                      console.log("Executing combine coverage job"),
                      (f = d.default),
                      a
                        ? [
                            4,
                            f.test.findFirst({
                              where: { id: null !== (E = a.testId) && void 0 !== E ? E : void 0 },
                            }),
                          ]
                        : [3, 8]
                    )
                  case 2:
                    if (!(v = ve.sent()))
                      throw new Error("Cannot combine coverage for testInstance without a test")
                    return [
                      4,
                      f.testInstance.aggregate({ _sum: { dataSize: !0 }, where: { testId: v.id } }),
                    ]
                  case 3:
                    if (
                      ((m = ve.sent()),
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
                      f.testInstance.findMany({
                        where: { testId: v.id },
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
                      (h = ve.sent()),
                      (g = new i.CoberturaCoverage()),
                      console.log("Merging coverage information for all test instances"),
                      (p = 0),
                      (b = new Date()),
                      h.forEach(function (e) {
                        e.PackageCoverage.forEach(function (e) {
                          return o(void 0, void 0, void 0, function () {
                            var t
                            return r(this, function (n) {
                              return (
                                null === (t = e.FileCoverage) ||
                                  void 0 === t ||
                                  t.forEach(function (t) {
                                    p++,
                                      g.mergeCoverageString(
                                        e.name,
                                        t.name,
                                        t.coverageData,
                                        null == v ? void 0 : v.testName
                                      )
                                  }),
                                [2]
                              )
                            })
                          })
                        })
                      }),
                      i.CoberturaCoverage.updateMetrics(g.data),
                      console.log(
                        "Combined coverage results for " +
                          p +
                          " files in " +
                          (new Date().getTime() - b.getTime()) +
                          "ms"
                      ),
                      console.log(
                        "Test instance combination with previous test instances result: " +
                          (null === (j = g.data.coverage.metrics) || void 0 === j
                            ? void 0
                            : j.coveredelements) +
                          "/" +
                          (null === (x = g.data.coverage.metrics) || void 0 === x
                            ? void 0
                            : x.elements) +
                          " covered based on " +
                          h.length +
                          " instances"
                      ),
                      console.log("Deleting existing results for test"),
                      [4, f.packageCoverage.deleteMany({ where: { testId: v.id } })]
                    )
                  case 5:
                    return (
                      ve.sent(),
                      console.log("Updating coverage summary data for test"),
                      [
                        4,
                        f.test.update({
                          where: { id: v.id },
                          data: {
                            statements:
                              null !==
                                (P =
                                  null === (I = g.data.coverage.metrics) || void 0 === I
                                    ? void 0
                                    : I.statements) && void 0 !== P
                                ? P
                                : 0,
                            conditionals:
                              null !==
                                (M =
                                  null === (D = g.data.coverage.metrics) || void 0 === D
                                    ? void 0
                                    : D.conditionals) && void 0 !== M
                                ? M
                                : 0,
                            methods:
                              null !==
                                (B =
                                  null === (O = g.data.coverage.metrics) || void 0 === O
                                    ? void 0
                                    : O.methods) && void 0 !== B
                                ? B
                                : 0,
                            elements:
                              null !==
                                (T =
                                  null === (F = g.data.coverage.metrics) || void 0 === F
                                    ? void 0
                                    : F.elements) && void 0 !== T
                                ? T
                                : 0,
                            hits:
                              null !==
                                (N =
                                  null === (q = g.data.coverage.metrics) || void 0 === q
                                    ? void 0
                                    : q.hits) && void 0 !== N
                                ? N
                                : 0,
                            coveredStatements:
                              null !==
                                ($ =
                                  null === (W = g.data.coverage.metrics) || void 0 === W
                                    ? void 0
                                    : W.coveredstatements) && void 0 !== $
                                ? $
                                : 0,
                            coveredConditionals:
                              null !==
                                (G =
                                  null === (z = g.data.coverage.metrics) || void 0 === z
                                    ? void 0
                                    : z.coveredconditionals) && void 0 !== G
                                ? G
                                : 0,
                            coveredMethods:
                              null !==
                                (L =
                                  null === (R = g.data.coverage.metrics) || void 0 === R
                                    ? void 0
                                    : R.coveredmethods) && void 0 !== L
                                ? L
                                : 0,
                            coveredElements:
                              null !==
                                (A =
                                  null === (Q = g.data.coverage.metrics) || void 0 === Q
                                    ? void 0
                                    : Q.coveredelements) && void 0 !== A
                                ? A
                                : 0,
                            coveredPercentage: s.coveredPercentage(g.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 6:
                    return (
                      ve.sent(),
                      console.log("Inserting new package and file coverage for test"),
                      [4, c.insertCoverageData(g.data.coverage, void 0, { testId: v.id })]
                    )
                  case 7:
                    ve.sent(), (ve.label = 8)
                  case 8:
                    if (!n) throw Error("Cannot combine coverage without a commit")
                    return (
                      console.log("Combining test coverage results for commit"),
                      [
                        4,
                        f.test.findMany({
                          where: { commitId: n.id },
                          orderBy: { createdDate: "desc" },
                          include: { PackageCoverage: { include: { FileCoverage: !0 } } },
                        }),
                      ]
                    )
                  case 9:
                    return (
                      (y = ve.sent()),
                      (C = {}),
                      y.forEach(function (e) {
                        C[e.testName] = e
                      }),
                      console.log("Found " + Object.keys(C).length + " tests to combine."),
                      (w = new i.CoberturaCoverage()),
                      (k = 0),
                      (_ = new Date()),
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
                                          k++,
                                            w.mergeCoverageString(
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
                      i.CoberturaCoverage.updateMetrics(w.data),
                      console.log(
                        "Combined coverage results for " +
                          k +
                          " files in " +
                          (new Date().getTime() - _.getTime()) +
                          "ms"
                      ),
                      console.log(
                        "All test combination result " +
                          (null === (J = w.data.coverage.metrics) || void 0 === J
                            ? void 0
                            : J.coveredelements) +
                          "/" +
                          (null === (U = w.data.coverage.metrics) || void 0 === U
                            ? void 0
                            : U.elements) +
                          " covered"
                      ),
                      console.log("Deleting existing results for commit"),
                      [4, f.packageCoverage.deleteMany({ where: { commitId: n.id } })]
                    )
                  case 10:
                    return (
                      ve.sent(),
                      console.log("Updating coverage summary data for commit", n.id),
                      [
                        4,
                        f.commit.update({
                          where: { id: n.id },
                          data: {
                            statements:
                              null !==
                                (K =
                                  null === (H = w.data.coverage.metrics) || void 0 === H
                                    ? void 0
                                    : H.statements) && void 0 !== K
                                ? K
                                : 0,
                            conditionals:
                              null !==
                                (X =
                                  null === (V = w.data.coverage.metrics) || void 0 === V
                                    ? void 0
                                    : V.conditionals) && void 0 !== X
                                ? X
                                : 0,
                            methods:
                              null !==
                                (Z =
                                  null === (Y = w.data.coverage.metrics) || void 0 === Y
                                    ? void 0
                                    : Y.methods) && void 0 !== Z
                                ? Z
                                : 0,
                            elements:
                              null !==
                                (te =
                                  null === (ee = w.data.coverage.metrics) || void 0 === ee
                                    ? void 0
                                    : ee.elements) && void 0 !== te
                                ? te
                                : 0,
                            hits:
                              null !==
                                (oe =
                                  null === (ne = w.data.coverage.metrics) || void 0 === ne
                                    ? void 0
                                    : ne.hits) && void 0 !== oe
                                ? oe
                                : 0,
                            coveredStatements:
                              null !==
                                (ae =
                                  null === (re = w.data.coverage.metrics) || void 0 === re
                                    ? void 0
                                    : re.coveredstatements) && void 0 !== ae
                                ? ae
                                : 0,
                            coveredConditionals:
                              null !==
                                (se =
                                  null === (ie = w.data.coverage.metrics) || void 0 === ie
                                    ? void 0
                                    : ie.coveredconditionals) && void 0 !== se
                                ? se
                                : 0,
                            coveredMethods:
                              null !==
                                (le =
                                  null === (ce = w.data.coverage.metrics) || void 0 === ce
                                    ? void 0
                                    : ce.coveredmethods) && void 0 !== le
                                ? le
                                : 0,
                            coveredElements:
                              null !==
                                (de =
                                  null === (ue = w.data.coverage.metrics) || void 0 === ue
                                    ? void 0
                                    : ue.coveredelements) && void 0 !== de
                                ? de
                                : 0,
                            coveredPercentage: s.coveredPercentage(w.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 11:
                    return (
                      ve.sent(),
                      console.log("Inserting new package and file coverage for commit"),
                      [4, c.insertCoverageData(w.data.coverage, void 0, { commitId: n.id })]
                    )
                  case 12:
                    return (
                      ve.sent(),
                      [
                        4,
                        f.jobLog.create({
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
                                  (null == v ? void 0 : v.testName)
                                : ""),
                          },
                        }),
                      ]
                    )
                  case 13:
                    return ve.sent(), [2, !0]
                  case 14:
                    return (
                      (S = ve.sent()),
                      [
                        4,
                        d.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            namespace: l,
                            repository: u,
                            message:
                              "Failure processing test instance " +
                              n.ref.substr(0, 10) +
                              (a
                                ? " and test instance " +
                                  a.id +
                                  " for test " +
                                  (null == v ? void 0 : v.testName)
                                : "") +
                              ", error " +
                              S.message,
                          },
                        }),
                      ]
                    )
                  case 15:
                    return ve.sent(), [2, !1]
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
                    c(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  try {
                    c(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, s)
                }
                c((o = o.apply(e, t || [])).next())
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
                (a = { next: s(0), throw: s(1), return: s(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function s(a) {
                return function (s) {
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
                  })([a, s])
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
          s = n(533),
          c = n(4),
          l = a(n(673)),
          u = n(686)
        ;(t.uploadWorker = new u.Worker(
          "upload",
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t, n, o, a, c, u, d, v, f, m
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    ;(t = e.data),
                      (n = t.coverageFile),
                      (o = t.commit),
                      (a = t.test),
                      (c = t.testInstance),
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
                      [4, i.insertCoverageData(f, a.testName, { testInstanceId: c.id })]
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
                              (c ? " and test instance " + c.id + " and test" + a.testName : ""),
                          },
                        }),
                      ]
                    )
                  case 3:
                    return r.sent(), s.combineCoverageJob(o, u, d, c), [3, 6]
                  case 4:
                    return (
                      (m = r.sent()),
                      console.error(m),
                      [
                        4,
                        l.default.jobLog.create({
                          data: {
                            name: "processupload",
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
          { connection: c.queueConfig, concurrency: 4 }
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
            },
          a =
            (this && this.__awaiter) ||
            function (e, t, n, o) {
              return new (n || (n = Promise))(function (r, a) {
                function i(e) {
                  try {
                    c(o.next(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function s(e) {
                  try {
                    c(o.throw(e))
                  } catch (e) {
                    a(e)
                  }
                }
                function c(e) {
                  var t
                  e.done
                    ? r(e.value)
                    : ((t = e.value),
                      t instanceof n
                        ? t
                        : new n(function (e) {
                            e(t)
                          })).then(i, s)
                }
                c((o = o.apply(e, t || [])).next())
              })
            },
          i =
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
                (a = { next: s(0), throw: s(1), return: s(2) }),
                "function" == typeof Symbol &&
                  (a[Symbol.iterator] = function () {
                    return this
                  }),
                a
              )
              function s(a) {
                return function (s) {
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
                  })([a, s])
                }
              }
            }
        Object.defineProperty(t, "__esModule", { value: !0 })
        var s = n(21),
          c = n(212),
          l = s.enhancePrisma(c.PrismaClient)
        r(n(212), t)
        var u = new l({ log: [{ emit: "event", level: "query" }] })
        u.$on("query", function (e) {
          return a(void 0, void 0, void 0, function () {
            return i(this, function (e) {
              return [2]
            })
          })
        }),
          (t.default = u)
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

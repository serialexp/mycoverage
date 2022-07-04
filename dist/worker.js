;(() => {
  "use strict"
  var e,
    t,
    n,
    o,
    r = {
      606: function (e, t, n) {
        var o =
            (this && this.__assign) ||
            function () {
              return (
                (o =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, o = arguments.length; n < o; n++)
                      for (var r in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    return e
                  }),
                o.apply(this, arguments)
              )
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
          u = n(589),
          l = s(n(320)),
          d = l.default.object({
            statements: l.default.number(),
            coveredstatements: l.default.number(),
            conditionals: l.default.number(),
            coveredconditionals: l.default.number(),
            methods: l.default.number(),
            coveredmethods: l.default.number(),
            elements: l.default.number(),
            coveredelements: l.default.number(),
          }),
          f = l.default.object({
            coverage: l.default.object({
              "lines-valid": l.default.number(),
              "lines-covered": l.default.number(),
              "line-rate": l.default.number(),
              "branches-valid": l.default.number(),
              "branches-covered": l.default.number(),
              "branch-rate": l.default.number(),
              timestamp: l.default.number(),
              complexity: l.default.number(),
              version: l.default.string(),
              sources: l.default.object({ source: l.default.string() }),
              metrics: d,
              packages: l.default
                .array()
                .items(
                  l.default.object({
                    name: l.default.string(),
                    metrics: d,
                    files: l.default.array().items(
                      l.default.object({
                        name: l.default.string(),
                        filename: l.default.string(),
                        metrics: d,
                        coverageData: l.default.any(),
                        lines: l.default.array().items(
                          l.default.object({
                            branch: l.default.boolean(),
                            number: l.default.number(),
                            hits: l.default.number(),
                            coveredConditions: l.default.number(),
                            conditions: l.default.number(),
                            "condition-coverage": l.default.string(),
                          })
                        ),
                        functions: l.default.array().items(
                          l.default.object({
                            name: l.default.string(),
                            number: l.default.number(),
                            hits: l.default.number(),
                            signature: l.default.string(),
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
          v = (function () {
            function e() {
              this.data = { coverage: { version: "0.1", packages: [] } }
            }
            return (
              (e.prototype.init = function (t, n) {
                return (
                  void 0 === n && (n = {}),
                  r(this, void 0, void 0, function () {
                    var r = this
                    return a(this, function (a) {
                      return [
                        2,
                        new Promise(function (a, i) {
                          u.parseString(t, function (t, s) {
                            var u
                            t && i(t)
                            var l =
                              null === (u = s.coverage.packages[0].package) || void 0 === u
                                ? void 0
                                : u.map(function (e) {
                                    var t,
                                      r = o(o({}, e.$), {
                                        files:
                                          null === (t = e.classes[0].class) || void 0 === t
                                            ? void 0
                                            : t
                                                .map(function (t) {
                                                  var r,
                                                    a,
                                                    i,
                                                    s,
                                                    u =
                                                      e.$.name.replace(/\./g, "/") + "/" + t.$.name,
                                                    l = o(o({}, t.$), {
                                                      lines:
                                                        (null ===
                                                          (a =
                                                            null === (r = t.lines[0]) ||
                                                            void 0 === r
                                                              ? void 0
                                                              : r.line) || void 0 === a
                                                          ? void 0
                                                          : a.map(function (e) {
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
                                                          (s =
                                                            null === (i = t.methods[0]) ||
                                                            void 0 === i
                                                              ? void 0
                                                              : i.method) || void 0 === s
                                                          ? void 0
                                                          : s.map(function (e) {
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
                                                    delete l["line-rate"],
                                                    delete l["branch-rate"],
                                                    o(o({}, l), {
                                                      coverageData:
                                                        c.CoverageData.fromCoberturaFile(l, n[u]),
                                                    })
                                                  )
                                                })
                                                .sort(function (e, t) {
                                                  return e.name.localeCompare(t.name)
                                                }),
                                      })
                                    return delete r["line-rate"], delete r["branch-rate"], r
                                  })
                            l.sort(function (e, t) {
                              return e.name.localeCompare(t.name)
                            })
                            var d = {
                                coverage: o(o({}, s.coverage.$), {
                                  sources: { source: s.coverage.sources[0].source[0] },
                                  packages: l,
                                }),
                              },
                              v = f.validate(d),
                              h = v.error,
                              m = v.value
                            if (h) throw h
                            e.updateMetrics(m), (r.data = m), a()
                          })
                        }),
                      ]
                    })
                  })
                )
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
                      var u = n[c]
                      u && o.push(u)
                    }
                    r.push(e.name)
                    var l = n[e.name]
                    l && o.push(l),
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
              (e.prototype.mergeCoverageBuffer = function (e, t, n) {
                var o = c.CoverageData.fromProtobuf(n)
                this.mergeCoverage(e, t, o)
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
                  ;(u = s.functions), (l = s.lines), (r.lines = l), (r.functions = u)
                } else {
                  ;(r = { name: t, lines: [], functions: [], coverageData: n }),
                    o.files.push(r),
                    o.files.sort(function (e, t) {
                      return e.name.localeCompare(t.name)
                    })
                  var c = n.toCoberturaFile(),
                    u = c.functions,
                    l = c.lines
                  ;(r.lines = l), (r.functions = u)
                }
              }),
              e
            )
          })()
        t.CoberturaCoverage = v
      },
      456: (e, t, n) => {
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.CoverageData = void 0)
        var o = n(973),
          r = (function () {
            function e(e) {
              void 0 === e && (e = {}),
                (this.typeToStringMap = { branch: "cond", statement: "stmt", function: "func" }),
                (this.coverage = e)
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
              (e.prototype.hasSourceHits = function () {
                var e = this
                return Object.keys(this.coverage).some(function (t) {
                  var n = e.coverage[t]
                  return null == n
                    ? void 0
                    : n.some(function (e) {
                        return Object.keys(e.hitsBySource).length > 0
                      })
                })
              }),
              (e.fromCoberturaFile = function (t, n) {
                var o, r
                if (t.coverageData) return t.coverageData
                var a = new e(),
                  i = function (e, t, n) {
                    var o = {}
                    return (
                      null == e ||
                        e.forEach(function (e) {
                          o[e.source] = ("b" === t ? e[t][n] : [e[t][n]]) || []
                        }),
                      o
                    )
                  }
                return (
                  null === (o = t.lines) ||
                    void 0 === o ||
                    o.forEach(function (e) {
                      if (e.branch) {
                        var t = i(n, "b", e.number)
                        a.addCoverage(e.number.toString(), {
                          type: "branch",
                          line: e.number,
                          hits: e.hits,
                          conditionals: e.conditions ? e.conditions : 0,
                          coveredConditionals: e.coveredConditions ? e.coveredConditions : 0,
                          hitsBySource: t,
                        })
                      } else (t = i(n, "s", e.number)), a.addCoverage(e.number.toString(), { type: "statement", line: e.number, hits: e.hits, hitsBySource: t })
                    }),
                  null === (r = t.functions) ||
                    void 0 === r ||
                    r.forEach(function (e) {
                      var t = i(n, "f", e.number)
                      a.addCoverage(e.number.toString(), {
                        type: "function",
                        line: e.number,
                        hits: e.hits,
                        signature: e.signature,
                        name: e.name,
                        hitsBySource: t,
                      })
                    }),
                  a
                )
              }),
              (e.fromString = function (t, n) {
                var o = new e(),
                  r = function (e) {
                    return (
                      (null == e
                        ? void 0
                        : e
                            .split(";")
                            .map(function (e) {
                              return e.split("=")
                            })
                            .reduce(function (e, t, n) {
                              var o
                              return (
                                t[0] &&
                                  t[1] &&
                                  (e[t[0]] =
                                    null === (o = t[1]) || void 0 === o ? void 0 : o.split("|")),
                                e
                              )
                            }, {})) || {}
                    )
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
                          u = parseInt(s[2] || "")
                        o.addCoverage(s[1] || "", {
                          type: "statement",
                          line: parseInt(s[1] || ""),
                          hits: u,
                          hitsBySource: c || (n ? ((t = {}), (t[n] = [u]), t) : {}),
                        })
                        break
                      case "cond":
                        ;(c = r(s[5])),
                          (u = parseInt(s[2] || "")),
                          o.addCoverage(s[1] || "", {
                            type: "branch",
                            line: parseInt(s[1] || ""),
                            hits: parseInt(s[2] || ""),
                            coveredConditionals: parseInt(s[3] || ""),
                            conditionals: parseInt(s[4] || ""),
                            hitsBySource: c || (n ? ((a = {}), (a[n] = [u]), a) : {}),
                          })
                        break
                      case "func":
                        ;(c = r(s[5])),
                          (u = parseInt(s[2] || "")),
                          o.addCoverage(s[1] || "", {
                            type: "function",
                            line: parseInt(s[1] || ""),
                            hits: parseInt(s[2] || ""),
                            signature: s[3] || "",
                            name: s[4] || "",
                            hitsBySource: c || (n ? ((i = {}), (i[n] = [u]), i) : {}),
                          })
                    }
                  }),
                  o
                )
              }),
              (e.prototype.addFunction = function (e, t, n, o, r) {
                void 0 === n && (n = ""),
                  void 0 === o && (o = ""),
                  this.addCoverage(e.toString(), {
                    type: "function",
                    line: e,
                    hits: t,
                    signature: n,
                    name: o,
                    hitsBySource: r,
                  })
              }),
              (e.prototype.addStatement = function (e, t, n) {
                this.addCoverage(e.toString(), {
                  type: "statement",
                  line: e,
                  hits: t,
                  hitsBySource: n,
                })
              }),
              (e.prototype.addBranch = function (e, t, n, o, r) {
                this.addCoverage(e.toString(), {
                  type: "branch",
                  line: e,
                  hits: t,
                  coveredConditionals: n,
                  conditionals: o,
                  hitsBySource: r,
                })
              }),
              (e.fromProtobuf = function (t) {
                var n = o.Coverage.decode(t),
                  r = new e()
                return (
                  n.lineInfo.forEach(function (e) {
                    var t = {}
                    e.hitsBySource.forEach(function (e) {
                      var o = n.sources[e.sourceIndex] || "?"
                      t[o] = e.hits
                    }),
                      e.type === o.LineInformation_LineType.BRANCH
                        ? r.addBranch(e.lineNumber, e.hits, e.coveredBranches, e.branches, t)
                        : e.type === o.LineInformation_LineType.FUNCTION
                        ? r.addFunction(e.lineNumber, e.hits, "", "", t)
                        : r.addStatement(e.lineNumber, e.hits, t)
                  }),
                  r
                )
              }),
              (e.prototype.toProtobuf = function () {
                var e = this,
                  t = []
                Object.keys(this.coverage).forEach(function (n) {
                  var o
                  null === (o = e.coverage[n]) ||
                    void 0 === o ||
                    o.forEach(function (e) {
                      Object.keys(e.hitsBySource).forEach(function (e) {
                        t.includes(e) || t.push(e)
                      })
                    })
                })
                var n = []
                return (
                  Object.keys(this.coverage).forEach(function (r) {
                    var a
                    null === (a = e.coverage[r]) ||
                      void 0 === a ||
                      a.forEach(function (e) {
                        var a = Object.keys(e.hitsBySource).map(function (n) {
                          return { sourceIndex: t.indexOf(n), hits: e.hitsBySource[n] || [0] }
                        })
                        "function" === e.type
                          ? n.push({
                              type: o.LineInformation_LineType.FUNCTION,
                              hits: e.hits,
                              branches: 0,
                              coveredBranches: 0,
                              hitsBySource: a,
                              lineNumber: parseInt(r),
                            })
                          : "statement" === e.type
                          ? n.push({
                              type: o.LineInformation_LineType.STATEMENT,
                              hits: e.hits,
                              branches: 0,
                              coveredBranches: 0,
                              hitsBySource: a,
                              lineNumber: parseInt(r),
                            })
                          : n.push({
                              type: o.LineInformation_LineType.BRANCH,
                              hits: e.hits,
                              branches: e.conditionals,
                              coveredBranches: e.coveredConditionals,
                              hitsBySource: a,
                              lineNumber: parseInt(r),
                            })
                      })
                  }),
                  o.Coverage.encode({ sources: t, lineInfo: n }).finish()
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
                                var n, o
                                return (
                                  null === (n = e.hitsBySource[t]) || void 0 === n
                                    ? void 0
                                    : n.some(function (e) {
                                        return e > 0
                                      })
                                )
                                  ? t +
                                      "=" +
                                      (null === (o = e.hitsBySource[t]) || void 0 === o
                                        ? void 0
                                        : o.join("|"))
                                  : void 0
                              })
                              .filter(function (e) {
                                return e
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
                              r.hitsBySource[t]
                                ? void 0 !== n &&
                                  n.length === r.hitsBySource[t].length &&
                                  (r.hitsBySource[t] = r.hitsBySource[t].map(function (e, t) {
                                    return e + n[t]
                                  }))
                                : (r.hitsBySource[t] = n)
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
        t.CoverageData = r
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
      52: function (e, t, n) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.executeForEachSubpath = void 0)
        var r = o(n(622))
        t.executeForEachSubpath = function (e, t) {
          var n = e.split("/"),
            o = []
          n.forEach(function (e) {
            o.push(e)
            var n = r.default.join.apply(r.default, o)
            t(n)
          })
        }
      },
      569: function (e, t, n) {
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
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.getPathToPackageFileIds = void 0)
        var i = a(n(673))
        t.getPathToPackageFileIds = function (e) {
          return o(this, void 0, void 0, function () {
            var t, n, o, a, s, c
            return r(this, function (r) {
              switch (r.label) {
                case 0:
                  return (
                    (t = {}),
                    (n = {}),
                    [
                      4,
                      i.default.packageCoverage.findMany({
                        select: { id: !0, name: !0 },
                        where: e,
                      }),
                    ]
                  )
                case 1:
                  return (
                    (o = r.sent()),
                    (a = o.map(function (e) {
                      return e.id
                    })),
                    o.forEach(function (e) {
                      var o = e.name.replace(/\./g, "/")
                      ;(t[e.id] = o), (n[o] = e.id)
                    }),
                    console.log("Found " + o.length + " packageCoverage items to check"),
                    [
                      4,
                      i.default.fileCoverage.findMany({
                        select: { id: !0, packageCoverageId: !0, name: !0 },
                        where: { packageCoverageId: { in: a } },
                      }),
                    ]
                  )
                case 2:
                  return (
                    (s = r.sent()),
                    console.log("Found " + s.length + " fileCoverage items to check"),
                    (c = {}),
                    s.forEach(function (e) {
                      var n = e.packageCoverageId ? t[e.packageCoverageId] : void 0
                      n && (c[n + "/" + e.name] = e.id)
                    }),
                    [2, { packageIdToPath: t, packagePathToId: n, pathToFileId: c }]
                  )
              }
            })
          })
        }
      },
      115: function (e, t, n) {
        var o =
            (this && this.__assign) ||
            function () {
              return (
                (o =
                  Object.assign ||
                  function (e) {
                    for (var t, n = 1, o = arguments.length; n < o; n++)
                      for (var r in (t = arguments[n]))
                        Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r])
                    return e
                  }),
                o.apply(this, arguments)
              )
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
          u = i(n(673))
        t.insertCoverageData = function (e, t) {
          return r(void 0, void 0, void 0, function () {
            var n,
              r,
              i,
              l,
              d,
              f,
              v,
              h,
              m,
              g,
              p,
              b,
              y,
              w,
              C,
              I,
              k,
              S,
              _,
              T,
              E,
              x,
              N,
              B,
              O,
              P,
              M,
              j,
              D,
              F,
              L,
              q,
              R,
              W,
              A,
              J,
              U,
              H,
              G,
              $,
              z,
              Q,
              Z,
              K,
              V,
              X,
              Y,
              ee,
              te,
              ne,
              oe,
              re,
              ae,
              ie,
              se,
              ce
            return a(this, function (a) {
              switch (a.label) {
                case 0:
                  for (n = u.default, r = [], i = [], l = 0, d = e.packages; l < d.length; l++)
                    (b = d[l]),
                      (f = b.name.length - b.name.replace(/\./g, "").length),
                      (v = o(o({}, t), {
                        name: b.name,
                        statements:
                          null !==
                            (N =
                              null === (x = b.metrics) || void 0 === x ? void 0 : x.statements) &&
                          void 0 !== N
                            ? N
                            : 0,
                        conditionals:
                          null !==
                            (O =
                              null === (B = b.metrics) || void 0 === B ? void 0 : B.conditionals) &&
                          void 0 !== O
                            ? O
                            : 0,
                        methods:
                          null !==
                            (M = null === (P = b.metrics) || void 0 === P ? void 0 : P.methods) &&
                          void 0 !== M
                            ? M
                            : 0,
                        elements:
                          null !==
                            (D = null === (j = b.metrics) || void 0 === j ? void 0 : j.elements) &&
                          void 0 !== D
                            ? D
                            : 0,
                        hits: null === (F = b.metrics) || void 0 === F ? void 0 : F.hits,
                        coveredStatements:
                          null !==
                            (q =
                              null === (L = b.metrics) || void 0 === L
                                ? void 0
                                : L.coveredstatements) && void 0 !== q
                            ? q
                            : 0,
                        coveredConditionals:
                          null !==
                            (W =
                              null === (R = b.metrics) || void 0 === R
                                ? void 0
                                : R.coveredconditionals) && void 0 !== W
                            ? W
                            : 0,
                        coveredMethods:
                          null !==
                            (J =
                              null === (A = b.metrics) || void 0 === A
                                ? void 0
                                : A.coveredmethods) && void 0 !== J
                            ? J
                            : 0,
                        coveredElements:
                          null !==
                            (H =
                              null === (U = b.metrics) || void 0 === U
                                ? void 0
                                : U.coveredelements) && void 0 !== H
                            ? H
                            : 0,
                        coveredPercentage: c.coveredPercentage(b.metrics),
                        depth: f,
                      })),
                      r.push(v)
                  return (
                    console.log("Creating all packages"),
                    [4, n.packageCoverage.createMany({ data: r })]
                  )
                case 1:
                  return (
                    a.sent(),
                    console.log("Retrieving created package ids", t),
                    [
                      4,
                      n.packageCoverage.findMany({ select: { id: !0, name: !0 }, where: o({}, t) }),
                    ]
                  )
                case 2:
                  for (
                    h = a.sent(),
                      m = {},
                      h.forEach(function (e) {
                        m[e.name] = e.id
                      }),
                      console.log("Converting coverage data to insert format"),
                      g = 0,
                      p = e.packages;
                    g < p.length;
                    g++
                  )
                    for (b = p[g], y = 0, w = b.files; y < w.length; y++)
                      (C = w[y]),
                        (I = new s.CoverageData(C.coverageData.coverage)),
                        i.push({
                          name: C.name,
                          packageCoverageId: m[b.name],
                          statements:
                            null !==
                              ($ =
                                null === (G = C.metrics) || void 0 === G ? void 0 : G.statements) &&
                            void 0 !== $
                              ? $
                              : 0,
                          conditionals:
                            null !==
                              (Q =
                                null === (z = C.metrics) || void 0 === z
                                  ? void 0
                                  : z.conditionals) && void 0 !== Q
                              ? Q
                              : 0,
                          methods:
                            null !==
                              (K = null === (Z = C.metrics) || void 0 === Z ? void 0 : Z.methods) &&
                            void 0 !== K
                              ? K
                              : 0,
                          hits:
                            null !==
                              (X = null === (V = C.metrics) || void 0 === V ? void 0 : V.hits) &&
                            void 0 !== X
                              ? X
                              : 0,
                          coveredStatements:
                            null !==
                              (ee =
                                null === (Y = C.metrics) || void 0 === Y
                                  ? void 0
                                  : Y.coveredstatements) && void 0 !== ee
                              ? ee
                              : 0,
                          coveredConditionals:
                            null !==
                              (ne =
                                null === (te = C.metrics) || void 0 === te
                                  ? void 0
                                  : te.coveredconditionals) && void 0 !== ne
                              ? ne
                              : 0,
                          coveredMethods:
                            null !==
                              (re =
                                null === (oe = C.metrics) || void 0 === oe
                                  ? void 0
                                  : oe.coveredmethods) && void 0 !== re
                              ? re
                              : 0,
                          coverageData: Buffer.from(I.toProtobuf()),
                          coveredElements:
                            null !==
                              (ie =
                                null === (ae = C.metrics) || void 0 === ae
                                  ? void 0
                                  : ae.coveredelements) && void 0 !== ie
                              ? ie
                              : 0,
                          elements:
                            null !==
                              (ce =
                                null === (se = C.metrics) || void 0 === se
                                  ? void 0
                                  : se.elements) && void 0 !== ce
                              ? ce
                              : 0,
                          coveredPercentage: c.coveredPercentage(C.metrics),
                        })
                  console.log("Inserting file coverage data"),
                    (k = 3e6),
                    (S = 0),
                    (_ = []),
                    (T = 0),
                    (a.label = 3)
                case 3:
                  return T < i.length
                    ? ((E = i[T]),
                      S + E.coverageData.byteLength < k
                        ? (_.push(E), (S += E.coverageData.byteLength), [3, 6])
                        : [3, 4])
                    : [3, 7]
                case 4:
                  return [4, n.fileCoverage.createMany({ data: _ })]
                case 5:
                  a.sent(),
                    console.log("Inserted coverage data for " + _.length + " items"),
                    (_ = [E]),
                    (S = E.coverageData.byteLength),
                    (a.label = 6)
                case 6:
                  return T++, [3, 3]
                case 7:
                  return [4, n.fileCoverage.createMany({ data: _ })]
                case 8:
                  return (
                    a.sent(), console.log("Inserted coverage data for " + _.length + " items"), [2]
                  )
              }
            })
          })
        }
      },
      973: function (e, t, n) {
        var o =
          (this && this.__importDefault) ||
          function (e) {
            return e && e.__esModule ? e : { default: e }
          }
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.HitsBySource =
            t.LineInformation =
            t.Coverage =
            t.lineInformation_LineTypeToJSON =
            t.lineInformation_LineTypeFromJSON =
            t.LineInformation_LineType =
            t.protobufPackage =
              void 0)
        var r,
          a = o(n(835)),
          i = o(n(743))
        function s(e) {
          switch (e) {
            case 0:
            case "STATEMENT":
              return r.STATEMENT
            case 1:
            case "BRANCH":
              return r.BRANCH
            case 2:
            case "FUNCTION":
              return r.FUNCTION
            default:
              return r.UNRECOGNIZED
          }
        }
        function c(e) {
          switch (e) {
            case r.STATEMENT:
              return "STATEMENT"
            case r.BRANCH:
              return "BRANCH"
            case r.FUNCTION:
              return "FUNCTION"
            default:
              return "UNKNOWN"
          }
        }
        ;(t.protobufPackage = ""),
          (function (e) {
            ;(e[(e.STATEMENT = 0)] = "STATEMENT"),
              (e[(e.BRANCH = 1)] = "BRANCH"),
              (e[(e.FUNCTION = 2)] = "FUNCTION"),
              (e[(e.UNRECOGNIZED = -1)] = "UNRECOGNIZED")
          })((r = t.LineInformation_LineType || (t.LineInformation_LineType = {}))),
          (t.lineInformation_LineTypeFromJSON = s),
          (t.lineInformation_LineTypeToJSON = c),
          (t.Coverage = {
            encode: function (e, n) {
              void 0 === n && (n = i.default.Writer.create())
              for (var o = 0, r = e.sources; o < r.length; o++) {
                var a = r[o]
                n.uint32(10).string(a)
              }
              for (var s = 0, c = e.lineInfo; s < c.length; s++)
                (a = c[s]), t.LineInformation.encode(a, n.uint32(18).fork()).ldelim()
              return n
            },
            decode: function (e, n) {
              for (
                var o = e instanceof i.default.Reader ? e : new i.default.Reader(e),
                  r = void 0 === n ? o.len : o.pos + n,
                  a = { sources: [], lineInfo: [] };
                o.pos < r;

              ) {
                var s = o.uint32()
                switch (s >>> 3) {
                  case 1:
                    a.sources.push(o.string())
                    break
                  case 2:
                    a.lineInfo.push(t.LineInformation.decode(o, o.uint32()))
                    break
                  default:
                    o.skipType(7 & s)
                }
              }
              return a
            },
            fromJSON: function (e) {
              var n,
                o,
                r = { sources: [], lineInfo: [] }
              return (
                (r.sources = (null !== (n = e.sources) && void 0 !== n ? n : []).map(function (e) {
                  return String(e)
                })),
                (r.lineInfo = (null !== (o = e.lineInfo) && void 0 !== o ? o : []).map(function (
                  e
                ) {
                  return t.LineInformation.fromJSON(e)
                })),
                r
              )
            },
            toJSON: function (e) {
              var n = {}
              return (
                e.sources
                  ? (n.sources = e.sources.map(function (e) {
                      return e
                    }))
                  : (n.sources = []),
                e.lineInfo
                  ? (n.lineInfo = e.lineInfo.map(function (e) {
                      return e ? t.LineInformation.toJSON(e) : void 0
                    }))
                  : (n.lineInfo = []),
                n
              )
            },
            fromPartial: function (e) {
              var n,
                o,
                r = { sources: [], lineInfo: [] }
              return (
                (r.sources =
                  (null === (n = e.sources) || void 0 === n
                    ? void 0
                    : n.map(function (e) {
                        return e
                      })) || []),
                (r.lineInfo =
                  (null === (o = e.lineInfo) || void 0 === o
                    ? void 0
                    : o.map(function (e) {
                        return t.LineInformation.fromPartial(e)
                      })) || []),
                r
              )
            },
          }),
          (t.LineInformation = {
            encode: function (e, n) {
              void 0 === n && (n = i.default.Writer.create()),
                0 !== e.type && n.uint32(8).int32(e.type),
                0 !== e.hits && n.uint32(16).int32(e.hits),
                0 !== e.branches && n.uint32(24).int32(e.branches),
                0 !== e.coveredBranches && n.uint32(32).int32(e.coveredBranches)
              for (var o = 0, r = e.hitsBySource; o < r.length; o++) {
                var a = r[o]
                t.HitsBySource.encode(a, n.uint32(42).fork()).ldelim()
              }
              return 0 !== e.lineNumber && n.uint32(48).int32(e.lineNumber), n
            },
            decode: function (e, n) {
              for (
                var o = e instanceof i.default.Reader ? e : new i.default.Reader(e),
                  r = void 0 === n ? o.len : o.pos + n,
                  a = {
                    type: 0,
                    hits: 0,
                    branches: 0,
                    coveredBranches: 0,
                    hitsBySource: [],
                    lineNumber: 0,
                  };
                o.pos < r;

              ) {
                var s = o.uint32()
                switch (s >>> 3) {
                  case 1:
                    a.type = o.int32()
                    break
                  case 2:
                    a.hits = o.int32()
                    break
                  case 3:
                    a.branches = o.int32()
                    break
                  case 4:
                    a.coveredBranches = o.int32()
                    break
                  case 5:
                    a.hitsBySource.push(t.HitsBySource.decode(o, o.uint32()))
                    break
                  case 6:
                    a.lineNumber = o.int32()
                    break
                  default:
                    o.skipType(7 & s)
                }
              }
              return a
            },
            fromJSON: function (e) {
              var n,
                o = {
                  type: 0,
                  hits: 0,
                  branches: 0,
                  coveredBranches: 0,
                  hitsBySource: [],
                  lineNumber: 0,
                }
              return (
                (o.type = void 0 !== e.type && null !== e.type ? s(e.type) : 0),
                (o.hits = void 0 !== e.hits && null !== e.hits ? Number(e.hits) : 0),
                (o.branches =
                  void 0 !== e.branches && null !== e.branches ? Number(e.branches) : 0),
                (o.coveredBranches =
                  void 0 !== e.coveredBranches && null !== e.coveredBranches
                    ? Number(e.coveredBranches)
                    : 0),
                (o.hitsBySource = (null !== (n = e.hitsBySource) && void 0 !== n ? n : []).map(
                  function (e) {
                    return t.HitsBySource.fromJSON(e)
                  }
                )),
                (o.lineNumber =
                  void 0 !== e.lineNumber && null !== e.lineNumber ? Number(e.lineNumber) : 0),
                o
              )
            },
            toJSON: function (e) {
              var n = {}
              return (
                void 0 !== e.type && (n.type = c(e.type)),
                void 0 !== e.hits && (n.hits = Math.round(e.hits)),
                void 0 !== e.branches && (n.branches = Math.round(e.branches)),
                void 0 !== e.coveredBranches && (n.coveredBranches = Math.round(e.coveredBranches)),
                e.hitsBySource
                  ? (n.hitsBySource = e.hitsBySource.map(function (e) {
                      return e ? t.HitsBySource.toJSON(e) : void 0
                    }))
                  : (n.hitsBySource = []),
                void 0 !== e.lineNumber && (n.lineNumber = Math.round(e.lineNumber)),
                n
              )
            },
            fromPartial: function (e) {
              var n,
                o,
                r,
                a,
                i,
                s,
                c = {
                  type: 0,
                  hits: 0,
                  branches: 0,
                  coveredBranches: 0,
                  hitsBySource: [],
                  lineNumber: 0,
                }
              return (
                (c.type = null !== (n = e.type) && void 0 !== n ? n : 0),
                (c.hits = null !== (o = e.hits) && void 0 !== o ? o : 0),
                (c.branches = null !== (r = e.branches) && void 0 !== r ? r : 0),
                (c.coveredBranches = null !== (a = e.coveredBranches) && void 0 !== a ? a : 0),
                (c.hitsBySource =
                  (null === (i = e.hitsBySource) || void 0 === i
                    ? void 0
                    : i.map(function (e) {
                        return t.HitsBySource.fromPartial(e)
                      })) || []),
                (c.lineNumber = null !== (s = e.lineNumber) && void 0 !== s ? s : 0),
                c
              )
            },
          }),
          (t.HitsBySource = {
            encode: function (e, t) {
              void 0 === t && (t = i.default.Writer.create()),
                0 !== e.sourceIndex && t.uint32(8).int32(e.sourceIndex),
                t.uint32(18).fork()
              for (var n = 0, o = e.hits; n < o.length; n++) {
                var r = o[n]
                t.int32(r)
              }
              return t.ldelim(), t
            },
            decode: function (e, t) {
              for (
                var n = e instanceof i.default.Reader ? e : new i.default.Reader(e),
                  o = void 0 === t ? n.len : n.pos + t,
                  r = { sourceIndex: 0, hits: [] };
                n.pos < o;

              ) {
                var a = n.uint32()
                switch (a >>> 3) {
                  case 1:
                    r.sourceIndex = n.int32()
                    break
                  case 2:
                    if (2 == (7 & a))
                      for (var s = n.uint32() + n.pos; n.pos < s; ) r.hits.push(n.int32())
                    else r.hits.push(n.int32())
                    break
                  default:
                    n.skipType(7 & a)
                }
              }
              return r
            },
            fromJSON: function (e) {
              var t,
                n = { sourceIndex: 0, hits: [] }
              return (
                (n.sourceIndex =
                  void 0 !== e.sourceIndex && null !== e.sourceIndex ? Number(e.sourceIndex) : 0),
                (n.hits = (null !== (t = e.hits) && void 0 !== t ? t : []).map(function (e) {
                  return Number(e)
                })),
                n
              )
            },
            toJSON: function (e) {
              var t = {}
              return (
                void 0 !== e.sourceIndex && (t.sourceIndex = Math.round(e.sourceIndex)),
                e.hits
                  ? (t.hits = e.hits.map(function (e) {
                      return Math.round(e)
                    }))
                  : (t.hits = []),
                t
              )
            },
            fromPartial: function (e) {
              var t,
                n,
                o = { sourceIndex: 0, hits: [] }
              return (
                (o.sourceIndex = null !== (t = e.sourceIndex) && void 0 !== t ? t : 0),
                (o.hits =
                  (null === (n = e.hits) || void 0 === n
                    ? void 0
                    : n.map(function (e) {
                        return e
                      })) || []),
                o
              )
            },
          }),
          i.default.util.Long !== a.default &&
            ((i.default.util.Long = a.default), i.default.configure())
      },
      960: function (e, t, n) {
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
        Object.defineProperty(t, "__esModule", { value: !0 }),
          (t.setSetting = t.getSetting = void 0)
        var i = a(n(673))
        ;(t.getSetting = function (e) {
          return o(void 0, void 0, void 0, function () {
            var t
            return r(this, function (n) {
              switch (n.label) {
                case 0:
                  return [4, i.default.setting.findFirst({ where: { name: e } })]
                case 1:
                  return [2, null == (t = n.sent()) ? void 0 : t.value]
              }
            })
          })
        }),
          (t.setSetting = function (e, t) {
            return o(void 0, void 0, void 0, function () {
              return r(this, function (n) {
                return [
                  2,
                  i.default.setting.upsert({
                    where: { name: e },
                    create: { name: e, value: t },
                    update: { value: t },
                  }),
                ]
              })
            })
          })
      },
      742: function (e, t, n) {
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
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.changefrequencyWorker = void 0)
        var i = n(52),
          s = n(569),
          c = n(4),
          u = a(n(673)),
          l = n(686),
          d = "changefrequency"
        ;(t.changefrequencyWorker = new l.Worker(
          d,
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t, n, o, a, c, l, f, v, h, m, g, p, b
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    ;(t = new Date()),
                      (n = e.data),
                      (o = n.postData),
                      (a = n.commit),
                      (c = n.namespaceSlug),
                      (l = n.repositorySlug),
                      (r.label = 1)
                  case 1:
                    return (
                      r.trys.push([1, 6, , 8]),
                      console.log("changes", o),
                      [4, s.getPathToPackageFileIds({ commitId: a.id })]
                    )
                  case 2:
                    return (
                      (f = r.sent()),
                      (v = f.packagePathToId),
                      (h = f.pathToFileId),
                      (m = f.packageIdToPath),
                      (g = {}),
                      (p = 0),
                      [
                        4,
                        Promise.all(
                          Object.keys(o.changes).map(function (e) {
                            var t,
                              n,
                              r,
                              a =
                                (null === (t = o.changes[e]) || void 0 === t
                                  ? void 0
                                  : t.changes) || 0
                            if (!Number.isInteger(a))
                              throw new Error(
                                "Invalid change count for " +
                                  e +
                                  ": " +
                                  JSON.stringify(o.changes[e])
                              )
                            i.executeForEachSubpath(e, function (e) {
                              var t = v[e]
                              t && (g[t] || (g[t] = 0), (g[t] += a))
                            }),
                              (p += a)
                            var s = h[e]
                            return s
                              ? (console.log(
                                  "Found " +
                                    a +
                                    " " +
                                    (null === (n = o.changes[e]) || void 0 === n
                                      ? void 0
                                      : n.percentage) +
                                    " for " +
                                    e +
                                    " (id " +
                                    s +
                                    ")"
                                ),
                                u.default.fileCoverage
                                  .updateMany({
                                    where: { id: s },
                                    data: {
                                      changes: a,
                                      changeRatio:
                                        null === (r = o.changes[e]) || void 0 === r
                                          ? void 0
                                          : r.percentage,
                                    },
                                  })
                                  .then(function (e) {}))
                              : Promise.resolve()
                          })
                        ),
                      ]
                    )
                  case 3:
                    return (
                      r.sent(),
                      [
                        4,
                        Promise.all(
                          Object.keys(g).map(function (e) {
                            return (
                              console.log(
                                "Updating packageCoverage " +
                                  m[e] +
                                  " to " +
                                  g[e] +
                                  " / " +
                                  (g[e] / p) * 100 +
                                  "%"
                              ),
                              u.default.packageCoverage.update({
                                where: { id: parseInt(e) },
                                data: { changes: g[e], changeRatio: (g[e] / p) * 100 },
                              })
                            )
                          })
                        ),
                      ]
                    )
                  case 4:
                    return (
                      r.sent(),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: d,
                            commitRef: a.ref,
                            namespace: c,
                            repository: l,
                            message:
                              "Processed changefrequency information for commit " +
                              a.ref.substr(0, 10),
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 5:
                    return r.sent(), [3, 8]
                  case 6:
                    return (
                      (b = r.sent()),
                      console.error(b),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: d,
                            commitRef: a.ref,
                            namespace: c,
                            repository: l,
                            message:
                              "Failure processing changefrequency information for " +
                              a.ref.substr(0, 10) +
                              ": " +
                              b.message,
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 7:
                    return r.sent(), [2, !1]
                  case 8:
                    return [2]
                }
              })
            })
          },
          { connection: c.queueConfig, concurrency: 1 }
        )),
          t.changefrequencyWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.changefrequencyWorker.on("failed", function (e, t) {
            console.log(e.id + " has failed with " + t.message)
          })
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
          u = n(960),
          l = n(4),
          d = n(686),
          f = a(n(673))
        ;(t.combineCoverageWorker = new d.Worker(
          "combinecoverage",
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t,
                n,
                a,
                l,
                d,
                v,
                h,
                m,
                g,
                p,
                b,
                y,
                w,
                C,
                I,
                k,
                S,
                _,
                T,
                E,
                x,
                N,
                B,
                O,
                P,
                M,
                j,
                D,
                F,
                L,
                q,
                R,
                W,
                A,
                J,
                U,
                H,
                G,
                $,
                z,
                Q,
                Z,
                K,
                V,
                X,
                Y,
                ee,
                te,
                ne,
                oe,
                re,
                ae,
                ie,
                se,
                ce,
                ue,
                le,
                de,
                fe,
                ve,
                he
              return r(this, function (me) {
                switch (me.label) {
                  case 0:
                    ;(t = new Date()),
                      (n = e.data),
                      (a = n.commit),
                      (l = n.testInstance),
                      (d = n.namespaceSlug),
                      (v = n.repositorySlug),
                      (h = null),
                      (me.label = 1)
                  case 1:
                    return (
                      me.trys.push([1, 15, , 17]),
                      console.log("Executing combine coverage job"),
                      (m = f.default),
                      l
                        ? [
                            4,
                            m.test.findFirst({
                              where: { id: null !== (x = l.testId) && void 0 !== x ? x : void 0 },
                            }),
                          ]
                        : [3, 9]
                    )
                  case 2:
                    if (!(h = me.sent()))
                      throw new Error("Cannot combine coverage for testInstance without a test")
                    return [
                      4,
                      m.testInstance.aggregate({ _sum: { dataSize: !0 }, where: { testId: h.id } }),
                    ]
                  case 3:
                    return (
                      (g = me.sent()),
                      console.log(
                        "test: Total size of combinable data estimated at: " +
                          (g._sum.dataSize || 0) / 1024 / 1024 +
                          "MB"
                      ),
                      [4, u.getSetting("max-combine-coverage-size")]
                    )
                  case 4:
                    if (
                      ((p = me.sent()),
                      (b = parseInt(p || "100")),
                      g && g._sum.dataSize && g._sum.dataSize > 1024 * b * 1024)
                    )
                      throw new Error(
                        "Data to combine is " +
                          Math.ceil(g._sum.dataSize / 1024 / 1024) +
                          ", maximum is " +
                          b +
                          ", cancelling."
                      )
                    return [
                      4,
                      m.testInstance.findMany({
                        where: { testId: h.id },
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
                  case 5:
                    return (
                      (y = me.sent()),
                      (w = new i.CoberturaCoverage()),
                      console.log(
                        "test: Merging coverage information for " + y.length + " test instances"
                      ),
                      (C = new Date()),
                      y.forEach(function (e) {
                        var t = 0,
                          n = 0
                        e.PackageCoverage.forEach(function (e) {
                          return o(void 0, void 0, void 0, function () {
                            var o
                            return r(this, function (r) {
                              return (
                                t++,
                                null === (o = e.FileCoverage) ||
                                  void 0 === o ||
                                  o.forEach(function (t) {
                                    n++, w.mergeCoverageBuffer(e.name, t.name, t.coverageData)
                                  }),
                                [2]
                              )
                            })
                          })
                        }),
                          console.log(
                            "test: Merged " +
                              t +
                              " packages and " +
                              n +
                              " files for instance index " +
                              e.index +
                              " " +
                              e.id
                          )
                      }),
                      i.CoberturaCoverage.updateMetrics(w.data),
                      console.log(
                        "test: Combined coverage results for files in " +
                          (new Date().getTime() - C.getTime()) +
                          "ms"
                      ),
                      console.log(
                        "test: Test instance combination with previous test instances result: " +
                          (null === (N = w.data.coverage.metrics) || void 0 === N
                            ? void 0
                            : N.coveredelements) +
                          "/" +
                          (null === (B = w.data.coverage.metrics) || void 0 === B
                            ? void 0
                            : B.elements) +
                          " covered based on " +
                          y.length +
                          " instances"
                      ),
                      console.log("test: Deleting existing results for test " + h.testName),
                      [4, m.packageCoverage.deleteMany({ where: { testId: h.id } })]
                    )
                  case 6:
                    return (
                      me.sent(),
                      console.log("test: Updating coverage summary data for test " + h.testName),
                      [
                        4,
                        m.test.update({
                          where: { id: h.id },
                          data: {
                            statements:
                              null !==
                                (P =
                                  null === (O = w.data.coverage.metrics) || void 0 === O
                                    ? void 0
                                    : O.statements) && void 0 !== P
                                ? P
                                : 0,
                            conditionals:
                              null !==
                                (j =
                                  null === (M = w.data.coverage.metrics) || void 0 === M
                                    ? void 0
                                    : M.conditionals) && void 0 !== j
                                ? j
                                : 0,
                            methods:
                              null !==
                                (F =
                                  null === (D = w.data.coverage.metrics) || void 0 === D
                                    ? void 0
                                    : D.methods) && void 0 !== F
                                ? F
                                : 0,
                            elements:
                              null !==
                                (q =
                                  null === (L = w.data.coverage.metrics) || void 0 === L
                                    ? void 0
                                    : L.elements) && void 0 !== q
                                ? q
                                : 0,
                            hits:
                              null !==
                                (W =
                                  null === (R = w.data.coverage.metrics) || void 0 === R
                                    ? void 0
                                    : R.hits) && void 0 !== W
                                ? W
                                : 0,
                            coveredStatements:
                              null !==
                                (J =
                                  null === (A = w.data.coverage.metrics) || void 0 === A
                                    ? void 0
                                    : A.coveredstatements) && void 0 !== J
                                ? J
                                : 0,
                            coveredConditionals:
                              null !==
                                (H =
                                  null === (U = w.data.coverage.metrics) || void 0 === U
                                    ? void 0
                                    : U.coveredconditionals) && void 0 !== H
                                ? H
                                : 0,
                            coveredMethods:
                              null !==
                                ($ =
                                  null === (G = w.data.coverage.metrics) || void 0 === G
                                    ? void 0
                                    : G.coveredmethods) && void 0 !== $
                                ? $
                                : 0,
                            coveredElements:
                              null !==
                                (Q =
                                  null === (z = w.data.coverage.metrics) || void 0 === z
                                    ? void 0
                                    : z.coveredelements) && void 0 !== Q
                                ? Q
                                : 0,
                            coveredPercentage: s.coveredPercentage(w.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 7:
                    return (
                      me.sent(),
                      console.log(
                        "test: Inserting new package and file coverage for test " + h.testName
                      ),
                      [4, c.insertCoverageData(w.data.coverage, { testId: h.id })]
                    )
                  case 8:
                    me.sent(), (me.label = 9)
                  case 9:
                    if (!a) throw Error("Cannot combine coverage without a commit")
                    return (
                      console.log("commit: Combining test coverage results for commit"),
                      [
                        4,
                        m.test.findMany({
                          where: { commitId: a.id },
                          orderBy: { createdDate: "desc" },
                          include: { PackageCoverage: { include: { FileCoverage: !0 } } },
                        }),
                      ]
                    )
                  case 10:
                    return (
                      (I = me.sent()),
                      (k = {}),
                      I.forEach(function (e) {
                        k[e.testName] = e
                      }),
                      console.log("commit: Found " + Object.keys(k).length + " tests to combine."),
                      (S = new i.CoberturaCoverage()),
                      (_ = 0),
                      (T = new Date()),
                      Object.values(k).forEach(function (e) {
                        return o(void 0, void 0, void 0, function () {
                          return r(this, function (t) {
                            return (
                              console.log(
                                "commit: Combining: " +
                                  e.testName +
                                  " with " +
                                  e.coveredElements +
                                  "/" +
                                  e.elements +
                                  " covered",
                                e.PackageCoverage.length + " packages"
                              ),
                              e.PackageCoverage.forEach(function (e) {
                                return o(void 0, void 0, void 0, function () {
                                  var t
                                  return r(this, function (n) {
                                    return (
                                      null === (t = e.FileCoverage) ||
                                        void 0 === t ||
                                        t.forEach(function (t) {
                                          _++, S.mergeCoverageBuffer(e.name, t.name, t.coverageData)
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
                      i.CoberturaCoverage.updateMetrics(S.data),
                      console.log(
                        "commit: Combined coverage results for " +
                          _ +
                          " files in " +
                          (new Date().getTime() - T.getTime()) +
                          "ms"
                      ),
                      console.log(
                        "commit: All test combination result " +
                          (null === (Z = S.data.coverage.metrics) || void 0 === Z
                            ? void 0
                            : Z.coveredelements) +
                          "/" +
                          (null === (K = S.data.coverage.metrics) || void 0 === K
                            ? void 0
                            : K.elements) +
                          " covered"
                      ),
                      console.log("commit: Deleting existing results for commit"),
                      [4, m.packageCoverage.deleteMany({ where: { commitId: a.id } })]
                    )
                  case 11:
                    return (
                      me.sent(),
                      console.log("commit: Updating coverage summary data for commit", a.id),
                      [
                        4,
                        m.commit.update({
                          where: { id: a.id },
                          data: {
                            statements:
                              null !==
                                (X =
                                  null === (V = S.data.coverage.metrics) || void 0 === V
                                    ? void 0
                                    : V.statements) && void 0 !== X
                                ? X
                                : 0,
                            conditionals:
                              null !==
                                (ee =
                                  null === (Y = S.data.coverage.metrics) || void 0 === Y
                                    ? void 0
                                    : Y.conditionals) && void 0 !== ee
                                ? ee
                                : 0,
                            methods:
                              null !==
                                (ne =
                                  null === (te = S.data.coverage.metrics) || void 0 === te
                                    ? void 0
                                    : te.methods) && void 0 !== ne
                                ? ne
                                : 0,
                            elements:
                              null !==
                                (re =
                                  null === (oe = S.data.coverage.metrics) || void 0 === oe
                                    ? void 0
                                    : oe.elements) && void 0 !== re
                                ? re
                                : 0,
                            hits:
                              null !==
                                (ie =
                                  null === (ae = S.data.coverage.metrics) || void 0 === ae
                                    ? void 0
                                    : ae.hits) && void 0 !== ie
                                ? ie
                                : 0,
                            coveredStatements:
                              null !==
                                (ce =
                                  null === (se = S.data.coverage.metrics) || void 0 === se
                                    ? void 0
                                    : se.coveredstatements) && void 0 !== ce
                                ? ce
                                : 0,
                            coveredConditionals:
                              null !==
                                (le =
                                  null === (ue = S.data.coverage.metrics) || void 0 === ue
                                    ? void 0
                                    : ue.coveredconditionals) && void 0 !== le
                                ? le
                                : 0,
                            coveredMethods:
                              null !==
                                (fe =
                                  null === (de = S.data.coverage.metrics) || void 0 === de
                                    ? void 0
                                    : de.coveredmethods) && void 0 !== fe
                                ? fe
                                : 0,
                            coveredElements:
                              null !==
                                (he =
                                  null === (ve = S.data.coverage.metrics) || void 0 === ve
                                    ? void 0
                                    : ve.coveredelements) && void 0 !== he
                                ? he
                                : 0,
                            coveredPercentage: s.coveredPercentage(S.data.coverage.metrics),
                          },
                        }),
                      ]
                    )
                  case 12:
                    return (
                      me.sent(),
                      console.log("commit: Inserting new package and file coverage for commit"),
                      [4, c.insertCoverageData(S.data.coverage, { commitId: a.id })]
                    )
                  case 13:
                    return (
                      me.sent(),
                      [
                        4,
                        m.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            commitRef: a.ref,
                            namespace: d,
                            repository: v,
                            message:
                              "Combined coverage for commit " +
                              a.ref.substr(0, 10) +
                              (l
                                ? " and test instance " +
                                  l.id +
                                  " for test " +
                                  (null == h ? void 0 : h.testName)
                                : ""),
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 14:
                    return me.sent(), [2, !0]
                  case 15:
                    return (
                      (E = me.sent()),
                      console.error("Failure processing test instance", E),
                      [
                        4,
                        f.default.jobLog.create({
                          data: {
                            name: "combinecoverage",
                            commitRef: a.ref,
                            namespace: d,
                            repository: v,
                            message:
                              "Failure processing test instance " +
                              a.ref.substr(0, 10) +
                              (l
                                ? " and test instance " +
                                  l.id +
                                  " for test " +
                                  (null == h ? void 0 : h.testName)
                                : "") +
                              ", error " +
                              E.message,
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 16:
                    return me.sent(), [2, !1]
                  case 17:
                    return [2]
                }
              })
            })
          },
          { connection: l.queueConfig, lockDuration: 3e5 }
        )),
          t.combineCoverageWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.combineCoverageWorker.on("failed", function (e, t) {
            console.log(e.id + " has failed with " + t.message)
          })
      },
      897: function (e, t, n) {
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
        Object.defineProperty(t, "__esModule", { value: !0 }), (t.sonarqubeWorker = void 0)
        var i = n(52),
          s = n(569),
          c = n(4),
          u = a(n(673)),
          l = n(686),
          d = "sonarqube"
        ;(t.sonarqubeWorker = new l.Worker(
          d,
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t, n, o, a, c, l, f, v, h, m, g, p, b, y, w, C, I, k, S, _, T, E, x, N, B, O, P
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    ;(t = new Date()),
                      (n = e.data),
                      (o = n.issues),
                      (a = n.commit),
                      (c = n.namespaceSlug),
                      (l = n.repositorySlug),
                      (r.label = 1)
                  case 1:
                    return (
                      r.trys.push([1, 17, , 19]),
                      console.log("Executing process sonarqube job"),
                      console.log("starting to insert"),
                      (f = {}),
                      o.forEach(function (e) {
                        f[e.severity] || (f[e.severity] = 0), f[e.severity]++
                      }),
                      (v = o
                        .filter(function (e) {
                          return e.hash
                        })
                        .map(function (e) {
                          return e.hash
                        })),
                      console.log(
                        "Posted " + o.length + " issues, " + v.length + " of which have a hash"
                      ),
                      (h = {}),
                      o.forEach(function (e) {
                        if (e.hash) {
                          if (h[e.hash])
                            throw (
                              (console.error("Duplicate key for " + e.hash, e, h[e.hash]),
                              new Error("Cannot handle file with duplicates"))
                            )
                          h[e.hash] = e
                        } else console.error("Issue does not have key!", e)
                      }),
                      console.log(Object.keys(h).length + " unique hashes in submitted issues"),
                      [
                        4,
                        u.default.codeIssue.findMany({
                          select: { id: !0, hash: !0 },
                          where: { hash: { in: v } },
                        }),
                      ]
                    )
                  case 2:
                    ;(m = r.sent()),
                      console.log(
                        "Found " + m.length + " existing issues in DB with similar hashes"
                      ),
                      (g = {}),
                      (p = m.map(function (e) {
                        return (g[e.hash] = e.id), e.hash
                      })),
                      (b = []),
                      o.forEach(function (e) {
                        if (e.hash)
                          if (p.includes(e.hash));
                          else {
                            var t = e.line
                            t || (t = 0),
                              b.push({
                                hash: e.hash,
                                file: e.path,
                                line: t,
                                message: e.message,
                                effort: e.effort,
                                type: e.type,
                                severity: e.severity,
                                tags: e.tags.join(","),
                              })
                          }
                      }),
                      console.log("Creating " + b.length + " new issues"),
                      (y = 1e3),
                      (w = 0),
                      (r.label = 3)
                  case 3:
                    return w < b.length
                      ? (console.log("Insert " + w + " - " + (w + y)),
                        [4, u.default.codeIssue.createMany({ data: b.slice(w, w + y) })])
                      : [3, 6]
                  case 4:
                    r.sent(), (r.label = 5)
                  case 5:
                    return (w += y), [3, 3]
                  case 6:
                    return [
                      4,
                      u.default.codeIssue.findMany({
                        select: { id: !0, file: !0 },
                        where: { hash: { in: v } },
                      }),
                    ]
                  case 7:
                    return (
                      (C = r.sent()),
                      console.log(
                        "After creation of new issues, found " +
                          C.length +
                          " issue ids based on hashes"
                      ),
                      [
                        4,
                        u.default.codeIssueOnCommit.findMany({
                          select: { codeIssueId: !0 },
                          where: {
                            codeIssueId: {
                              in: C.map(function (e) {
                                return e.id
                              }),
                            },
                            commitId: a.id,
                          },
                        }),
                      ]
                    )
                  case 8:
                    return (
                      (I = r.sent()),
                      console.log(I.length + " existing issues already linked to this commit"),
                      (k = I.map(function (e) {
                        return e.codeIssueId
                      })),
                      (S = []),
                      C.forEach(function (e) {
                        k.includes(e.id) || S.push({ commitId: a.id, codeIssueId: e.id })
                      }),
                      console.log("Connecting " + S.length + " new issues to this commit"),
                      console.log("Creating links efficiently"),
                      [4, u.default.codeIssueOnCommit.createMany({ data: S })]
                    )
                  case 9:
                    return r.sent(), [4, s.getPathToPackageFileIds({ commitId: a.id })]
                  case 10:
                    return (
                      (_ = r.sent()),
                      (T = _.packagePathToId),
                      (E = _.pathToFileId),
                      _.packageIdToPath,
                      [
                        4,
                        u.default.codeIssueOnFileCoverage.findMany({
                          where: {
                            codeIssueId: {
                              in: C.map(function (e) {
                                return e.id
                              }),
                            },
                            fileCoverageId: { in: Object.values(E) },
                          },
                        }),
                      ]
                    )
                  case 11:
                    return (
                      (x = r.sent()),
                      (N = []),
                      (B = {}),
                      (O = {}),
                      C.forEach(function (e) {
                        var t = E[e.file]
                        t &&
                          (x.find(function (n) {
                            return n.fileCoverageId == t && n.codeIssueId === e.id
                          }) || N.push({ fileCoverageId: t, codeIssueId: e.id }),
                          B[t] || (B[t] = 0),
                          B[t]++),
                          i.executeForEachSubpath(e.file, function (e) {
                            var t = T[e]
                            t && (O[t] || (O[t] = 0), (O[t] += 1))
                          })
                      }),
                      console.log(
                        "Found " + N.length + " new code issues to attach to file coverage"
                      ),
                      [4, u.default.codeIssueOnFileCoverage.createMany({ data: N })]
                    )
                  case 12:
                    return (
                      r.sent(),
                      [
                        4,
                        Promise.all(
                          Object.keys(B).map(function (e) {
                            return u.default.fileCoverage.update({
                              where: { id: parseInt(e) },
                              data: { codeIssues: B[e] },
                            })
                          })
                        ),
                      ]
                    )
                  case 13:
                    return (
                      r.sent(),
                      console.log("Updated total issues for each file"),
                      [
                        4,
                        Promise.all(
                          Object.keys(O).map(function (e) {
                            return u.default.packageCoverage.update({
                              where: { id: parseInt(e) },
                              data: { codeIssues: O[e] },
                            })
                          })
                        ),
                      ]
                    )
                  case 14:
                    return (
                      r.sent(),
                      console.log("Updated total issues for each package"),
                      console.log("severities", f),
                      console.log("updating commit", a),
                      [
                        4,
                        u.default.commit.update({
                          data: {
                            blockerSonarIssues: f.BLOCKER,
                            criticalSonarIssues: f.CRITICAL,
                            majorSonarIssues: f.MAJOR,
                            minorSonarIssues: f.MINOR,
                            infoSonarIssues: f.INFO,
                          },
                          where: { id: a.id },
                        }),
                      ]
                    )
                  case 15:
                    return (
                      r.sent(),
                      console.log("done inserting"),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: d,
                            commitRef: a.ref,
                            namespace: c,
                            repository: l,
                            message:
                              "Processed sonarqube information for commit " +
                              a.ref.substr(0, 10) +
                              ": existing " +
                              m.length +
                              ", newly created " +
                              b.length +
                              ", already linked " +
                              I.length +
                              ", attached " +
                              S.length,
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 16:
                    return r.sent(), [3, 19]
                  case 17:
                    return (
                      (P = r.sent()),
                      console.error(P),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: d,
                            commitRef: a.ref,
                            namespace: c,
                            repository: l,
                            message:
                              "Failure processing sonarqube information for commit " +
                              a.ref.substr(0, 10) +
                              " :" +
                              P.message,
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 18:
                    return r.sent(), [2, !1]
                  case 19:
                    return [2]
                }
              })
            })
          },
          { connection: c.queueConfig, concurrency: 1 }
        )),
          t.sonarqubeWorker.on("completed", function (e) {
            console.log(e.id + " has completed!")
          }),
          t.sonarqubeWorker.on("failed", function (e, t) {
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
          u = a(n(673)),
          l = n(686)
        ;(t.uploadWorker = new l.Worker(
          "upload",
          function (e) {
            return o(void 0, void 0, void 0, function () {
              var t, n, o, a, c, l, d, f, v, h, m
              return r(this, function (r) {
                switch (r.label) {
                  case 0:
                    ;(t = new Date()),
                      (n = e.data),
                      (o = n.coverageFile),
                      (a = n.commit),
                      (c = n.test),
                      (l = n.testInstance),
                      (d = n.namespaceSlug),
                      (f = n.repositorySlug),
                      (r.label = 1)
                  case 1:
                    if (
                      (r.trys.push([1, 4, , 6]),
                      console.log("Executing process upload job"),
                      (v = u.default),
                      !(h = o.data.coverage))
                    )
                      throw new Error(
                        "No coverage information in the input file, cannot read first project."
                      )
                    return (
                      console.log("Creating package and file information for test instance"),
                      [4, i.insertCoverageData(h, { testInstanceId: l.id })]
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
                            commitRef: a.ref,
                            namespace: d,
                            repository: f,
                            message:
                              "Processed upload information for commit " +
                              a.ref.substr(0, 10) +
                              (l ? " and test instance " + l.id + " and test " + c.testName : ""),
                            timeTaken: new Date().getTime() - t.getTime(),
                          },
                        }),
                      ]
                    )
                  case 3:
                    return r.sent(), s.combineCoverageJob(a, d, f, l), [3, 6]
                  case 4:
                    return (
                      (m = r.sent()),
                      console.error(m),
                      m.message.includes(
                        "Timed out fetching a new connection from the connection pool"
                      ) &&
                        (console.log(
                          "Shutting down worker immediately due to connection pool error, hopefully we can restart."
                        ),
                        process.exit(1)),
                      [
                        4,
                        u.default.jobLog.create({
                          data: {
                            name: "processupload",
                            commitRef: a.ref,
                            namespace: d,
                            repository: f,
                            message: "Failure processing " + m.message,
                            timeTaken: new Date().getTime() - t.getTime(),
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
                { removeOnComplete: !0, removeOnFail: !0, timeout: 3e5 }
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
          u = s.enhancePrisma(c.PrismaClient)
        r(n(212), t)
        var l = new u({ log: [{ emit: "event", level: "query" }] })
        l.$on("query", function (e) {
          return a(void 0, void 0, void 0, function () {
            return i(this, function (t) {
              return (
                process.env.LOG_QUERIES &&
                  (e.query.includes("SELECT")
                    ? console.log(e.query + " " + e.params)
                    : console.log("" + e.query)),
                [2]
              )
            })
          })
        }),
          (t.default = l)
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
      835: (e) => {
        e.exports = require("long")
      },
      622: (e) => {
        e.exports = require("path")
      },
      743: (e) => {
        e.exports = require("protobufjs/minimal")
      },
      589: (e) => {
        e.exports = require("xml2js")
      },
    },
    a = {}
  function i(e) {
    var t = a[e]
    if (void 0 !== t) return t.exports
    var n = (a[e] = { exports: {} })
    return r[e].call(n.exports, n, n.exports, i), n.exports
  }
  ;(e = i(742)),
    (t = i(897)),
    (n = i(914)),
    (o = i(801)),
    n.uploadWorker.resume(),
    o.combineCoverageWorker.resume(),
    t.sonarqubeWorker.resume(),
    e.changefrequencyWorker.resume(),
    console.log("started")
})()

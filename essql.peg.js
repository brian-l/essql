{
    function termFilter(field, value) {
        var term = {
            "term": {}
        };
        term.term[field] = value;
        return term;
    }
}

start = a:action ws+ f:fields ws+ "FROM"i ws+ d:doctype s:subfilter? ws* eof {
    var q = {
        "query": {}
    };

    if(s) {
        q.query = {
            "filtered": {
                "filter": {
                    "bool": s
                }
            }
        };
    } else {
        q.query = {"match_all": {}};
    }

    if(f.length) {
        q.fields = f;
    }

    return {
        "doc_type": d,
        "query": q
    };
}

action = s:("SELECT"i / "DELETE"i) {
    return s;
}

subfilter = ws* "WHERE"i ws+ fs:filters {
    return fs;
}

filters = f:filter fs:(ws+ op:"AND"i ws+ filt:filter {return [op, filt];})* {
    var merged = [f].concat(_.pluck(fs, 1)), bool = {
        "must": [],
        "must_not": [],
        "should": [],
    };

    return merged.reduce(function(acc, cur) {
        acc[cur[0]].push(cur[1]);
        return acc;
    }, bool);
};

filter = t:term ws* o:op ws* v:val {
    return o(t, v);
}

op "operator" =
    "==" {
        return function(term, val) {
            return ["must", termFilter(term, val)];
        };
    } /
    "!=" {
        return function(term, val) {
            return ["must_not", termFilter(term, val)];
        };
    };

val "value" =
    neg:'-'? n:[0-9]+ {
        var num = parseInt(n.join(""));
        if(neg) {
            return num * -1;
        } else {
            return num
        }
    } /
    "'" a:atom+ "'" {
        return a.join("");
    };

fields "fields or *" =
    f:field fs:("," field)* {
        return _.compact([f].concat(_.pluck(fs, 1)));
    };

field "field" =
    "*" {
        return null;
    } /
    t:term;

term "term" =
    "`" a:atom+ "`" {
        return a.join("");
    };

doctype "doc type" =
    t:[a-z]i+ {
        return t.join("");
    };

ws "whitespace" = [\x20\r\n\t];

atom "atom" = [^\r\n\t\(\)\x22\x27\x60,];

eof = ";" !.;

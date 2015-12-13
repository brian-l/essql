peg = require('pegjs');
fs = require('fs');
_ = require('underscore');

grammar = fs.readFileSync('essql.peg.js').toString();
parser = peg.buildParser(grammar, {'cache': true})

function parseSQL(statement) {
    console.log(statement, "\n");
    var parsed = parser.parse(statement)
    console.log("doc type is:", parsed.doc_type);
    console.log("query is:", JSON.stringify(parsed.query, null, 4));
};

// parseSQL("SELECT `user_name`,`_id`,`_parent` FROM users WHERE `login_count` == 0;");
// parseSQL("SELECT `user_name`,`_id`,`_parent` FROM users WHERE `login_count` == 0 AND `registered_date` == '2015-12-13';");
parseSQL("SELECT `user_name`,`_id`,`_parent` FROM users WHERE `login_count` == 0 AND `registered_date` == '2015-12-13' AND `email` != 'brian@example.com';");

# SQL-like syntax for ElasticSearch queries

you have to be a lunatic to even think about using this.

## example output

* 
    Input: ``SELECT `user_name`,`_id`,`_parent` FROM users;``
    Output: ``{
    "query": {
        "match_all": {}
    },
    "fields": [
        "user_name",
        "_id",
        "_parent"
    ]
}``


* 
    Input: ``SELECT `user_name`,`_id`,`_parent` FROM users WHERE `login_count` == 0 AND `registered_date` == '2015-12-13';``
    Output: ``{
    "query": {
        "filtered": {
            "filter": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "login_count": 0
                            }
                        },
                        {
                            "term": {
                                "registered_date": "2015-12-13"
                            }
                        }
                    ],
                    "must_not": [],
                    "should": []
                }
            }
        }
    },
    "fields": [
        "user_name",
        "_id",
        "_parent"
    ]
}``


* 
    Input: ``SELECT `user_name`,`_id`,`_parent` FROM users WHERE `login_count` == 0 AND `registered_date` == '2015-12-13' AND `email` != 'brian@example.com';``
    Output: ``{
    "query": {
        "filtered": {
            "filter": {
                "bool": {
                    "must": [
                        {
                            "term": {
                                "login_count": 0
                            }
                        },
                        {
                            "term": {
                                "registered_date": "2015-12-13"
                            }
                        }
                    ],
                    "must_not": [
                        {
                            "term": {
                                "email": "brian@example.com"
                            }
                        }
                    ],
                    "should": []
                }
            }
        }
    },
    "fields": [
        "user_name",
        "_id",
        "_parent"
    ]
}``

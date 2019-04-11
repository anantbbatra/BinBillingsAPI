/* to do:

1. edit endpoints to remove them sending back the data.
2. edit endpoints to allow update/create both
3. edit creation endpoints to auto create credentials
 */

//fix massive queries to reduce
const express = require('express');
const app = express();
const port = 3000;
const massive = require("massive");
const http = require('http');
const bodyParser = require("body-parser");
const long_distance = 9999999;
const randomstring = require("randomstring");

var connectionString = "postgres://anantbhushanbatra:@localhost/binbillings";
var date = new Date();

massive(connectionString).then(massiveInstance => {
    app.set('db', massiveInstance);
    console.log('Massive connected to binbillings database successfully');
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));

app.use(bodyParser.urlencoded({
    extended: true
}));

//POST ENDPOINTS



//works
//create refuse firm
//edit this endpoint to allow insert and update by adding :new param at end of endpoint. **
app.post('/firm', (req, res) => {

    if (typeof req.body.provider_id !== 'undefined' && req.body.provider_id)
    {
        app.get('db').refuse_firm.update(
            {provider_id: req.body.provider_id}
            ,{
                provider_name: req.body.provider_name,
                provider_email: req.body.provider_email,
                firm_contact_num: req.body.firm_contact_num,
                firm_address: req.body.firm_address,
                green: req.body.green_rate,
                brown: req.body.brown_rate,
                red: req.body.red_rate,
                paymentinfo: req.body.paymentInfo,
                account_comments: req.body.account_comments
            }).then(firm => {
            res.send(firm);
            //create credentials
        });
    }else{
        app.get('db').refuse_firm.insert({
            provider_name: req.body.provider_name,
            provider_email: req.body.provider_email,
            firm_contact_num: req.body.firm_contact_num,
            firm_address: req.body.firm_address,
            green: req.body.green_rate,
            brown: req.body.brown_rate,
            red: req.body.red_rate,
            paymentinfo: req.body.paymentInfo

        }).then(firm => {
            res.send(firm);

            var generatedPassword = randomstring.generate(10);
            var generatedSalt = randomstring.generate(10);
            app.get('db').provider_credential.insert({
                provider_id: firm.provider_id,
                provider_username: firm.provider_email,
                password: generatedPassword,
                salt: generatedSalt,
            }).then(firm => {
            });

            var d = new Date();
            const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
            ];

            app.get('db').partner_payment.insert({
                provider_id: firm.provider_id,
                month: monthNames[d.getMonth()],
                year: d.getFullYear(),
                total: 0,
                debited: 0,
            }).then(firm => {
            });


        });
    }
})
//works
//set account status for firm
app.post('/cust/status', (req, res) => {
    app.get('db').customer.update(
        {cust_id: req.body.cust_id},
        {account_status: req.body.account_status}
    ).then(firm => {
        res.send(firm[0]);
        //create credentials
    });
})

//works
//set account status for firm
app.post('/bin/status', (req, res) => {
    
    app.get('db').bin.update(
        {bin_id: req.body.bin_id},
        {status: req.body.status}
    ).then(firm => {
        res.send(firm[0]);
        //create credentials
    });
})

//works
//set account status for firm
app.post('/firm/status', (req, res) => {
    app.get('db').refuse_firm.update(
            {provider_id: req.body.provider_id},
            {account_status: req.body.account_status}
        ).then(firm => {
        res.send(firm[0]);
        //create credentials
    });
})

//works
//refund amount
app.post('/refund', (req, res) => {
    app.get('db').recharge.findOne(req.body.recharge_id).then(recharge => {
        amount = recharge.amount;
        app.get('db').customer.findOne(recharge.cust_id).then(customer => {
            if (customer.balance >= amount) {
                app.get('db').customer.update(
                    {cust_id: customer.cust_id},
                    {balance: customer.balance - amount}
                ).then(firm => {
                    res.send(firm[0]);
                })
                app.get('db').recharge.update(
                    {recharge_id: recharge.recharge_id},
                    {amount: 0}
                ).then(recharge => {
                });
            }else{
                res.send();
            }
        })
    })
});

//works
//create new apartment community
//edit this endpoint to allow insert and update by adding :new param at end of endpoint. **
app.post('/apartment', (req, res) => {
    app.get('db').apt_community.insert({
        community_name: req.body.community_name,
        community_contact_num: req.body.community_contact,
        community_street_address: req.body.community_address,
        community_city: req.body.community_city,
        size: req.body.size,
    }).then(apt => {
        res.send(apt)
    });
});

//works
//create new customer
//edit this endpoint to allow insert and update by adding :new param at end of endpoint. **
app.post('/uploadCust', (req, res) => {
    if (typeof req.body.cust_id !== 'undefined' && req.body.cust_id) {
        app.get('db').customer.update(
            {cust_id: req.body.cust_id}
            ,{
                cust_name: req.body.cust_name,
                cust_email: req.body.cust_email,
                community_id: req.body.community_id,
                provider_id: req.body.provider_id,
                account_comments: req.body.account_comments
            }).then(customer => {
            res.send(customer);
            //create credentials
        });
    }else{
        app.get('db').customer.insert({
            cust_name: req.body.cust_name,
            cust_email: req.body.cust_email,
            community_id: req.body.community_id,
            provider_id: req.body.provider_id,
        }).then(customer => {
            res.send(customer);
            //create credentials
        });
    }
});

//works
//create new bin
//edit this endpoint to allow insert and update by adding :new param at end of endpoint. **
app.post('/bin', (req, res) => {
    if (typeof req.body.bin_id !== 'undefined' && req.body.bin_id)
    {
        app.get('db').bin.update(
            {bin_id: req.body.bin_id}
            ,{
                community_id: req.body.community_id,
                color: req.body.color,
                provider_id: req.body.provider_id,
                x_coordinate: req.body.x_coordinate,
                y_coordinate: req.body.y_coordinate,
                status: req.body.status,
                mac: req.body.mac,
            }).then(bin => {
            res.send(bin);
        });

    }else {
        var code = randomstring.generate(10);
        app.get('db').bin.insert({
            color: req.body.color,
            provider_id: req.body.provider_id,
            unlockcode: code,
            status: 0,
            mac: req.body.mac,
        }).then(bin => {
            res.send(bin)
        });
    }
});

//works
//create new employee
//edit this endpoint to allow insert and update by adding :new param at end of endpoint. **
app.post('/employee', (req, res) => {
    app.get('db').employee.insert({
        employee_name: req.body.employee_name,
        employee_email: req.body.employee_email,
        employee_position: req.body.employee_position,
        employee_city: req.body.employee_city,
        dob: req.body.dob,
    }).then(employee => {
        res.send(employee);
        //create credentials
    });
});

//works
//create new recharge
//edit this endpoint to add two middleware, login and card info
app.post('/recharge', (req, res) => {
    app.get('db').customer.findOne(req.query.cust_id).then(customer => {
        app.get('db').customer.update(
            {cust_id: customer.cust_id},
            {balance: (customer.balance + parseFloat(req.query.amount))}).then(customerArray =>
        {
            app.get('db').recharge.insert({
            cust_id: req.query.cust_id,
            amount: req.query.amount,
            payment_type: req.body.lastfourdigits,
            }).then(recharge_receipt => {
                recharge_receipt.newBalance = customerArray[0].balance;
                res.send(recharge_receipt)
            });
        });
    });

});

//works
//add error checking message responses
// create new transaction
app.post('/unlock', (req, res) => {
    app.get('db').customer.findOne(req.body.cust_id).then(customer => {
        app.get('db').bin.findOne(req.body.bin_id).then(bin => {
            if ((bin.provider_id == customer.provider_id) & (customer.balance > 5)) {
                app.get('db').refuse_firm.findOne(bin.provider_id).then(provider => {
                    var providerRate;
                    if (bin.color == 'red') {
                        providerRate = provider.red
                    } else if (bin.color == 'green') {
                        providerRate = provider.green
                    } else {
                        providerRate = provider.brown
                    }
                    app.get('db').bin_transaction.insert({
                        bin_id: bin.bin_id,
                        cust_id: customer.cust_id,
                        rate: providerRate,
                        color: bin.color,
                        provider_id: provider.provider_id,
                        status: "initiated"
                    }).then(bin_transaction => {
                        var hashedCode = bin.unlockCode + date.getHours();//change this so it hashes instead of adding
                        var response = (bin_transaction.transaction_id + ' : ' + hashedCode);
                        res.send(bin_transaction);
                    });
                })
            }
        });
    });
});

//works
//completes transaction
//edit this endpoint to add two middleware, login and token verification
app.post('/transact', (req, res) => {
    app.get('db').bin_transaction.findOne(req.body.transaction_id).then(transaction => {
        if (transaction.status!="completed"){
            app.get('db').bin_transaction.update(
                {transaction_id: req.body.transaction_id},
                {weight: req.body.weight, total_cost: (transaction.rate*req.body.weight), status: "completed"})
                .then(transaction_receipt =>
                {res.send(transaction_receipt);
                monthOfTransaction = String(transaction_receipt[0].time_of_transaction).substring(4,7);
                yearOfTransaction = String(transaction_receipt[0].time_of_transaction).substring(11,15);
                app.get('db').partner_payment.find({provider_id: transaction_receipt[0].provider_id, month: monthOfTransaction, year: yearOfTransaction}).then(monthlyStub => {
                    newBalance = monthlyStub[0].total + (transaction_receipt[0].total_cost *.9);
                    app.get('db').query(
                            ("UPDATE partner_payment SET total = $1 WHERE month = $2 AND year = $3 AND provider_id= $4"),
                                [newBalance, monthOfTransaction, yearOfTransaction, transaction_receipt[0].provider_id]
                        ).then(monthlyStub => {
                    })
                        // {provider_id: transaction_receipt[0].provider_id, month: monthOfTransaction, year: yearOfTransaction},
                        // {balance: monthlyStub.total + (transaction_receipt[0].total_cost *.9)})

                })
                });
        }
    })
})

//works
//updates admin comments on query
//edit this endpoint to add two middleware, login and token verification
app.post('/updateQuery', (req, res) => {
    app.get('db').customer_query.update(
        {query_id: req.body.query_id},
        {admin_comments: req.body.admin_comments, resolved: req.body.resolved})
        .then(query =>
        {   if (query[0].resolved == 1){
                app.get('db').bin_transaction.update(
                    {transaction_id: query[0].transaction_id},
                    {status: "resolved"}).then(transaction =>{
                    res.send(query);
                })
            }else{
            res.send(query);
            }
        });
})





//works
//raises issue to customer service
//edit this endpoint to add two middleware, login and token verification
app.post('/dispute', (req, res) => {
    app.get('db').bin_transaction.findOne(req.query.transaction_id).then(transaction => {
        app.get('db').bin_transaction.update(
            {transaction_id: req.query.transaction_id},
            {status: "conflict"})
            .then(transaction_receipt => {
                app.get('db').customer_query.insert({
                    custid:transaction_receipt[0].cust_id,
                    cusstomer_comments: req.query.comments,
                    issue_type: "T",
                    transaction_id:transaction_receipt[0].transaction_id
                }).then( query => {
                    res.send(query);
                })
            });
    })
})



//GET ENDPOINTS

//works
//get bins near user
app.get('/bins', (req, res) => {
    var cust_provider_id;
    cust_x = parseFloat(req.query.user_x);
    cust_y = parseFloat(req.query.user_y);
    app.get('db').customer.findOne(req.query.cust_id).then((cust) => {
        cust_provider_id = cust.provider_id;
        app.get('db').query(
            ('SELECT bin_id, community_id, x_coordinate, y_coordinate, color ' +
            'FROM bin ' +
            'WHERE ' +
            'provider_id=$1 ' +
            'AND x_coordinate <$2 AND x_coordinate >$3 AND y_coordinate < $4 AND y_coordinate > $5 '/* +
            'AND status = $6'*/),
            [cust_provider_id, (cust_x+long_distance), (cust_x-long_distance), (cust_y+long_distance), (cust_y-long_distance)]
        ).then(bins => {
            res.send(bins);
        });
    });
});

//works
//get bins near user
app.get('/bin', (req, res) => {
    // if (req.params.options == "portal"){
    app.get('db').bin.findOne(req.query.bin_id).then(bin => {
        res.send(bin);
    });
    // }
});

//works
//get bins near user
app.get('/binsForWebsite', (req, res) => {
    // if (req.params.options == "portal"){
        app.get('db').bin.find({provider_id: req.query.provider_id}).then(bins => {
            res.send(bins);
        });
    // }
});


//works
//get all user transactions except those not completed.
app.get('/transactions/:options', (req, res) => {
    if(!req.params.options) { //used only by android
        app.get('db').query('SELECT * FROM bin_transaction WHERE cust_id =$1 AND status != $2', [req.query.cust_id, "initiated"])
            .then(transactions => {
                res.send(transactions);
            });
    }else{
        if(req.params.options == "byFirm"){ //filter by provider_id
            app.get('db').query('SELECT * FROM bin_transaction WHERE provider_id =$1', [req.query.provider_id])
                .then(transactions => {
                    res.send(transactions);
                });
        }else if(req.params.options == "byCust"){ //filter by cust_id

            app.get('db').query('SELECT * FROM bin_transaction WHERE cust_id =$1', [req.query.cust_id])
                .then(transactions => {
                    res.send(transactions);
                });
        }else { //filter by both cust_id and firm_id
            app.get('db').query('SELECT * FROM bin_transaction WHERE cust_id =$1 AND provider_id = $2', [req.query.cust_id, req.query.provider_id])
                .then(transactions => {
                    res.send(transactions);
                });
        }
    }
});


//need to test
//get users recharges
app.get('/rechargeHistory', (req, res) => {
    app.get('db').recharge.find({cust_id: req.query.cust_id}).then(recharges => {
        res.send(recharges);
    });
});

app.get('/firms', (req, res) => {
    app.get('db').query("SELECT * from refuse_firm").then(firm => {
        res.send(firm);
    });
});

app.get('/customers', (req, res) => {
    app.get('db').query("SELECT * from customer").then(customers => {
        res.send(customers);
    });
});

//works
//get customer info
app.get('/userInfo', (req, res) => {
    app.get('db').customer.findOne(req.query.cust_id).then(customer => {
        app.get('db').refuse_firm.findOne(customer.provider_id).then(provider => {
            app.get('db').apt_community.findOne(customer.community_id).then(apartment => {
                customer.provider_name = provider.provider_name;
                customer.apartment_name = apartment.community_name;
                customer.city_name = apartment.community_city;
                res.send(customer);
            })

        });
    });
});


//works
//get provider info
app.get('/providerInfo', (req, res) => {
    app.get('db').refuse_firm.findOne(req.query.provider_id).then(provider => {
        res.send(provider);
    });
});

//works
//get query from transaction_id
app.get('/query', (req, res) => {
    app.get('db').customer_query.find({transaction_id: req.query.transaction_id}).then(query => {
        res.send(query[0]);
    });
});

//works
//get query from transaction_id
app.get('/partner_payments', (req, res) => {
    if (typeof req.query.provider_id !== 'undefined' && req.query.provider_id)
    {
        app.get('db').partner_payment.find({provider_id: req.query.provider_id, debited: req.query.debited}).then(payments => {
            res.send(payments);
        });
    }else{
        app.get('db').partner_payment.find({debited: req.query.debited}).then(payments => {
            res.send(payments);
        });
    }

});

//works
//get query from transaction_id
app.post('/login/website', (req, res) => {

    app.get('db').provider_credential.find({provider_username: req.body.username}).then(credentials => {
        if (credentials[0] == undefined){

            res.send("0");
        }else {
            if (credentials[0].password == req.body.password) {
                res.send("" + credentials[0].provider_id);
            } else {
                res.send("0");
            }
        }
    });
});


//used to test connection
app.get('/test', (req, res) => {
    res.send("Hello.");
});
DROP TABLE employee_credential CASCADE;
DROP TABLE customer_credential CASCADE;
DROP TABLE provider_credential CASCADE;
DROP TABLE refuse_firm CASCADE;
DROP TABLE apt_community CASCADE;
DROP TABLE bin CASCADE;
DROP TABLE customer CASCADE;
DROP TABLE recharge CASCADE;
DROP TABLE bin_transaction CASCADE;
DROP TABLE employee CASCADE;
DROP TABLE partner_payment CASCADE;


CREATE TABLE refuse_firm (
	provider_id SMALLSERIAL PRIMARY KEY,
	provider_name varchar(50) NOT NULL,
	provider_email varchar(50) UNIQUE,
	firm_contact_num varchar(20) NOT NULL,
	firm_address varchar(100),
	green float(4),
	brown float(4),
	red float(4),
	paymentinfo varchar(100),
	account_status varchar(20),
	account_comments varchar(100)
 );


CREATE TABLE partner_payment (
	provider_id SMALLSERIAL REFERENCES refuse_firm(provider_id),
	month varchar(2),
	year varchar(4),
	amount int,
	debited int,
	PRIMARY KEY(provider_id, month, year)
 );

CREATE TABLE apt_community (
	community_id SERIAL PRIMARY KEY,
	community_name varchar(40) NOT NULL,
	community_contact_num varchar(15) NOT NULL,
	community_street_address varchar(100),
	community_city varchar (25),
	size SMALLINT
  );

CREATE TABLE bin (
	bin_id SERIAL PRIMARY KEY,
	community_id INT REFERENCES apt_community(community_id),
	x_coordinate float(5),
	y_coordinate float(5),
	color varchar(10),
	provider_id SMALLINT REFERENCES refuse_firm(provider_id),
	status int,
	unlockcode varchar(10),
	mac varchar(10);
);

CREATE TABLE customer (
    cust_id SERIAL PRIMARY KEY,
	cust_name varchar(40) NOT NULL,
	cust_email varchar(50),
	community_id INT REFERENCES apt_community(community_id),
	balance SMALLINT NOT NULL DEFAULT 0,
	provider_id SMALLINT REFERENCES refuse_firm(provider_id),
	account_status varchar(20),
	account_comments varchar(100)
  );

  CREATE TABLE customer_query (
  query_id SERIAL PRIMARY KEY,
  custid int REFERENCES customer(cust_id),
  cusstomer_comments varchar (200),
  resolved int DEFAULT 0,
  admin_comments varchar(400),
  date timestamp DEFAULT NOW(),
  issue_type varchar(1),
  transaction_id INT references bin_transaction(transaction_id),
  recharge_id BIGINT references recharge(recharge_id)
  );


CREATE TABLE recharge (
	recharge_id BIGSERIAL PRIMARY KEY,
	cust_id int REFERENCES customer(cust_id),
	amount SMALLINT NOT NULL,
	time_of_recharge timestamp NOT NULL DEFAULT NOW(),
	payment_type varchar(50)
  );

CREATE TABLE bin_transaction (
	transaction_id SERIAL PRIMARY KEY,
	bin_id INT REFERENCES bin(bin_id),
	time_of_transaction timestamp NOT NULL DEFAULT NOW(),
	cust_id int REFERENCES customer(cust_id),
	weight float(5),
	rate float(5),
	total_cost float(5),
	color varchar(10),
	status varchar(15),
	provider_id SMALLINT REFERENCES refuse_firm(provider_id)
);

CREATE TABLE provider_credential (
    provider_id int PRIMARY KEY REFERENCES refuse_firm(provider_id),
    provider_username varchar(50) UNIQUE,
    salt varchar(50) NOT NULL,
    password varchar(100) NOT NULL
);


CREATE TABLE customer_credential (
    cust_id int PRIMARY KEY REFERENCES customer(cust_id),
    cust_username varchar(50) UNIQUE,
    salt varchar(50) NOT NULL,
    password varchar(100) NOT NULL
);
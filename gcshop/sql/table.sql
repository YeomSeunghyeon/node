//201935292 염승현
use webdb2023;
/*******************************************************/
create table person (
loginid varchar(10) not null,
password varchar(10) not null,
name varchar(20) not null,
address varchar(50) null,
tel varchar(13) not null, 
birth varchar(8) not null, 
class varchar(2) not null, /*00 : CEO, 01 : 관리자, 02 : 일반고객 */
point int, 
PRIMARY KEY(loginid)
);

insert into person
values('bhwang99','bhwang99','왕보현','서울','010-8340-3779','00000000','02',0);
insert into person
values('sh','sh','염승현','서울','010-8110-3191','00000000','01',0);
insert into person
values('1sh','1sh','염승현','경기','010-8110-3191','00000000','00',0);

create table code_tbl (
main_id varchar(4) not null,
sub_id varchar(4) not null,
main_name varchar(100) not null,
sub_name varchar(100) not null,
start varchar(8) not null,
end varchar(8) not null,
PRIMARY KEY(main_id,sub_id,start,end)
);
insert into code_tbl
values('0000','0001','상품','의류','20231001','20301231'); 

create table merchandise (
mer_id int NOT NULL auto_increment,
category varchar(4) not null,
name varchar(100) not null,
price int not null,
stock int not null, 
brand varchar(100) not null, 
supplier varchar(100) not null, 
image varchar(50), 
sale_yn varchar(1),
sale_price int,
PRIMARY KEY(mer_id)
);

insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0001','티셔츠',2000,1,'마이더스비','마이더스비','/images/womenCloth1.png','Y',0);
insert into merchandise (category, name, price, stock,brand, supplier, image,sale_yn, sale_price)
value('0002','음식',20000,1,'안성사과','안성사과','/images/apple.jpg','Y',0);

create table boardtype (
type_id int NOT NULL auto_increment,
title varchar(200) not null,
description varchar(400) ,
write_YN varchar(1) not null,
re_YN varchar(1) not null,
numPerPage int not null,
PRIMARY KEY(type_id)
);
insert into boardtype 
value(1,'공지사항','학생들에게 공지','N','N',5);
insert into boardtype 
value(2,'Q&A','문답','Y','N',2);


create table board (
board_id int NOT NULL auto_increment,
type_id int ,
p_id int, 
loginid varchar(10) NOT NULL,
password varchar(20) NOT NULL,
title varchar(200) ,
date varchar(30) NOT NULL,
content text,
PRIMARY KEY(board_id)
);
insert into board
value(1,1,1,'yeom','yeom','날씨','2023.11.09',"늘은 비가옵니다");

insert into board
value(3,2,1,'yeom','yeom','질문','2023.11.08',"오늘의 과제 질문");

create table purchase (
purchase_id int NOT NULL auto_increment,
loginid varchar(10) NOT NULL,
mer_id int NOT NULL ,
date varchar(30) NOT NULL,
price int,
point int, 
qty int,
total int,
payYN  varchar(1) NOT NULL default 'N',
cancel varchar(1) NOT NULL default 'N',
refund varchar(1) NOT NULL default 'N',
PRIMARY KEY(purchase_id)
);

insert into purchase
value(2,'yeom',2,'2023:11:16',999999,0.05,1,999999,"N","N","N");


create table cart (
cart_id int NOT NULL auto_increment,
loginid varchar(10) NOT NULL,
mer_id int NOT NULL,
date varchar(30) NOT NULL,
PRIMARY KEY(cart_id)
);
insert into cart
value(1,'yeom',2,'2023:11:16');
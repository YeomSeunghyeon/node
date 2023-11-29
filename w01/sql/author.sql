create table author( 
  id int not null auto_increment, 
  name varchar(20) not null, 
  profile varchar(200) default null, 
primary key(id));

insert author
values(1,'Gu Han-Seok','editor');

insert author
values(2,'Ha Bong-Soo','programmer');

insert author
values(3,'Sin You-Jeong','artist');

insert author
values(4,'Jung Ha-Yoon','president');

insert author
values(5,'Lee Kyung-Chang','professor');

insert author
values(6,'Park Ki-Soo','manager');

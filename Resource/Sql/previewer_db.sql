drop database if exists previewer_db;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

create schema if not exists `previewer_db` default character set utf8;

use `previewer_db`;

create table if not exists `previewer_db`.`Payment` (
	`grade` varchar(10) not null,
	`price` int null,
	primary key (`grade`)
);

create table if not exists `previewer_db`.`User` (
	`email` varchar(45) not null,
	`name` varchar(45) not null,
	`password` varchar(70) not null,
	`auth` varchar(25) not null,
	`grade` varchar(10) not null,
	primary key (`email`)
);

create table if not exists `previewer_db`.`User_Payment` (
	`email` varchar(45) not null,
	`grade` varchar(10) not null,
	`payment_date` timestamp,
	`expire_date` timestamp,
	constraint `fk_User_Payment_Email`
		foreign key (`email`)
		references `previewer_db`.`User` (`email`)
		on delete cascade
		on update cascade,
	constraint `fk_User_grade`
		foreign key (`grade`)
		references `previewer_db`.`Payment` (`grade`)
		on delete cascade
		on update cascade
);

create table if not exists `previewer_db`.`RequestList` (
	`number` int not null auto_increment,
	`url` varchar(1000) not null,
	`request_date` date null,
	`email` varchar(45) not null,
	`analysis_check` int,
	primary key (`url`),
	key (`number`),
	constraint `fk_RequestList_User`
		foreign key (`email`)
		references `previewer_db`.`User` (`email`)
		on delete cascade
		on update cascade
);

create table if not exists `previewer_db`.`XssList` (
	`gadget` varchar(1000) not null,
	primary key(`gadget`)
);
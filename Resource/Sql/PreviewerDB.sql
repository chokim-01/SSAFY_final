-- MySQL Script generated by MySQL Workbench
-- Fri Oct 18 14:55:25 2019
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering
drop database if exists mydb;

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';
-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
-- -----------------------------------------------------
-- Schema test
-- -----------------------------------------------------
USE `mydb` ;
-- -----------------------------------------------------
-- Table `mydb`.`Payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Payment` (
  `grade` VARCHAR(10) NOT NULL,
  `price` INT NULL,
  PRIMARY KEY (`grade`))
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `mydb`.`User`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User` (
  `email` VARCHAR(45) NOT NULL,
  `name` VARCHAR(45) NOT NULL,
  `password` VARCHAR(70) NOT NULL,
  `auth` VARCHAR(25)  NOT NULL,
  PRIMARY KEY (`email`)
)
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `mydb`.`User_Payment`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`User_Payment` (
	`email` varchar(45) not null,
    `grade` VARCHAR(10) NOT NULL,
	`payment_date` timestamp,
    `expire_date` timestamp,
    INDEX `fk_User_Payment_Email_idx` (`email` ASC) VISIBLE,
	CONSTRAINT `fk_User_Payment_Email`
    FOREIGN KEY (`email`)
    REFERENCES `mydb`.`User` (`email`)
    ON DELETE cascade
    ON UPDATE cascade,
	INDEX `fk_User_grade_idx` (`grade` ASC) VISIBLE,
	CONSTRAINT `fk_User_grade`
    FOREIGN KEY (`grade`)
    REFERENCES `mydb`.`Payment` (`grade`)
    ON DELETE cascade
    ON UPDATE cascade
);
-- -----------------------------------------------------
-- Table `mydb`.`SiteList`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`SiteList` (
  `url` VARCHAR(200) NOT NULL,
  `analysisCheck` int NULL,
  `analysisResult` int NULL,
  PRIMARY KEY (`url`))
ENGINE = InnoDB;
-- -----------------------------------------------------
-- Table `mydb`.`Request`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `mydb`.`Request` (
  `number` INT NOT NULL AUTO_INCREMENT,
  `url` VARCHAR(200) NOT NULL,
  `request_date` DATE NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`number`, `email`),
  INDEX `fk_Request_User1_idx` (`email` ASC) VISIBLE,
  CONSTRAINT `fk_Request_User1`
    FOREIGN KEY (`email`)
    REFERENCES `mydb`.`User` (`email`)
    ON DELETE cascade
    ON UPDATE cascade)
ENGINE = InnoDB;
SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

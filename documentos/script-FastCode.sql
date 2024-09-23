-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema FastCode
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema FastCode
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `FastCode` DEFAULT CHARACTER SET utf8 ;
USE `FastCode` ;

-- -----------------------------------------------------
-- Table `FastCode`.`Funcionario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FastCode`.`Funcionario` (
  `id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `dataContratacao` DATE NOT NULL,
  `historico` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FastCode`.`Cliente`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FastCode`.`Cliente` (
  `id` INT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `dataCadastro` DATE NOT NULL,
  `historico` VARCHAR(45) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FastCode`.`Pedido`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FastCode`.`Pedido` (
  `id` INT NOT NULL,
  `QrCode` VARCHAR(45) NOT NULL,
  `valor` FLOAT NOT NULL,
  `data` DATE NOT NULL,
  `hora` TIME NOT NULL,
  `local` VARCHAR(45) NOT NULL,
  `Funcionario_id` INT NOT NULL,
  `Cliente_id` INT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `fk_Pedido_Funcionario_idx` (`Funcionario_id` ASC) VISIBLE,
  INDEX `fk_Pedido_Cliente1_idx` (`Cliente_id` ASC) VISIBLE,
  CONSTRAINT `fk_Pedido_Funcionario`
    FOREIGN KEY (`Funcionario_id`)
    REFERENCES `FastCode`.`Funcionario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedido_Cliente1`
    FOREIGN KEY (`Cliente_id`)
    REFERENCES `FastCode`.`Cliente` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FastCode`.`Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FastCode`.`Item` (
  `id` INT NOT NULL,
  `preco` FLOAT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `quantidade` INT NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `FastCode`.`Pedido_tem_Item`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `FastCode`.`Pedido_tem_Item` (
  `Pedido_id` INT NOT NULL,
  `Item_id` INT NOT NULL,
  PRIMARY KEY (`Pedido_id`, `Item_id`),
  INDEX `fk_Pedido_has_Item_Item1_idx` (`Item_id` ASC) VISIBLE,
  INDEX `fk_Pedido_has_Item_Pedido1_idx` (`Pedido_id` ASC) VISIBLE,
  CONSTRAINT `fk_Pedido_has_Item_Pedido1`
    FOREIGN KEY (`Pedido_id`)
    REFERENCES `FastCode`.`Pedido` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_Pedido_has_Item_Item1`
    FOREIGN KEY (`Item_id`)
    REFERENCES `FastCode`.`Item` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

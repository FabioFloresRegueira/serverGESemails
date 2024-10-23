'use strict';
const mysql = require('mysql');

//local mysql db connection
const dbConn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : ''
});


dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Gerenciador de Banco de dados MySql Conectado !");

  /* ************************* 
   CRIAÇÃO DO BANCO DE DADOS   
  /* ************************* */
  var dbName = "GESvigencias"; 
  dbConn.query("SELECT SCHEMA_NAME FROM INFORMATION_SCHEMA.SCHEMATA WHERE SCHEMA_NAME = ?", dbName, function(err, result) {
    if (err) throw err;

    // VALIDA EXISTENCIA DO BANCO DE DADOS
    if (result.length > 0) {
     
      console.log("Banco de Dados | " +  dbName + " Existente !");

      dbConn.changeUser({database : dbName}, function(err) {
        if (err) throw err;
      });

      // VALIDA A EXISTENCIA DA TABELA TAGS
      dbConn.query(" SELECT * FROM information_schema.tables WHERE table_schema = ? AND table_name = ? LIMIT 1", [dbName, 'tags'], function(err, result) {
        if (err) throw err; 
      
        if (result.length > 0){
          console.log("Tabela Tags | Existente no Banco de Dados " + dbName + " ! "); 
        } else {
          console.log("Tabela Tags | NÃO EXITENTE NO BANCO DE DADOS !, Favor Solicitar a execução do Serviço CRUD. ")
        }

      });

    } else {
      console.log("Banco de Dados | " +  dbName + " NÃO EXISTENTE !, Favor Solicitar a execução do Serviço CRUD.");
    }
  });
  
});

module.exports = dbConn;
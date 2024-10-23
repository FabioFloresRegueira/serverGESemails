'use strict';
var dbConn = require('../config/db.config');

// Tabela Cliente e Seus Atributos
var Tags = function(tags){
  this.iDTag = tags.iDTag;
  this.descricao  = tags.descricao; 
  this.categoria = tags.categoria; 
  this.infor = tags.infor; 
  this.vigencia = tags.vigencia;
  this.foto  = tags.foto;
  this.status         = tags.status ?? 0;
  this.created_at     = new Date();
  this.updated_at     = new Date();
};

// Metodo: lista as tags de serviços ativas p/a envio no e-mail.
Tags.emailAllativos = function (result) {

  var xSql = 'SELECT descricao as DESCRIÇÃO, categoria as CATEGORIA, DATE_FORMAT(vigencia, "%d/%m/%Y") as VIGÊNCIA, DATEDIFF(vigencia,CURDATE()) as DIASRESTANTES, infor as INFORMAÇÕES ';
      xSql += 'FROM tags '; 
      xSql += 'WHERE status =1 ';  
      xSql += 'ORDER BY DIASRESTANTES'

    dbConn.query(xSql, function (err, res) {
    if(err) {
      console.log("error: ", err);
      result(null, err);
    }
    else{
      console.log('Tags : ', res);
      result(null, res);
    }
  });
};

module.exports= Tags;

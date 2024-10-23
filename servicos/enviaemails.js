'use strict';
var dbConn = require('../../config/db.config');
const Tags = require('../models/tags');

const nodemailer = require('nodemailer');
const cron = require('node-cron');


// Crie um objeto transportador
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com', // Substitua pelo seu host SMTP
    port: 465, // Porta do servidor TLS
    secure: true, // true para 465, false para outras portas
    auth: {
      user: 'deployment.erp@gmail.com', // meu gmail. 
      pass: 'vmje cbov pphf yqze' // Sua senha de aplicativo configurado no gmail. 
    }
});

// Função para obter o resultado da consulta usando callback
function getResult(callback) {
    Tags.emailAllativos((err, rows) => {
        if (err) {
            console.error('Erro ao obter o resultado da consulta:', err);
            return callback(err, null);
        }
        callback(null, rows);
    });
}

// Agende a tarefa para enviar o email automaticamente
cron.schedule('29 11 * * *', () => {
    getResult((err, result) => {
        if (err) {
            return console.error('Erro ao obter o resultado da consulta ou enviar o email:', err);
        }

        // Gere a tabela HTML a partir do resultado
        const tableHTML = generateTable(result,'ACOMPANHAMENTO DE VIGÊNCIAS');

        // Defina as opções do email
        const mailOptions = {
            from: 'erp.deployment@gmail.com',
            to: 'fabio.regueira@portonovosa.com',
            subject: 'GES-Gestão Eletônica de Serviços',
            text: `WebGES - Gestão Eletronica de Serviços: ${JSON.stringify(result)}`,
            //html: `<b>Aqui está o resultado da sua consulta:</b><pre>${JSON.stringify(result, null, 2)}</pre>`
            html: `<b><h1>WebGES - Gestão Eletronica de Serviços:</h1></b>${tableHTML}`
        
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log(error);
            }
            console.log('Email enviado: ' + info.response);
        });
    });
});



// transforma o resultado da função getResult() no layout de tabela\html 
function generateTable(data, titulo) {

    const now = new Date();
    
    const dateTimeString = now.toLocaleString();

    let table = `<h2>${titulo}</h2>`;
    table += `<p>Data e Hora: ${dateTimeString}</p>`;
    table += '<table border="1"><tr>';
    // Adicione os cabeçalhos da tabela
    for (let key in data[0]) {
        table += `<th>${key}</th>`;
    }
    table += '</tr>';
    // Adicione as linhas da tabela
    data.forEach(row => {
        table += '<tr>';
        for (let key in row) {
            table += `<td>${row[key]}</td>`;
        }
        table += '</tr>';
    });
    table += '</table>';
    return table;
}

console.log('Agendador de emails iniciado...');
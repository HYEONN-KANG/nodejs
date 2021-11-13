var db = require("./db");
var template = require("./template.js");
var qs = require("querystring");
var url = require("url");
var path = require("path");
var sanitizeHtml = require("sanitize-html");

exports.home = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    var title = "Welcome";
    var description = "Hello, Node.js";
    var list = template.list(topics);
    var html = template.HTML(
      title,
      list,
      `<h2>${title}</h2>${description}`,
      `<a href="/create">create</a>`
    );
    response.writeHead(200);
    response.end(html);
  });
};

exports.page = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;

  db.query(`SELECT * FROM topic;`, function (error, topics) {
    if (error) {
      throw error;
    }

    db.query(
      `SELECT * FROM topic LEFT JOIN author ON topic.author_id=author.id WHERE topic.id=?;`,
      [queryData.id],
      function (error2, topic) {
        if (error2) {
          throw error2;
        }
        var title = topic[0].title;
        var description = topic[0].description;
        var list = template.list(topics);
        var html = template.HTML(
          title,
          list,
          `
              <h2>${sanitizeHtml(title)}</h2>
              ${sanitizeHtml(description)}
              <p>by ${sanitizeHtml(topic[0].name)}</p>`,
          `<a href="/create">create</a> 
              <a href="/update?id=${queryData.id}">update</a>
              <form action="delete_process" method="post">
                <input type="hidden" name="id" value="${queryData.id}"/>
                <input type="submit" value="delete"/>
              </form>`
        );
        response.writeHead(200);
        response.end(html);
      }
    );
  });
};

exports.create = function (request, response) {
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;
    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;

      var title = "Create";
      var list = template.list(topics);
      var html = template.HTML(
        sanitizeHtml(title),
        list,
        `<h2>${title}</h2>
            <form action="/create_process" method="post">
              <p><input type="text" name="title" placeholder="title"></p>
              <p>
                  <textarea name="description" placeholder="descriptioin"></textarea>
              </p>
              <p>
                ${template.authoSelect(authors)}
              </p>
              <p>
                  <input type="submit">
              </p>
            </form>`,
        `<a href="/create">create</a>`
      );
      response.writeHead(200);
      response.end(html);
    });
  });
};

exports.create_process = function (request, response) {
  var body = ``;
  request.on("data", function (data) {
    body += data;
  });
  request.once("end", function () {
    var post = qs.parse(body);
    db.query(
      `INSERT INTO topic(title, description, created, author_id) VALUES(?, ?, NOW(), ?)`,
      [post.title, post.description, post.author],
      function (error, result) {
        if (error) throw error;
        response.writeHead(302, { Location: `/?id=${result.insertId}` });
        response.end();
      }
    );
  });
};

exports.update = function (request, response) {
  var _url = request.url;
  var queryData = url.parse(_url, true).query;
  db.query(`SELECT * FROM topic`, function (error, topics) {
    if (error) throw error;

    db.query("SELECT * FROM author", function (error2, authors) {
      if (error2) throw error2;

      var filteredId = path.parse(queryData.id).base;
      db.query(
        `SELECT * FROM topic WHERE id=?`,
        [filteredId],
        function (error, topic) {
          if (error) throw error;

          var list = template.list(topics);
          var html = template.HTML(
            sanitizeHtml(topic[0].title),
            list,
            `
              <h2>${topic[0].title}</h2>
                <form action="/update_process" method="post">
                  <input type="hidden" name="id" value="${filteredId}"/>
                    <p><input type="text" name="title" placeholder="title" value="${sanitizeHtml(
                      topic[0].title
                    )}"></p>
                    <p>
                    <textarea name="description" placeholder="descriptioin">${sanitizeHtml(
                      topic[0].description
                    )}</textarea>
                    </p>
                    <p>
                    ${template.authoSelect(authors, topic[0].author_id)}
                    </p>
                  <p>
                      <input type="submit">
                  </p>
                </form>
                `,
            `<a href="/create">create</a> <a href="/update?id=${filteredId}">update</a>`
          );
          response.writeHead(200);
          response.end(html);
        }
      );
    });
  });
};

exports.update_process = function (request, response) {
  var body = ``;
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var id = post.id;
    var title = post.title;
    var description = post.description;
    var author_id = post.author;
    db.query(
      `UPDATE topic SET title=?, description=?, author_id=? WHERE id=?;`,
      [title, description, author_id, id],
      function (error, result) {
        if (error) throw error;

        response.writeHead(302, { Location: `/?id=${id}` });
        response.end();
      }
    );
  });
};

exports.delete_process = function (request, response) {
  var body = ``;
  request.on("data", function (data) {
    body += data;
  });
  request.on("end", function () {
    var post = qs.parse(body);
    var id = post.id;
    var filteredId = path.parse(id).base;
    db.query(
      `DELETE FROM topic WHERE id=?`,
      [filteredId],
      function (error, result) {
        if (error) throw error;

        response.writeHead(302, { Location: `/` });
        response.end();
      }
    );
  });
};

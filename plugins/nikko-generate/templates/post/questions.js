module.exports = [
    {
        type:"input",
        name:"title",
        message:"Title",
        default:"Post title"
    },
    {
        type:"input",
        name:"slug",
        message:"Slug",
        default: function (answers) {
            return slugify(answers.title);
        }
    },
    {
        type:"input",
        name:"date",
        message:"Date",
        default: getFormattedDate(new Date())
    },
    {
        type:"input",
        name:"template",
        message:"Template",
        default:"post.hbs"
    },
    {
        type:"input",
        name:"tags",
        message:"Comma separated tags"
    },
    {
        type: "input",
        name: "content",
        message: "Content filler",
        default: "This is the content of my post!"
    },
    {
        type: "confirm",
        name: "draft",
        message: "Mark it as a draft?",
        default: false
    }
];


function getFormattedDate(date) {
    var year = date.getFullYear();
    var month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;
    var day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;
    return year + '-' + month + '-' + day;
}

function slugify(text) {
    text = text || '';
    text = text.replace(/^\s+|\s+$/g, '');
    text = text.toLowerCase();

    // remove accents
    var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuunc------";

    for (var i=0, l=from.length ; i<l ; i++) {
        text = text.replace(new RegExp(from.charAt(i), 'g'), to.charAt(i));
    }

    text = text.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return text;
  }
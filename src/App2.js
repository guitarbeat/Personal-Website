import "./sass/main.scss";
import moment from "moment";
import { useState } from "react";

const tag_color = {
Code: "#386FA4",
Paper: "#DE7254",
Misc: "#67a286",
};

function BackToTheTop() {
return (
<li className="back-to-the-top hidden" id="back-to-the-top">
<a href="#header" />
</li>
);
}

function NavBar({ items }) {
const links = Object.keys(items)
.reverse()
.map((key, i) => (
<li key={i} className="navbar__item">
<a href={items[key]}>{key}</a>
</li>
));

return (
<ul className="navbar">
{links}
<div class="theme-switch">
    <div class="switch"></div>
  </div>

  <BackToTheTop />
</ul>
);
}

function SocialMedia({ keywork, icon, link }) {
return (
<div className="social__icon">
<a href={link} target="_blank" rel="noreferrer">
<i className={icon} title={keywork} aria-label={"Go to " + keywork} />
</a>
</div>
);
}

function Header() {
const social_media = [
{
keywork: "Email",
icon: "fas fa-envelope-square",
link: "mailto:alwoods@utexas.edu",
},
{
    keywork: "LinkedIn",
    icon: "fab fa-linkedin",
    link: "https://www.linkedin.com/in/woods-aaron/",
    },
    {
    keywork: "Github",
    icon: "fab fa-github",
    link: "https://github.com/guitarbeat",
    },
    {
    keywork: "ORCID",
    icon: "fab fa-orcid",
    link: "https://orcid.org/0000-0001-6786-9243",
    },
    {
    keywork: "Instagram",
    icon: "fab fa-instagram",
    link: "https://www.instagram.com/guitarbeat/",
    },
    {
    keywork: "Twitter",
    icon: "fab fa-twitter",
    link: "https://twitter.com/WoodsResearch",
    },
    {
    keywork: "ResearchGate",
    icon: "fab fa-researchgate",
    link: "https://www.researchgate.net/profile/Aaron-Woods-7",
    },
    {
    keywork: "CV",
    icon: "fas fa-file-alt",
    link: "/cv.pdf",
    },
    ];
    
    return (
    <div className="container" id="header">
    <div className="container__content">
    <div className="header">
    <a>
    <img
    src={process.env.PUBLIC_URL + "/profile1.png"}
    className="header__picture"
    alt="me"
    />
    <img
    src={process.env.PUBLIC_URL + "/profile2.png"}
    className="header__picture"
    alt="me"
    />
    </a>
    <div className="header__text">
    <h1>Aaron </h1>
    <h1>Lorenzo </h1> <h1>Woods</h1>
    <br />
    <h2>Engineer</h2>
    <h2> | </h2>
    <h2>Artist</h2>
    <h2> | </h2>
            <h2>Scientist</h2>
            <br />
            <h3>Biomedical</h3>
            <h3> Engineering</h3>
            <h3> | </h3>
            <h3>University of Texas at Austin</h3>
          </div>
          <div className="social">
            {social_media.map((item, i) => (
              <SocialMedia
                key={i}
                keywork={item.keywork}
                icon={item.icon}
                link={item.link}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
function BlogPost({ posts }) {
return (
<div className="blog__content">
{posts.map((post, i) => (
<div key={i} className="blog__post">
<div className="blog__post__header">
<h1>{post.title}</h1>
<p>{moment(post.date).format("DD MMM YYYY")}</p>
</div>
<div className="blog__post__body" dangerouslySetInnerHTML={{ __html: post.body }} />
<p className="blog__post__footer">
{post.tags.map((tag, i) => (
<span
key={i}
style
{{ backgroundColor: tag_color[tag] }}
>
{tag}
</span>
))}
</p>
</div>
))}
</div>
);
}

function Blog({ posts }) {
let [filter, setFilter] = useState("");

function updateFilter(e) {
setFilter(e.target.value);
}

return (
<div className="container" id="blog">
<div className="container__content">
<h1>Blog</h1>
<input type="text" onChange={updateFilter} placeholder="Filter by tag" />
<BlogPost posts={posts.filter((post) => post.tags.includes(filter))} />
</div>
</div>
);
}

function Publications({ publications }) {
return (
<div className="container" id="publications">
<div className="container__content">
<h1>Publications</h1>
<table className="publications">
<thead>
<tr>
<th>Year</th>
<th>Title</th>
<th>Authors</th>
<th>Journal/Conference</th>
<th>PDF</th>
</tr>
</thead>
<tbody>
{publications.map((publication, i) => (
<tr key={i}>
<td>{publication.year}</td>
<td>{publication.title}</td>
<td>{publication.authors}</td>
<td>{publication.journal}</td>
<td>
                  <a href={publication.pdf} target="_blank" rel="noreferrer">
                    <i
                      className="fas fa-file-pdf"
                      title={publication.title}
                      aria-label={"Go to " + publication.title}
                    />
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
function Teaching({ teaching }) {
return (
<div className="container" id="teaching">
<div className="container__content">
<h1>Teaching</h1>
<table className="teaching">
<thead>
<tr>
<th>Semester</th>
<th>Course</th>
<th>University</th>
</tr>
</thead>
<tbody>
{teaching.map((class_, i) => (
<tr key={i}>
<td>{class_.semester}</td>
<td>{class_.course}</td>
<td>{class_.university}</td>
</tr>
))}
</tbody>
</table>
</div>
</div>
);
}

function Footer() {
return (
<div className="container" id="footer">
<div className="container__content">
<h3>
Made by{" "}
<a href="https://github.com/guitarbeat" target="_blank" rel="noreferrer">
Aaron Woods
</a>
</h3>
</div>
</div>
);
}

function App() {
let navbar_items = {
About: "#header",
Blog: "#blog",
Publications: "#publications",
Teaching: "#teaching",
};
let blog_posts = [
    {
    title: "Blog Post Title",
    author: "Author Name",
  date: moment("2022-01-01").format("MMMM Do YYYY"),
  tags: ["Tag 1", "Tag 2"],
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  link: "#",
},
{
  title: "Blog Post Title",
  author: "Author Name",
  date: moment("2022-02-01").format("MMMM Do YYYY"),
  tags: ["Tag 1", "Tag 2"],
  text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  link: "#",
},
];

let publications = [
{
title: "Publication Title",
authors: "Author 1, Author 2, Author 3",
journal: "Journal Name",
year: 2022,
pdf: "#",
},
{
title: "Publication Title",
authors: "Author 1, Author 2, Author 3",
journal: "Journal Name",
year: 2022,
pdf: "#",
},
];

let teaching = [
{
semester: "Fall 2022",
course: "BIOE 301",
university: "The University of Texas at Austin",
},
{
semester: "Spring 2023",
course: "BIOE 302",
university: "The University of Texas at Austin",
},
];

return (
<div>
<NavBar items={navbar_items} />
<Header />

  <Blog blog_posts={blog_posts} />

  <Publications publications={publications} />

  <Teaching teaching={teaching} />

  <Footer />
</div>
);
}

export default App;
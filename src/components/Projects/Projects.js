import React from "react";

const tag_color = {
  Code: "#386FA4",
  Paper: "#DE7254",
  Misc: "#67a286",
};

function ProjectCard({ title, content, slug, link, keyword, date, image }) {
  let _link = link ? (
    <div className="projects__card__label projects__card__link">Link</div>
  ) : null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer"
      className="projects__card"
      key={slug}
    >
      <div className="projects__card__keywords">
        {_link}
        <div
          className="projects__card__label"
          style={{ backgroundColor: tag_color[keyword] }}
        >
          {keyword}
        </div>
      </div>
      <h3>{title}</h3>
      <p style={{ fontStyle: "italic", color: "LightSteelBlue" }}>{date}</p>
      <p>{content}</p>
      {/* Only render the img element if the image prop is defined */}

      {image && <img src={image} className="project-image" alt="Project" />}
    </a>
  );
}

function Projects() {
  let projects = [
    {
      title: "Angiogenesis in the Mouse Cortex",
      slug: "angiogenesis-microscopy",
      date: "2022",
      keyword: "Misc",
      link: null,
      content:
        "We used two-photon microscopy to study blood vessel growth and regression in the mouse cortex. We developed a custom imaging system and analyzed the data using advanced image processing techniques. Our results provide new insights into the mechanisms underlying angiogenesis and have potential implications for the treatment of brain disorders.",
      image: "animation-vessels.gif",
    },
    {
      title: "Personal website",
      slug: "personal-website",
      date: "2022",
      keyword: "Code",
      link: null,
      content:
        "Random creative endeavor with a slew of features left to come. I prefer to take advantage of these opportunities to experiment with new tools and practice. Sass, flexbox, CSS animations, and React were all used. This project would not have been possible without Ines Almeida's help.",
      image: null,
    },
    {
      title: "Calibration of liquid crystal variable retarders",
      slug: "Publication",
      date: "2018",
      keyword: "Paper",
      link: "https://opg.optica.org/ao/fulltext.cfm?uri=ao-59-34-10673&id=443588",
      content:
        "I contributed to this paper by writing MATLAB and C++ code that enabled the LCVR to be calibrated using a common-path interferometer.",
      image: "waveplate.jpeg",
    },
    {
      title: "Data Collection for US Army NETCOM",
      slug: "Capston Project",
      date: "2020",
      keyword: "Misc",
      link: "https://www.youtube.com/watch?v=3L-qHfODnI4",
      content:
        "I was the project manager for this undergraduate senior capstone project. Our task was to improve a military data collection tool for network convergence. We used formative evaluation methods and usability testing to determine the best way to design the database and GUI.",
    },
    {
      title: "Made a song every day",
      slug: "Music",
      date: "2017",
      keyword: "Misc",
      link: "https://nini.bandcamp.com/",
      content:
        "When I first started making music, I set a goal of writing a song every day during my undergraduate degree's winter break. It was a difficult challenge, and some of the songs were terrible, but I learned a lot. I'm not particularly proud of any of the songs that resulted from this project, but rather, I'm proud of the process as a whole. Every day, I recorded, edited, mastered, and distributed songs. I haven't been as musically productive since.",
    },
    {
      title: "Mask-RCC for draft beer segmentation",
      slug: "mask-rcc",
      date: "2021",
      keyword: "Code",
      link: null,
      content:
        "I developed a mask-rcc algorithm for segmenting draft beer images to determine the quality of the pour. The project uses OpenCV and Python, and the code is available on my Github page. The algorithm uses Meta's Dectron2 for training.",
      img: null,
    },
    {
      title: "3D printed microscope",
      slug: "3d-microscope",
      date: "2021",
      keyword: "Misc",
      link: null,
      content:
        "I designed and built a microscope using 3D printed parts and off-the-shelf optical components. The microscope is capable of high-resolution imaging and can be assembled in a few hours using basic tools.",
    },
    {
      title: "Therosafe",
      slug: "Startup",
      date: "2020",
      keyword: "Misc",
      link: null,
      content:
        "I co-founded Therosafe, a company that provides products and services to reduce radiation exposure for people undergoing theranostic treatments. Our flagship product is a device for administering theranostic treatments safely and efficiently.",
    },
  ];

  let project_cards = projects
    .sort((a, b) => (a.date > b.date ? -1 : 1))
    .map((props) => <ProjectCard key={props.slug} {...props} />);

  return (
    <div className="container" id="projects">
      <div className="container__content">
        <h1>Some of my Projects</h1>
        <div className="projects">
          <div className="projects__cards_container">{project_cards}</div>
        </div>
      </div>
    </div>
  );
}

export default Projects;

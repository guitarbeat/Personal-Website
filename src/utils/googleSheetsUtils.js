import moment from "moment";

const aboutMapper = (row) => ({
  category: row.category,
  description: row.description,
});

const projectsMapper = (row) => ({
  title: row.title,
  slug: row.slug,
  date: row.date,
  keyword: row.keyword,
  link: row.link,
  content: row.content,
  image: row.image,
});

const workMapper = (row) => ({
  title: row.title,
  company: row.company,
  place: row.place,
  from: row.from,
  to: row.to,
  description: row.description,
  slug: row.slug,
});

const mappers = {
  about: aboutMapper,
  projects: projectsMapper,
  work: workMapper,
};

export const normalizeSheetData = (db, sheetName) => {
  const sheetData = db?.[sheetName];

  if (!Array.isArray(sheetData)) {
    return [];
  }

  const mapper = mappers[sheetName];
  if (!mapper) {
    // eslint-disable-next-line no-console
    console.warn(`No mapper found for sheet: ${sheetName}`);
    return sheetData;
  }

  return sheetData.map(mapper);
};

export const processWorkData = (jobs) => {
  if (!Array.isArray(jobs) || jobs.length === 0) {
    return { processedJobs: [], firstDate: moment().format("YYYY"), jobBars: [] };
  }

  let first_date = moment();
  const processedJobs = jobs.map((job) => {
    const _to_moment = job.to ? moment(job.to, "MM-YYYY") : moment();
    const _from_moment = moment(job.from, "MM-YYYY");
    const _duration = _to_moment.diff(_from_moment, "months");

    if (first_date.diff(_from_moment) > 0) {
      first_date = _from_moment;
    }

    return {
      ...job,
      from: _from_moment.format("MMM YYYY"),
      to: job.to ? _to_moment.format("MMM YYYY") : "Now",
      _from: _from_moment,
      _to: _to_moment,
      date:
        _duration === 0
          ? _from_moment.format("MMM YYYY")
          : `${_from_moment.format("MMM YYYY")} - ${_to_moment.format(
              "MMM YYYY",
            )}`,
      duration: _duration === 0 ? 1 : _duration,
    };
  });

  const time_span = moment().diff(first_date, "months");
  const safe_time_span = time_span === 0 ? 1 : time_span;

  const finalJobs = processedJobs.map((job) => ({
    ...job,
    bar_start:
      (100 * job._from.diff(first_date, "months")) / safe_time_span,
    bar_height: (100 * job.duration) / safe_time_span,
  }));

  const jobBars = finalJobs.map((job) => [job.bar_height, job.bar_start]);

  return {
    processedJobs: finalJobs,
    firstDate: first_date.format("YYYY"),
    jobBars,
  };
};

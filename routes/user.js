const express = require("express");

const axios = require("axios");

const FormData = require("form-data");

const admin = require("firebase-admin");

const { body, validationResult } = require("express-validator");

const geoip = require("geoip-country");

const router = express.Router();

const isAuth = require("../middleware/is_auth");

const baseUrl = "https://api.hiphopboombox.com/api/";

const baseUrl2 = "https://api.hiphopboombox.com/app/api/connection/query.php";

const baseUrl3 =
  "https://api.hiphopboombox.com/app/api/connection/newsQuery.php";

const serviceAccount = require("../boombox-437af-firebase-adminsdk-uwel1-41fad301ef.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const insertUrl = (url, method, data = null) => {
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: baseUrl + url,
    headers: {},
  };

  // console.log(method.toLowerCase());

  if (method.toLowerCase() === "post" && data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    config.data = formData;
    config.headers = { ...formData.getHeaders() }; // Set headers for form data
  }

  return config;
};

const selectUrl = (method, data = null) => {
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: baseUrl2,
    headers: {},
  };

  // console.log(method.toLowerCase());

  if (method.toLowerCase() === "post" && data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    config.data = formData;
    config.headers = { ...formData.getHeaders() }; // Set headers for form data
  }

  return config;
};

const selectNewsUrl = (method, data = null) => {
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: baseUrl3,
    headers: {},
  };

  // console.log(method.toLowerCase());

  if (method.toLowerCase() === "post" && data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    config.data = formData;
    config.headers = { ...formData.getHeaders() }; // Set headers for form data
  }

  return config;
};

const getData = (url, method, data = null) => {
  let config = {
    method: method,
    maxBodyLength: Infinity,
    url: baseUrl + url,
    headers: {},
  };

  // console.log(method.toLowerCase());

  if (method.toLowerCase() === "post" && data) {
    const formData = new FormData();
    for (const key in data) {
      formData.append(key, data[key]);
    }
    config.data = formData;
    config.headers = { ...formData.getHeaders() }; // Set headers for form data
  }

  return config;
};

// const hgetData = (data) => {
//   let config = {
//     method: "post",
//     maxBodyLength: Infinity,
//     url: "",
//     headers: {
//       Authorization:
//         "Bearer",
//       "Content-Type": "application/json",
//     },
//     data: data,
//   };

//   return config;
// };

// const fetchData = async (data) => {
//   try {
//     const response = await axios.request(hgetData(data));
//     return response.data;
//   } catch (error) {
//     console.error("Error fetching data:", error);
//     throw error; // Re-throw the error for further handling if necessary
//   }
// };

async function fetchPageData() {
  try {
        // Execute both requests concurrently with Promise.all
        const [response, response2] = await Promise.all([
          axios.request(insertUrl("get/pages.php", "get")),
          axios.request(insertUrl("get/ads.php", "get"))
        ]);

        // Extract data from responses
        const data = response.data;
        const data2 = response2.data;

        // Handle the data as needed
        // console.log("Pages Data:", data);
        // console.log("Ads Data:", data2);

        // Return both data sets if needed
        return { data, data2 };

      }
  
  catch (error) {
    // Handle errors here
    console.error("Error fetching data:", error);
    // Optionally, you can return an empty object or error message
    return { error: "Failed to fetch data" };
  }
}

const homeDD = async () => {
  const today = new Date();
  const x = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
  // console.log(x);

  const startYear = today.getFullYear() - 1; // Calculate the start year (last year)
  const startDate = `${startYear}-01-01`;

  const numberOfVisitorsInRealTimeData = JSON.stringify({
    dateRanges: [
      {
        startDate: x,
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
      },
    ],
  });

  const totalNumberOfVisitorsData = JSON.stringify({
    dateRanges: [
      {
        startDate: "28daysAgo",
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "activeUsers",
      },
    ],
  });

  const dailyVisitorsData = JSON.stringify({
    dateRanges: [
      {
        startDate: x,
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "totalUsers",
      },
    ],
  });

  const weeklyVisitorsData = JSON.stringify({
    dateRanges: [
      {
        startDate: "7daysAgo",
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "totalUsers",
      },
    ],
  });

  const monthlyVisitorsData = JSON.stringify({
    dateRanges: [
      {
        startDate: "30daysAgo",
        endDate: "today",
      },
    ],
    metrics: [
      {
        name: "totalUsers",
      },
    ],
  });

  const yearlyVisitorsData = JSON.stringify({
    dateRanges: [
      {
        startDate: startDate,
        endDate: x,
      },
    ],
    metrics: [
      {
        name: "totalUsers",
      },
    ],
  });

  try {
    const [
      numberOfVisitorsInRealTime,
      totalNumberOfVisitors,
      dailyVisitors,
      weeklyVisitors,
      monthlyVisitors,
      yearlyVisitors,
    ] = await Promise.all([
      fetchData(numberOfVisitorsInRealTimeData),
      fetchData(totalNumberOfVisitorsData),
      fetchData(dailyVisitorsData),
      fetchData(weeklyVisitorsData),
      fetchData(monthlyVisitorsData),
      fetchData(yearlyVisitorsData),
    ]);

    // console.log(totalNumberOfVisitors?.rows[0].metricValues[0].value);
    // console.log(numberOfVisitorsInRealTime);
    // console.log(dailyVisitors, weeklyVisitors, monthlyVisitors, yearlyVisitors);

    return {
      totalNumberOfVisitors: totalNumberOfVisitors.hasOwnProperty("rows")
        ? totalNumberOfVisitors?.rows[0].metricValues[0].value
        : 0,
      numberOfVisitorsInRealTime: numberOfVisitorsInRealTime.hasOwnProperty(
        "rows"
      )
        ? numberOfVisitorsInRealTime?.rows[0].metricValues[0].value
        : 0,
      dailyVisitors: dailyVisitors.hasOwnProperty("rows")
        ? dailyVisitors?.rows[0].metricValues[0].value
        : 0,
      weeklyVisitors: weeklyVisitors.hasOwnProperty("rows")
        ? weeklyVisitors?.rows[0].metricValues[0].value
        : 0,
      monthlyVisitors: monthlyVisitors.hasOwnProperty("rows")
        ? monthlyVisitors?.rows[0].metricValues[0].value
        : 0,
      yearlyVisitors: yearlyVisitors.hasOwnProperty("rows")
        ? yearlyVisitors?.rows[0].metricValues[0].value
        : 0,
    };
  } catch (error) {
    console.error("Error in fetching all data:", error);
  }
};

router.get("/home", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const postData = { q2: "SELECT COUNT(*) AS cat FROM category" };

    const response = await axios.request(selectUrl("post", postData));

    const data = response.data[0]?.cat;

    const postData2 = { q2: "select COUNT(*) AS post from posts" };

    const response2 = await axios.request(selectUrl("post", postData2));

    const data2 = response2.data[0]?.post;

    return res.render("home", {
      title1: "Home",
      errorMessage: message,
      category: data,
      posts: data2,
    });
    // }
    // else {
    // 	console.log("Invalid data..");
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("home error", error);
  }
});

router.get("/category", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data;

    return res.render("category", {
      title1: "category",
      editing: false,
      errorMessage: message,
      category: data,
      category2: "",
      id: "",
      oldInput: {
        name: "",
      },
      path: "post",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("home error", error);
  }
});

router.get("/newsCategory", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data;

    return res.render("category", {
      title1: "news category",
      editing: false,
      errorMessage: message,
      category: data,
      category2: "",
      id: "",
      oldInput: {
        name: "",
      },
      path: "blog",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("home error", error);
  }
});

router.get("/category/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data;

    const postData = { q2: `SELECT * FROM category where id = ${id}` };
    const response2 = await axios.request(selectUrl("post", postData));
    const data2 = response2.data;
    // console.log(data2[0].id);

    return res.render("category", {
      title1: "category",
      editing: true,
      errorMessage: message,
      category: data,
      category2: data2,
      id: data2[0].id,
      oldInput: {
        name: "",
      },
      path: "post",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to update category. Try again...");
    return res.redirect("/v1/category");
  }
});

router.get("/newsCategory/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data;

    const postData = { q2: `SELECT * FROM category where id = ${id}` };
    const response2 = await axios.request(selectNewsUrl("post", postData));
    const data2 = response2.data;
    // console.log(data2[0].id);

    return res.render("category", {
      title1: "news category",
      editing: true,
      errorMessage: message,
      category: data,
      category2: data2,
      id: data2[0].id,
      oldInput: {
        name: "",
      },
      path: "blog",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to update category. Try again...");
    return res.redirect("/v1/newsCategory");
  }
});

router.get("/delcat/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData2 = { q1: `DELETE FROM tags where category_id = ${id}` };
    const response3 = await axios.request(selectUrl("post", postData2));

    // if (req.session._prodToken === req.user?.rem_token) {
    const postData = { q1: `DELETE FROM category where id = ${id}` };
    const response2 = await axios.request(selectUrl("post", postData));

    return res.redirect("/v1/category");
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to delete category. Try again...");
    return res.redirect("/v1/category");
  }
});

router.get("/newsdelcat/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData2 = { q1: `DELETE FROM tags where category_id = ${id}` };
    const response3 = await axios.request(selectNewsUrl("post", postData2));

    // if (req.session._prodToken === req.user?.rem_token) {
    const postData = { q1: `DELETE FROM category where id = ${id}` };
    const response2 = await axios.request(selectNewsUrl("post", postData));

    return res.redirect("/v1/newsCategory");
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to delete category. Try again...");
    return res.redirect("/v1/newsCategory");
  }
});

router.get("/filter/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;

    // Log the values to verify
    // console.log(id, type, name, type && name == undefined);
    // console.log(req.query.name);

    let data2 = "";

    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data.filter(
      (i) => i.name.toLowerCase() != "trending now"
    );

    if (id && type == "" && name == "") {
      // console.log("jjhj");
      const postData5 = { cId: Number(id), offset: 0, filter: "o" };
      const response6 = await axios.request(
        insertUrl("get/categories_post.php", "post", postData5)
      );
      const data6 = response6.data?.results;
      // console.log(data6);

      return res.render("post", {
        title1: "All Post",
        errorMessage: message,
        category: data,
        showData: data6.reverse(),
        type: "",
        path: "post",
      });
    } else if (type && name == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();
      const postData = { date: today };
      const response2 = await axios.request(
        insertUrl("get/postByDate.php", "post", postData)
      );
      data2 = response2.data;

      // console.log(data2);

      return res.render("post", {
        title1: "All Post",
        errorMessage: message,
        category: data,
        showData: data2.reverse(),
        type: type,
        path: "post",
      });
    } else {
      const postData = { s: name };
      const response3 = await axios.request(
        insertUrl("get/search.php", "post", postData)
      );
      const data3 =
        response3.data != "" ? response3.data.reverse() : response3.data;

      // console.log(data3);

      return res.render("post", {
        title1: "All Post",
        errorMessage: message,
        category: data,
        showData: data3,
        type: "",
        path: "post",
      });
    }
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
  }
});

router.get("/blogFilter/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;

    // Log the values to verify
    // console.log(id, type, name, type && name == undefined);
    // console.log(req.query.name);

    let data2 = "";

    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data;

    if (id && type == "" && name == "") {
      // console.log("jjhj");
      const postData5 = { cId: Number(id), offset: 0, filter: "o" };
      const response6 = await axios.request(
        insertUrl("news/get/categories_post.php", "post", postData5)
      );
      const data6 = response6.data?.results;
      // console.log(data6);

      return res.render("post", {
        title1: "Blog Post",
        errorMessage: message,
        category: data,
        showData: data6.reverse(),
        type: "",
        path: "blog",
      });
    } 
    
    else if (type && name == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();
      const postData = { date: today };
      const response2 = await axios.request(
        insertUrl("news/get/postByDate.php", "post", postData)
      );
      data2 = response2.data;

      // console.log(data2);

      return res.render("post", {
        title1: "Blog Post",
        errorMessage: message,
        category: data,
        showData: data2.reverse(),
        type: type,
        path: "blog",
      });
    } 
    
    else {
      const postData = { s: name };
      const response3 = await axios.request(
        insertUrl("news/get/search.php", "post", postData)
      );
      const data3 =
        response3.data != "" ? response3.data.reverse() : response3.data;

      // console.log(data3);

      return res.render("post", {
        title1: "Blog Post",
        errorMessage: message,
        category: data,
        showData: data3,
        type: "",
        path: "blog",
      });
    }
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/category",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category is required.")
      .isString()
      .withMessage("Category must be a string.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Category can only contain letters and spaces."),
  ],
  async (req, res, next) => {
    try {
      // console.log(req.body);

      const { name } = req.body;

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await axios.request(
          insertUrl("get/categories.php", "get")
        );
        const data = response.data;

        return res.render("category", {
          title1: "category",
          editing: false,
          errorMessage: msg1,
          category: data,
          category2: "",
          id: "",
          oldInput: {
            name: name,
          },
          path: "post",
        });
      } else {
        const postData = { name: name };
        const response2 = await axios.request(
          insertUrl("insert/category.php", "post", postData)
        );
        const data2 = response2.data;

        if (data2.isSuccess == true) {
          return res.redirect("/v1/category");
        } else {
          req.flash("error", "Failed... try again...");
          return res.redirect("/v1/category");
        }
      }
    } catch (error) {
      console.log("category error", error);
      return res.redirect("/v1/category");
    }
  }
);

router.post(
  "/newsCategory",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Category is required.")
      .isString()
      .withMessage("Category must be a string.")
      .matches(/^[A-Za-z\s]+$/)
      .withMessage("Category can only contain letters and spaces."),
  ],
  async (req, res, next) => {
    try {
      // console.log(req.body);

      const { name } = req.body;

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await axios.request(
          insertUrl("news/get/categories.php", "get")
        );
        const data = response.data;

        return res.render("category", {
          title1: "news category",
          editing: false,
          errorMessage: msg1,
          category: data,
          category2: "",
          id: "",
          oldInput: {
            name: name,
          },
          path: "post",
        });
      } else {
        const postData = { name: name };
        const response2 = await axios.request(
          insertUrl("news/insert/category.php", "post", postData)
        );
        const data2 = response2.data;

        if (data2.isSuccess == true) {
          return res.redirect("/v1/newsCategory");
        } else {
          req.flash("error", "Failed... try again...");
          return res.redirect("/v1/newsCategory");
        }
      }
    } catch (error) {
      console.log("category error", error);
      return res.redirect("/v1/newsCategory");
    }
  }
);

router.post("/editcat", async (req, res, next) => {
  try {
    const { cid, name } = req.body;
    // console.log(id, name);

    const postData = {
      q1: `UPDATE category set name = '${name}' where id = ${cid}`,
    };
    const response2 = await axios.request(selectUrl("post", postData));

    return res.redirect("/v1/category");
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to update category. Try again...");
    return res.redirect("/v1/category");
  }
});

router.post("/editNewsCat", async (req, res, next) => {
  try {
    const { cid, name } = req.body;
    // console.log(id, name);

    const postData = {
      q1: `UPDATE category set name = '${name}' where id = ${cid}`,
    };
    const response2 = await axios.request(selectNewsUrl("post", postData));

    return res.redirect("/v1/newsCategory");
  } catch (error) {
    console.log(error);
    req.flash("error", "Failed to update category. Try again...");
    return res.redirect("/v1/newsCategory");
  }
});

router.get("/add", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data.filter(
      (i) => i.name.toLowerCase() != "trending now"
    );

    return res.render("add", {
      title1: "Add Post",
      editing: false,
      errorMessage: message,
      category: data,
      sid: "",
      oldInput: {
        title: "",
        tt: "",
        dt: "",
        des: "",
        sm: "",
        logo: "",
        portrait_image: "",
        fileCode: "",
        link: "",
        tags: [],
      },
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("add form error", error);
  }
});

router.post(
  "/add",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("tt")
      .trim()
      .notEmpty()
      .withMessage("Title Translate is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title Translate..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description..."),
    body("dt")
      .trim()
      .notEmpty()
      .withMessage("Description Translate is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description Translate..."),
    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
    body("portrait_image")
      .trim()
      .notEmpty()
      .withMessage("Portrait Image is required")
      .escape(),
    body("tags").trim().notEmpty().withMessage("Category is required"),
  ],
  async (req, res, next) => {
    try {
      const { title, tt, dt, des, sm, logo, portrait_image, fileCode, link, tags } =
        req.body;
      
      const sm2 = sm.trim();
      
      // console.log(sm2);

      const cleanedTags =
        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

      // console.log(req.body, fileCode == '', link == '', fileCode == '' && link == '');

      const response = await axios.request(
        insertUrl("get/categories.php", "get")
      );
      const data = response.data.filter(
        (i) => i.name.toLowerCase() != "trending now"
      );

      // console.log(tags.length, cleanedTags, typeof cleanedTags);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        // console.log(data);
        let msg1 = error.array()[0].msg;

        // console.log(msg1);

        return res.render("add", {
          title1: "Add Post",
          editing: false,
          errorMessage: msg1,
          category: data,
          sid: "",
          oldInput: {
            title: title,
            des: des,
            tt: tt,
            dt: dt,
            sm: sm2,
            logo: logo,
            portrait_image: portrait_image,
            fileCode: fileCode,
            link: link,
            tags: cleanedTags,
          },
        });
      } else {
        if (fileCode == "" && link == "") {
          // console.log(data);
          let msg1 = "Upload either video or link...";

          // console.log(msg1);

          return res.render("add", {
            title1: "Add Post",
            editing: false,
            errorMessage: msg1,
            category: data,
            sid: "",
            oldInput: {
              title: title,
              des: des,
              tt: tt,
              dt: dt,
              sm: sm2,
              logo: logo,
              portrait_image: portrait_image,
              fileCode: fileCode,
              link: link,
              tags: cleanedTags,
            },
          });
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "insert/post.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              title: title,
              title_translate: tt,
              des: des,
              des_translate: dt,
              social_media: sm2,
              image: logo,
              portrait_image: portrait_image,
              video: fileCode,
              link: link,
              tags: cleanedTags,
            }),
          };

          const response = await axios.request(config);
          const data = response.data;

          console.log(data);

          return res.redirect("/v1/post");
        }
      }
    } catch (error) {
      console.log("add form error", error);
    }
  }
);

router.get("/post", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data.filter(
      (i) => i.name.toLowerCase() != "trending now"
    );

    let today = new Date();
    today =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1) +
      "-" +
      today.getDate();
    const postData = { date: today };
    const response2 = await axios.request(
      insertUrl("get/postByDate.php", "post", postData)
    );
    const data2 = response2.data;

    // console.log(data2);

    return res.render("post", {
      title1: "All Post",
      errorMessage: message,
      category: data,
      showData: data2.reverse(),
      type: "",
      path: "post",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log(error);
  }
});

router.get("/view/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/categories.php", "get")
    );
    const data = response.data.filter(
      (i) => i.name.toLowerCase() != "trending now"
    );

    const postData = { id: id };
    const response2 = await axios.request(
      insertUrl("get/postById.php", "post", postData)
    );
    const data2 = response2.data;

    const postData2 = { postId: id };
    const response3 = await axios.request(
      insertUrl("get/postTags.php", "post", postData2)
    );
    const data3 = response3.data.map((i) => i.id);

    // console.log(data2, data3);

    return res.render("add", {
      title1: "Edit Post",
      editing: true,
      errorMessage: message,
      category: data,
      sid: data2[0].id,
      oldInput: {
        title: data2[0].title,
        des: data2[0].des,
        tt: data2[0].title_translate,
        dt: data2[0]?.des_translate.trim(''),
        sm: data2[0].social_media,
        logo: data2[0].image,
        portrait_image: data2[0].portrait_image,
        fileCode: data2[0].video,
        link: data2[0].link,
        tags: data3,
      },
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("update post error", error);
  }
});

router.post(
  "/view/:id",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("tt")
      .trim()
      .notEmpty()
      .withMessage("Title Translate is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title Translate..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/u) // The 'u' flag enables Unicode support
      .withMessage("Invalid Description..."),
    body("dt")
      .trim()
      .notEmpty()
      .withMessage("Description Translate is required")
      .matches(/^[^<>]*$/u)
      .withMessage("Invalid Description Translate..."),
    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
    body("portrait_image")
      .trim()
      .notEmpty()
      .withMessage("Portrait Image is required")
      .escape(),
    body("tags").trim().notEmpty().withMessage("Category is required"),
  ],
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const { title, des, tt, dt, sm, logo, portrait_image, fileCode, link, tags } =
        req.body;
      
      const sm2 = sm.trim();

      // console.log(req.body, id);

      const cleanedTags =
        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

      const response = await axios.request(
        insertUrl("get/categories.php", "get")
      );
      const data = response.data.filter(
        (i) => i.name.toLowerCase() != "trending now"
      );

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        // console.log(msg1);

        return res.render("add", {
          title1: "Edit Post",
          editing: true,
          errorMessage: msg1,
          category: data,
          sid: id,
          oldInput: {
            title: title,
            des: des,
            tt: tt,
            dt: dt.trim(),
            sm: sm2,
            logo: logo,
            portrait_image: portrait_image,
            fileCode: fileCode,
            link: link,
            tags: cleanedTags,
          },
        });
      } else {
        if (fileCode == "" && link == "") {
          let msg1 = "Upload either video or link...";

          // console.log(msg1);

          return res.render("add", {
            title1: "Edit Post",
            editing: true,
            errorMessage: msg1,
            category: data,
            sid: id,
            oldInput: {
              title: title,
              des: des,
              tt: tt,
              dt: dt,
              sm: sm2,
              logo: logo,
              portrait_image: portrait_image,
              fileCode: fileCode,
              link: link,
              tags: cleanedTags,
            },
          });
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "update/post.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              title: title,
              title_translate: tt,
              des: des,
              des_translate: dt,
              social_media: sm2,
              image: logo,
              portrait_image: portrait_image,
              video: fileCode,
              link: link,
              tags: cleanedTags,
              id: id,
            }),
          };

          const response = await axios.request(config);
          const data = response.data;

          // console.log(data);

          return res.redirect("/v1/post");
        }
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "failed to update. Try again...");
      return res.redirect(`/v1/view/${id}`);
    }
  }
);

router.get("/delete/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("delete/post.php", "post", postData)
    );
    const data2 = response.data;

    if (data2.isSuccess == true) {
      return res.redirect("/v1/post");
    } else {
      req.flash("error", "Failed to delete post, Try again...");
      return res.redirect("/v1/post");
    }
  } catch (error) {
    console.log("delete post error", error);
  }
});

router.get("/va", isAuth, async (req, res, next) => {
  try {
    // console.log(req.query);
    const ts = req.query.ts || "n";

    // console.log(ts);

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const postData = { filter: ts };
    const response2 = await axios.request(
      getData("get/trending.php", "post", postData)
    );
    const data2 = response2.data;

    // console.log(data2);

    return res.render("va", {
      title1: "Video Analysis",
      errorMessage: message,
      heading: "Trending Now",
      ts: ts,
      showData: data2,
    });
  } catch (error) {
    console.log(error);
  }
});

router.get("/addBlog", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data;

    // console.log(data);

    return res.render("add_blog", {
      title1: "Add Blog",
      editing: false,
      errorMessage: message,
      category: data,
      sid: "",
      oldInput: {
        title: "",
        des: "",
        logo: "",
        tags: [],
      },
    });
  } catch (error) {
    console.log("add blog error", error);
  }
});

router.post(
  "/addBlog",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description..."),
    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
    body("tags").trim().notEmpty().withMessage("Category is required"),
  ],
  async (req, res, next) => {
    try {
      const { title, des, logo, tags } = req.body;

      const cleanedTags =
        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

      // console.log(req.body);

      const response = await axios.request(
        insertUrl("news/get/categories.php", "get")
      );
      const data = response.data;

      // console.log(tags.length, cleanedTags, typeof cleanedTags);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("add_blog", {
          title1: "Add Blog",
          editing: false,
          errorMessage: msg1,
          category: data,
          sid: "",
          oldInput: {
            title: title,
            des: des,
            logo: logo,
            tags: cleanedTags,
          },
        });
      }
      
      else {
        let data1 = JSON.stringify({
          title: title,
          des: des,
          image: logo,
          tags: cleanedTags,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "news/insert/post.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: data1,
        };

        const response2 = await axios.request(config);
        const data2 = response2.data;

        // console.log(data2);

        return res.redirect("/v1/blogPost");
      }
    } catch (error) {
      console.log("add blog error", error);
    }
  }
);

router.get("/blogPost", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data;

    let today = new Date();
    today =
      today.getFullYear() +
      "-" +
      String(today.getMonth() + 1) +
      "-" +
      today.getDate();
    const postData = { date: today };
    const response2 = await axios.request(
      insertUrl("news/get/postByDate.php", "post", postData)
    );
    const data2 = response2.data;

    // console.log(data2);

    return res.render("post", {
      title1: "Blog Post",
      errorMessage: message,
      category: data,
      showData: data2.reverse(),
      type: "",
      path: "blog",
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("get blog post error", error);
  }
});

router.get("/viewBlog/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("news/get/categories.php", "get")
    );
    const data = response.data.filter(
      (i) => i.name.toLowerCase() != "trending now"
    );

    const postData = { id: id };
    const response2 = await axios.request(
      insertUrl("news/get/postById.php", "post", postData)
    );
    const data2 = response2.data;

    const postData2 = { postId: id };
    const response3 = await axios.request(
      insertUrl("news/get/postTags.php", "post", postData2)
    );
    const data3 = response3.data.map((i) => i.id);

    // console.log(data3);

    return res.render("add_blog", {
      title1: "Edit Blog Post",
      editing: true,
      errorMessage: message,
      category: data,
      sid: data2[0].id,
      oldInput: {
        title: data2[0].title,
        des: data2[0].des,
        logo: data2[0].image,
        tags: data3,
      },
    });
    // }
    // else {
    // 	return res.redirect("/");
    // }
  } catch (error) {
    console.log("update post error", error);
  }
});

router.post(
  "/viewBlog/:id",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description..."),
    body("logo").trim().notEmpty().withMessage("Image is required").escape(),
    body("tags").trim().notEmpty().withMessage("Category is required"),
  ],
  async (req, res, next) => {
    const { id } = req.params;
    try {
      const { title, des, logo, tags } = req.body;

      // console.log(req.body);

      const cleanedTags =
        typeof tags == "object" ? tags.filter((tag) => tag !== "") : [tags];

      const response = await axios.request(
        insertUrl("news/get/categories.php", "get")
      );
      const data = response.data;

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        // console.log(msg1);

        return res.render("add_blog", {
          title1: "Edit Blog Post",
          editing: true,
          errorMessage: msg1,
          category: data,
          sid: id,
          oldInput: {
            title: title,
            des: des,
            logo: logo,
            tags: cleanedTags,
          },
        });
      } else {
        let data1 = JSON.stringify({
          title: title,
          des: des,
          image: logo,
          tags: cleanedTags,
          id: id,
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "news/update/post.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: data1,
        };

        const response2 = await axios.request(config);
        const data2 = response2.data;

        // console.log(data2);

        return res.redirect("/v1/blogPost");
      }
    } catch (error) {
      console.log(error);
      req.flash("error", "failed to update. Try again...");
      return res.redirect(`/v1/viewBlog/${id}`);
    }
  }
);

router.get("/deleteBlog/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("news/delete/post.php", "post", postData)
    );
    const data2 = response.data;

    if (data2.isSuccess == true) {
      return res.redirect("/v1/blogPost");
    } else {
      req.flash("error", "Failed to delete post, Try again...");
      return res.redirect("/v1/blogPost");
    }
  } catch (error) {
    console.log("delete post error", error);
  }
});

router.get("/user", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    const page = parseInt(req.query.page) || 1;

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    async function users(o) {
      const postData = { offset: o, filter: "n" };
      const response = await axios.request(
        getData("get/users.php", "post", postData)
      );
      const totalCount = response.data?.totalCount;
      const pageCount = Math.ceil(totalCount / 10);

      const x = response.data?.results.map((i) => {
        let geo = geoip.lookup(i.ip_address);
        return {
          ...i,
          ...geo,
        };
      });
      return {
        data: x,
        pageCount,
      };
    }

    if (page > 1) {
      let offset = 10 * (page - 1);
      const data1 = await users(offset);

      const x = data1?.data.map((i) => {
        let geo = geoip.lookup(i.ip_address);
        return {
          ...i,
          ...geo,
        };
      });

      return res.render("user", {
        title1: "Users",
        errorMessage: message,
        type: "",
        showData: x,
        count: data1?.pageCount,
        cp: page,
      });
    } else {
      const data1 = await users(0);

      // console.log(data1);

      return res.render("user", {
        title1: "Users",
        errorMessage: message,
        type: "",
        showData: data1?.data,
        count: data1?.pageCount,
        cp: page,
      });
    }
  } catch (error) {
    console.log("user page", error);
  }
});

router.get("/search", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;

    if (name && type == undefined) {
      const postData = { s: name };
      const response = await axios.request(
        getData("get/userSearch.php", "post", postData)
      );

      const x = response.data.map((i) => {
        let geo = geoip.lookup(i.ip_address);
        return {
          ...i,
          ...geo,
        };
      });

      // console.log(data1);

      return res.render("user", {
        title1: "Users",
        errorMessage: message,
        type: "",
        showData: x,
        count: 0,
        cp: 1,
      });
    } else if (type && name == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();

      const postData = { date: today };
      const response = await axios.request(
        getData("get/postUserByDate.php", "post", postData)
      );

      const x = response.data.map((i) => {
        let geo = geoip.lookup(i.ip_address);
        return {
          ...i,
          ...geo,
        };
      });

      return res.render("user", {
        title1: "Users",
        errorMessage: message,
        type: today,
        showData: x,
        count: 0,
        cp: 1,
      });
    } else {
      return res.redirect("/v1/user");
    }
  } catch (error) {
    console.log("user search error", error);
  }
});

router.get("/poll", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(getData("get/poll.php", "get"));
    const data = response.data;

    // console.log(data);

    return res.render("poll", {
      title1: "Poll",
      errorMessage: message,
      showData: data,
    });
  } catch (error) {
    console.log("Poll Error", error);
  }
});

router.get("/addPoll", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("add_poll", {
      title1: "Add Poll",
      editing: false,
      errorMessage: message,
      sid: "",
      oldInput: {
        question: "",
        ques_tr: "",
        logo: "",
        landscape_img: "",
        answer: "",
        options: [],
      },
    });
  } catch (error) {
    console.log("Poll Error", error);
  }
});

router.post(
  "/addPoll",
  [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Question..."),
    body("ques_tr")
      .trim()
      .notEmpty()
      .withMessage("Question Translate is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Question Translate..."),
    body("options").trim().notEmpty().withMessage("Options are required"),
    body("answer")
      .trim()
      .notEmpty()
      .withMessage("Answer is required")
      .isNumeric()
      .withMessage("Answer must be a number"),
  ],
  async (req, res, next) => {
    try {
      const { question, ques_tr, logo, landscape_img, options, answer } =
        req.body;

      // console.log(req.body);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        // console.log(msg1);

        return res.render("add_poll", {
          title1: "Add Poll",
          editing: false,
          errorMessage: msg1,
          sid: "",
          oldInput: {
            question: question,
            ques_tr: ques_tr,
            logo: logo,
            landscape_img: landscape_img,
            answer: answer,
            options: options,
          },
        });
      } else {
        if (logo == "" && landscape_img == "") {
          return res.render("add_poll", {
            title1: "Add Poll",
            editing: false,
            errorMessage: "Upload either Portrait or Landscape image...",
            sid: "",
            oldInput: {
              question: question,
              ques_tr: ques_tr,
              logo: logo,
              landscape_img: landscape_img,
              answer: answer,
              options: options,
            },
          });
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "insert/poll.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              pImg: logo,
              lImg: landscape_img,
              question: question,
              ques_tr: ques_tr,
              options: options,
              answer: answer,
            }),
          };

          const response = await axios.request(config);
          const data = response.data;

          // console.log(data);

          return res.redirect("/v1/poll");
        }
      }
    } catch (error) {
      console.log("post poll error", error);
    }
  }
);

router.get("/viewPoll/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const postData = { id: id };
    const response = await axios.request(
      getData("get/pollById.php", "post", postData)
    );
    const data = response.data;

    const postData11 = { pollId: id };
    const response11 = await axios.request(
      getData("get/getVote.php", "post", postData11)
    );
    const data11 = response11.data.map((i) => i.option_text);

    // console.log(data, data11);

    return res.render("add_poll", {
      title1: "Edit Poll",
      editing: true,
      errorMessage: message,
      sid: id,
      oldInput: {
        question: data[0].question,
        ques_tr: data[0].ques_translate,
        logo: data[0].portrait_image,
        landscape_img: data[0].landscape_img,
        answer: data[0].answer,
        options: data11,
      },
    });
  } catch (error) {
    console.log("edit poll error", error);
  }
});

router.post(
  "/viewPoll/:id",
  [
    body("question")
      .trim()
      .notEmpty()
      .withMessage("Question is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Question..."),
    body("ques_tr")
      .trim()
      .notEmpty()
      .withMessage("Question Translate is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Question Translate..."),
    body("options").trim().notEmpty().withMessage("Options are required"),
    body("answer")
      .trim()
      .notEmpty()
      .withMessage("Answer is required")
      .isNumeric()
      .withMessage("Answer must be a number"),
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;

      const { question, ques_tr, logo, landscape_img, options, answer } =
        req.body;

      // console.log(req.body);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        // console.log(msg1);

        return res.render("add_poll", {
          title1: "Edit Poll",
          editing: true,
          errorMessage: msg1,
          sid: id,
          oldInput: {
            question: question,
            ques_tr: ques_tr,
            logo: logo,
            landscape_img: landscape_img,
            answer: answer,
            options: options,
          },
        });
      } else {
        if (logo == "" && landscape_img == "") {
          return res.render("add_poll", {
            title1: "Edit Poll",
            editing: true,
            errorMessage: "Upload either Portrait or Landscape image...",
            sid: id,
            oldInput: {
              question: question,
              ques_tr: ques_tr,
              logo: logo,
              landscape_img: landscape_img,
              answer: answer,
              options: options,
            },
          });
        } else {
          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "update/poll.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: JSON.stringify({
              pImg: logo,
              lImg: landscape_img,
              question: question,
              ques_tr: ques_tr,
              options: options,
              answer: answer,
              id: id,
            }),
          };

          const response = await axios.request(config);
          const data = response.data;

          // console.log(data);

          return res.redirect("/v1/poll");
        }
      }
    } catch (error) {
      console.log("edit poll post error", error);
    }
  }
);

router.get("/deletePoll/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("delete/poll.php", "post", postData)
    );
    const data2 = response.data;

    // console.log(data2, id);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/poll");
    } else {
      req.flash("error", "Failed to delete post, Try again...");
      return res.redirect("/v1/poll");
    }
  } catch (error) {
    console.log("delete post error", error);
  }
});

router.get("/footer/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  try {
    // console.log(id);

    let message = req.flash("error");
    // console.log(message);

    if (id == 1) {
      const postData = { t: "terms" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("terms", {
        title1: "Terms",
        errorMessage: message.length > 0 ? message[0] : "null",
        showData: data2,
        id: id,
      });
    } else if (id == 2) {
      const postData = { t: "privacy" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("privacy", {
        title1: "Privacy",
        errorMessage: message.length > 0 ? (message = message[0]) : "null",
        showData: data2,
        id: id,
      });
    } else if (id == 3) {
      const postData = { t: "dmca" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("dmca", {
        title1: "DMCA",
        errorMessage: message.length > 0 ? (message = message[0]) : "null",
        showData: data2,
        id: id,
      });
    } else {
      return res.redirect("/v1/home");
    }
  } catch (error) {
    console.log(`footer ${id} get error`, error);
  }
});

router.get("/editFooter/:id", isAuth, async (req, res, next) => {
  const { id } = req.params;

  try {
    // console.log(id);

    let message = req.flash("error");
    // console.log(message);

    if (id == 1) {
      const postData = { t: "terms" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("edit_footer", {
        title1: "Editing",
        editing: true,
        errorMessage: message.length > 0 ? message[0] : "null",
        sid: data2[0].id,
        t: "terms",
        id: id,
        oldInput: {
          name: data2[0].name,
          description: data2[0].description,
        },
      });
    } else if (id == 2) {
      const postData = { t: "privacy" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("edit_footer", {
        title1: "Editing",
        editing: true,
        errorMessage: message.length > 0 ? message[0] : "null",
        sid: data2[0].id,
        t: "privacy",
        id: id,
        oldInput: {
          name: data2[0].name,
          description: data2[0].description,
        },
      });
    } else if (id == 3) {
      const postData = { t: "dmca" };
      const response = await axios.request(
        insertUrl("get/getFooter.php", "post", postData)
      );
      const data2 = response.data;

      return res.render("edit_footer", {
        title1: "Editing",
        editing: true,
        errorMessage: message.length > 0 ? message[0] : "null",
        sid: data2[0].id,
        t: "dmca",
        id: id,
        oldInput: {
          name: data2[0].name,
          description: data2[0].description,
        },
      });
    } else {
      return res.redirect("/v1/home");
    }
  } catch (error) {
    console.log("Edit Footer page ${id}", error);
  }
});

router.post(
  "/editFooter/:sid",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Name..."),
    body("description")
      .trim()
      .notEmpty()
      .withMessage("Description is required.")
      .matches(/^(<br\s*\/?>|\s|[^\<\>])*$|^[^\<\>]*$/)
      .withMessage("Invalid Description..."),
    body("id")
      .trim()
      .notEmpty()
      .withMessage("Id is required.")
      .isNumeric()
      .withMessage("Id must be a number."),
  ],
  async (req, res, next) => {
    const { sid } = req.params;

    try {
      // console.log(req.body);

      const { name, description, id } = req.body;

      // console.log(description);

      let t;
      switch (id) {
        case "1":
          t = "title";
          break;
        case "2":
          t = "privacy";
          break;
        case "3":
          t = "dmca";
          break;
        default:
          t = "terms"; // Default value if id is not 1, 2, or 3
          break;
      }

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("edit_footer", {
          title1: "Editing",
          editing: true,
          errorMessage: msg1,
          sid: sid,
          t: t,
          id: id,
          oldInput: {
            name: name,
            description: description,
          },
        });
      } else {
        let formattedText = description.replace(/<br\s*\/?>/gi, "\n\n");

        // let data = `{"t": "${t}", "name": "${name}", "description": "${description}" }`;

        // console.log(formattedText);

        let data = JSON.stringify({
          t: t, // Assuming t is a variable defined elsewhere
          name: name, // Assuming name is a variable defined elsewhere
          description: formattedText,
          id: sid,
        });

        // console.log(data);

        // return res.send("hii...");
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "update/footer_terms.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        axios
          .request(config)
          .then((response) => {
            // console.log(response.data);

            if (response.data.isSuccess == true) {
              return res.redirect(`/v1/footer/${id}`);
            } else {
              req.flash("error", "Failed try again...");
              return res.redirect(`/v1/footer/${id}`);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } catch (error) {
      console.log("Edit Footer post error ${sid}", error);
    }
  }
);

router.get("/fp", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(getData("get/popDown.php", "get"));
    const data = response.data;

    // console.log(data);

    return res.render("footer_pop", {
      title1: "Footer",
      errorMessage: message,
      oldInput: {
        title: data[0].title,
        link1: data[0].link1,
        link2: data[0].link2,
        id: data[0].id,
      },
    });
  } catch (error) {
    console.log("Edit footer popup page", error);
  }
});

router.post(
  "/fp",
  [body("link1").trim().notEmpty().withMessage("Link1 is required.")],
  async (req, res, next) => {
    try {
      const { title, link1, link2, id } = req.body;

      // console.log(req.body);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("footer_pop", {
          title1: "Footer",
          errorMessage: msg1,
          oldInput: {
            title: title,
            link1: link1,
            link2: link2,
            id: id,
          },
        });
      } else {
        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "update/popDown.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: JSON.stringify({
            title: title,
            link1: link1,
            link2: link2,
            id: id,
          }),
        };

        const response = await axios.request(config);
        const data = response.data;

        return res.redirect("/v1/home");
      }
    } catch (error) {
      console.log("Edit footer popup error", error);
    }
  }
);

router.get("/notifyAll", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(getData("get/notify.php", "get"));
    const data = response.data;

    return res.render("notify", {
      title1: "Notifications",
      editing: false,
      errorMessage: message,
      showData: data,
    });
  } catch (error) {
    console.log("Get Notifications error", error);
  }
});

router.get("/notify", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("notification", {
      title1: "Add Notification",
      editing: false,
      errorMessage: message,
      sid: "",
      oldInput: {
        title: "",
        bdes: "",
        link: "",
        id: "",
      },
    });
  } catch (error) {
    console.log("Get Add notification error", error);
  }
});

router.post(
  "/notify",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("bdes")
      .trim()
      .notEmpty()
      .withMessage("Body is required.")
      .matches(/^(<br\s*\/?>|\s|[^\<\>])*$|^[^\<\>]*$/)
      .withMessage("Invalid Body..."),
  ],
  async (req, res, next) => {
    try {
      const { title, bdes, link, id } = req.body;

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("notification", {
          title1: "Add Notification",
          editing: true,
          errorMessage: msg1,
          sid: "",
          oldInput: {
            title: title,
            bdes: bdes,
            link: link,
            id: id,
          },
        });
      } else {
        let data = JSON.stringify({
          title: title,
          bdes: bdes,
          link: link
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "insert/notify.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        let response = await axios.request(config);
        const data1 = response.data;

        // console.log(data1, data1?.isSuccess == true);

        if (data1?.isSuccess == true) {
          return res.redirect("/v1/notifyAll");
        } else {
          return res.redirect("/v1/notify");
        }
      }
    } catch (error) {
      console.log("Get notification error", error);
    }
  }
);

router.post("/sendN", isAuth, async (req, res, next) => {
  try {
    const { id } = req.body;

    const postData = { q2: `SELECT * from notifications where id=${id}` };

    const response = await axios.request(selectUrl("post", postData));
    const data = response.data;

    // console.log(data[0].link);
    const match = data[0].link != null ? data[0].link.match(/\/(\d+)\//) : false;
    
    if (match) {
      const id1 = match[1];
      
      const postData1 = { id: id1 };
      const response2 = await axios.request(
        insertUrl("get/postById.php", "post", postData1)
      );
      const data2 = response2.data.length >=1 ? response2.data : [];
      
      // console.log(id1, data2);

      const message = {
        notification: {
          title: data[0]?.title,
          body: data[0]?.body
        },
        data: {
            "postID": id1, // Include the extracted ID
            "click_action": "FLUTTER_NOTIFICATION_CLICK",
            "screen": "video",
            "postData": JSON.stringify(data2),
        },
        topic: "all", // Send to all users subscribed to this topic
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          // console.log("Successfully sent message:", response);
          return res.redirect("/v1/notifyAll");
        })
        .catch((error) => {
          // console.log("Error sending message:", error);
          req.flash("error", "Failed Try Again");
          return res.redirect("/v1/notifyAll");
        });
    }
    else {
      const message = {
        notification: {
          title: data[0]?.title,
          body: data[0]?.body
        },
        data: {
          "click_action": "FLUTTER_NOTIFICATION_CLICK",
          "screen": "home",
        },
        topic: "all", // Send to all users subscribed to this topic
      };

      admin
        .messaging()
        .send(message)
        .then((response) => {
          console.log("Successfully sent message:", response);
          return res.redirect("/v1/notifyAll");
        })
        .catch((error) => {
          console.log("Error sending message:", error);
          req.flash("error", "Failed Try Again");
          return res.redirect("/v1/notifyAll");
        });
    }
  } catch (error) {
    console.log("Get all notifications error", error);
  }
});

router.get("/viewN/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const postData = { q2: `SELECT * from notifications where id=${id}` };
    const response = await axios.request(selectUrl("post", postData));
    const data = response.data;

    // console.log(data);

    return res.render("notification", {
      title1: "Edit Notification",
      editing: true,
      errorMessage: message,
      sid: data[0]?.id,
      oldInput: {
        title: data[0]?.title.trim(),
        bdes: data[0]?.body.trim(),
        link: data[0]?.link.trim(),
        id: data[0]?.id,
      },
    });
  } catch (error) {
    console.log("edit notification error", error);
  }
});

router.post(
  "/viewN/:id",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("bdes")
      .trim()
      .notEmpty()
      .withMessage("Body is required.")
      .matches(/^(<br\s*\/?>|\s|[^\<\>])*$|^[^\<\>]*$/)
      .withMessage("Invalid Body..."),
  ],
  async (req, res, next) => {
    try {
      const { title, bdes, link, id } = req.body;

      // console.log(req.body);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("notification", {
          title1: "Edit Notification",
          editing: true,
          errorMessage: msg1,
          sid: id,
          oldInput: {
            title: title,
            bdes: bdes,
            link: link,
            id: id,
          },
        });
      } else {
        let data = JSON.stringify({
          id: id,
          title: title,
          bdes: bdes,
          link: link
        });

        let config = {
          method: "post",
          maxBodyLength: Infinity,
          url: baseUrl + "update/notify.php",
          headers: {
            "Content-Type": "application/json",
          },
          data: data,
        };

        const response = await axios.request(config);
        const data1 = response.data;

        if (data1?.isSuccess == true) {
          return res.redirect("/v1/notifyAll");
        } else {
          return res.redirect("/v1/notify");
        }
      }
    } catch (error) {
      console.log("edit notification error", error);
      return res.redirect("/v1/notifyAll");
    }
  }
);

router.get("/deleteN/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("delete/notify.php", "post", postData)
    );
    const data2 = response.data;

    // console.log(data2, id);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/notifyAll");
    } else {
      req.flash("error", "Failed to delete notification, Try again...");
      return res.redirect("/v1/notifyAll");
    }
  } catch (error) {
    console.log("delete post error", error);
  }
});

router.get("/raffle", isAuth, async (req, res, next) => {
  try {
    // console.log("raffle");

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/raffle.php", "get")
    );
    const data = response.data;

    const response2 = await axios.request(
      insertUrl("get/raffleBrands.php", "get")
    );
    const data2 = response2.data;
    
    // console.log(data);

    // console.log(data2);
    
    return res.render("raffle", {
      title1: "Raffles",
      errorMessage: message,
      showData: data.raffles == null ? [] : data.raffles.reverse(),
      type: '',
      b: '',
      brands: data2.length > 0 ? data2.map(i => i.brand) : []
    });
  }
  
  catch (error) {
    console.log("get raffle error ", error);
  }
})

router.get("/sneaker_release", isAuth, async (req, res, next) => {
  try {
    // console.log("sneakers");

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/sneaker_release.php", "get")
    );
    const data = response.data;

    const response2 = await axios.request(
      insertUrl("get/sneakerBrands.php", "get")
    );
    const data2 = response2.data;
    
    // console.log(data);
    
    return res.render("sneakers", {
      title1: "Sneaker Release",
      errorMessage: message,
      showData: data.length >= 1 ? data.reverse() : [],
      type: '',
      b: '',
      brands: data2.length > 0 ? data2.map(i => i.brand) : []
    });
  }
  
  catch (error) {
    console.log("get sneakers error ", error);
  }
})

router.get("/add_raffle", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("add_sneakers", {
      title1: "Add Raffle",
      editing: false,
      errorMessage: message,
      sid: "",
      sizes: [],
      oldInput: {
        title: "",
        des: "",
        image1: "",
        image2: "",
        image3: "",
        image4: "",
        image5: "",
        brand_img: "",
        retail_price: "",
        resell_price: "",
        brand: "",
        cat_id: "",
        date: ""
      },
    });
  } 
  
  catch (error) {
    console.log("add sneakers error", error);
  }
})

router.post("/raffle", 
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description..."),
    body("image1").trim().notEmpty().withMessage("Image1 is required").escape(),
    body("image2").trim().notEmpty().withMessage("Image2 is required").escape(),
    body("image3").trim().notEmpty().withMessage("Image3 is required").escape(),
    body("image4").trim().notEmpty().withMessage("Image4 is required").escape(),
    body("image5").trim().notEmpty().withMessage("Image5 is required").escape(),
    body("brand_img").trim().notEmpty().withMessage("Brand Logo is required").escape(),
    body("retail_price").trim().notEmpty().withMessage("Retail Price is required")
      .isNumeric().withMessage("Retail Price must be a valid number"),
    body("resell_price").trim().notEmpty().withMessage("Resell Price is required")
      .isNumeric().withMessage("Resell Price must be a valid number"),
    body("cat_id")
      .trim()
      .notEmpty().withMessage("Category is required")
      .isNumeric().withMessage("Category must be a valid number")
      .isIn([1, 2, 3, 4]).withMessage("Invalid category value"),
    body("brand").trim().notEmpty().withMessage("Brand Name is required"),
    body("date").trim().notEmpty().withMessage("Date is required"),
    body("sizes").trim().notEmpty().withMessage("Shoe Size is required")
  ],
  async (req, res, next) => {
    // console.log(req.body); 
    // '2024-11-29'
  
    try {
      const { title, des, image1, image2, image3, image4, image5, brand_img, retail_price, resell_price, cat_id, brand, date, sizes} = req.body;

      const cleanedSizes =
        typeof sizes == "object"
        ? sizes.filter((size) => size !== "").map((size) => parseFloat(size))
        : [parseFloat(sizes)];

      // console.log(req.body, cleanedSizes);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("add_sneakers", {
            title1: cat_id != 4 ? "Add Sneakers" : "Add Raffle",
            editing: false,
            errorMessage: msg1,
            sid: "",
            sizes: cleanedSizes,
            oldInput: {
              title: title,
              des: des.replace(/"/g, '\\"'),
              image1: image1,
              image2: image2,
              image3: image3,
              image4: image4,
              image5: image5,
              brand_img: brand_img,
              brand: brand,
              retail_price: retail_price,
              resell_price: resell_price,
              cat_id: cat_id,
              date: date
            },
          });
      }

      else {
        // return res.render("resell retail....");
          let data1 = JSON.stringify({
            title: title,
            des: des.replace(/\\/g, ''),
            image1: image1,
            image2: image2,
            image3: image3,
            image4: image4,
            image5: image5,
            logo: brand_img,
            brand: brand,
            retail_price: retail_price,
            resell_price: resell_price,
            cat_id: cat_id,
            date: date,
            sizes: cleanedSizes
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "insert/raffle.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: data1,
          };

          const response2 = await axios.request(config);
          const data2 = response2.data;

          // console.log(data2);

          if (data2.isSuccess && cat_id == 4) {
            return res.redirect("/v1/raffle");
          }
          else if (data2.isSuccess && cat_id != 4) {
            return res.redirect("/v1/sneaker_release");
          }
          else {
            req.flash("error", "Failed to add, try again...");
            return res.redirect("/v1/raffle");
          }
      }
    }
    
    catch (error) {
      console.log("post raffle error", error);
    }
  }
)

router.get("/raffleFilter", isAuth, async (req, res, next) => {
  try {
    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;
    const brand =
      req.query.b != undefined ? req.query.b.trim() : req.query.b;

    // Log the values to verify
    // console.log(type, name, type && name == undefined);
    // console.log(req.query.name, req.query.type);

    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(
      insertUrl("get/raffleBrands.php", "get")
    );
    const data = response.data;
    
    if (type && name == undefined && brand == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();
      const postData = { date: today };
      const response2 = await axios.request(
        insertUrl("get/raffleByDate.php", "post", postData)
      );
      const data2 = response2.data;
      
      return res.render("sneakers", {
        title1: "Raffles",
        errorMessage: message,
        showData: data2,
        type: today,
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
    
    else if (type == undefined && name && brand == undefined) {
      const postData = { s: name };
      const response3 = await axios.request(
        insertUrl("get/raffleSearch.php", "post", postData)
      );
      const data3 =
        response3.data != "" ? response3.data.reverse() : response3.data;

      // console.log(data3);

      return res.render("sneakers", {
        title1: "Raffles",
        errorMessage: message,
        showData: data3,
        type: '',
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }

    else if (type == undefined && name == undefined && brand) {
      const response4 = await axios.request(
        insertUrl("get/raffleSearchByBrand.php", "post", { b: brand })
      );
      const data4 = response4.data;

      // console.log(data4);
      
      return res.render("sneakers", {
        title1: "Raffles",
        errorMessage: message,
        showData: data4.reverse(),
        type: '',
        b: brand,
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
    
    else {
      const response4 = await axios.request(
        insertUrl("get/raffle.php", "get")
      );
      const data4 = response4.data;
      
      return res.render("sneakers", {
        title1: "Raffles",
        errorMessage: message,
        showData: data4.reverse(),
        type: '',
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
  }
  
  catch (error) {
    console.log("raffle filter error ", error);
  }
})

router.get("/sneakerFilter", isAuth, async (req, res, next) => {
  try {
    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;
    const brand =
      req.query.b != undefined ? req.query.b.trim() : req.query.b;

    // Log the values to verify
    // console.log(type, name, type && name == undefined);
    // console.log(req.query.name, req.query.type);

    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    const response = await axios.request(
      insertUrl("get/sneakerBrands.php", "get")
    );
    const data = response.data;
    
    if (type && name == undefined && brand == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();
      const postData = { date: today };
      const response2 = await axios.request(
        insertUrl("get/sneakerByDate.php", "post", postData)
      );
      const data2 = response2.data;
      
      return res.render("sneakers", {
        title1: "Sneakers",
        errorMessage: message,
        showData: data2,
        type: today,
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
    
    else if (type == undefined && name && brand == undefined) {
      const postData = { s: name };
      const response3 = await axios.request(
        insertUrl("get/sneakerSearch.php", "post", postData)
      );
      const data3 =
        response3.data != "" ? response3.data.reverse() : response3.data;

      // console.log(data3);

      return res.render("sneakers", {
        title1: "Sneakers",
        errorMessage: message,
        showData: data3,
        type: '',
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }

    else if (type == undefined && name == undefined && brand) {
      const response4 = await axios.request(
        insertUrl("get/sneakerSearchByBrand.php", "post", { b: brand })
      );
      const data4 = response4.data;
      
      return res.render("sneakers", {
        title1: "Sneakers",
        errorMessage: message,
        showData: data4.reverse(),
        type: '',
        b: brand,
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
    
    else {
      const response4 = await axios.request(
        insertUrl("get/raffle.php", "get")
      );
      const data4 = response4.data;
      
      return res.render("sneakers", {
        title1: "Sneakers",
        errorMessage: message,
        showData: data4.reverse(),
        type: '',
        b: '',
        brands: data.length > 0 ? data.map(i => i.brand) : []
      });
    }
  }
  
  catch (error) {
    console.log("sneakers filter error ", error);
  }
})

router.get("/viewRaffle/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    // const postData = { id: id };
    const response2 = await axios.request(
      insertUrl("get/raffleById.php", "post", { id: id })
    );
    const data2 = response2.data;

    const response3 = await axios.request(
      insertUrl("get/raffleShoeSizes.php", "post", { raffle_id: id })
    );
    const data3 = response3.data;
    
    // console.log(data2, data3);
        
    return res.render("add_sneakers", {
      title1: data2[0].cat_id == 4 ? "Edit Raffle" : "Edit Sneakers",
      editing: true,
      errorMessage: message,
      sid: id,
      sizes: data3.length >= 1 ? data3.map(item => parseFloat(item.size)) : [],
      oldInput: {
        title: data2[0].title,
        des: data2[0].description.replace(/"/g, '\\"'),
        image1: data2[0].image1,
        image2: data2[0].image2,
        image3: data2[0].image3,
        image4: data2[0].image4,
        image5: data2[0].image5,
        price: data2[0].price,
        brand_img: data2[0].logo,
        brand: data2[0].brand,
        retail_price: data2[0].retail_price,
        resell_price: data2[0].resell_price,
        cat_id: data2[0].cat_id,
        date: data2[0].date,
      },
    });
  }
  
  catch (error) {
    console.log("edit raffle error ", error);
  }
})

router.post("/viewRaffle/:id",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Title..."),
    body("des")
      .trim()
      .notEmpty()
      .withMessage("Description is required")
      .matches(/^[^<>]*$/)
      .withMessage("Invalid Description..."),
    body("image1").trim().notEmpty().withMessage("Image1 is required").escape(),
    body("image2").trim().notEmpty().withMessage("Image2 is required").escape(),
    body("image3").trim().notEmpty().withMessage("Image3 is required").escape(),
    body("image4").trim().notEmpty().withMessage("Image4 is required").escape(),
    body("image5").trim().notEmpty().withMessage("Image5 is required").escape(),
    body("brand_img").trim().notEmpty().withMessage("Brand Logo is required").escape(),
    body("retail_price").trim().notEmpty().withMessage("Retail Price is required")
      .isNumeric().withMessage("Retail Price must be a valid number"),
    body("resell_price").trim().notEmpty().withMessage("Resell Price is required")
      .isNumeric().withMessage("Resell Price must be a valid number"),
    body("cat_id")
      .trim()
      .notEmpty().withMessage("Category is required")
      .isNumeric().withMessage("Category must be a valid number")
      .isIn([1, 2, 3, 4]).withMessage("Invalid category value"),
    body("brand").trim().notEmpty().withMessage("Brand Name is required"),
    body("date").trim().notEmpty().withMessage("Date is required"),
    body("sizes").trim().notEmpty().withMessage("Shoe Size is required")
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const { title, des, image1, image2, image3, image4, image5, brand_img, retail_price, resell_price, cat_id, brand, date, sizes} = req.body;

      const cleanedSizes =
        typeof sizes == "object"
        ? sizes.filter((size) => size !== "").map((size) => parseFloat(size))
        : [parseFloat(sizes)];

      // console.log(req.body, cleanedSizes);

      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("add_sneakers", {
          title1: cat_id == 4 ? "Edit Raffle" : "Edit Sneakers",
          editing: true,
          errorMessage: msg1,
          sid: id,
          sizes: cleanedSizes,
          oldInput: {
              title: title,
              des: des.replace(/"/g, '\\"'),
              image1: image1,
              image2: image2,
              image3: image3,
              image4: image4,
              image5: image5,
              brand_img: brand_img,
              retail_price: retail_price,
              resell_price: resell_price,
              cat_id: cat_id,
              brand: brand,
              date: date
            },
        });
      }
      
      else {
          let data1 = JSON.stringify({
            title: title,
            des: des.replace(/\\/g, ''),
            image1: image1,
            image2: image2,
            image3: image3,
            image4: image4,
            image5: image5,
            logo: brand_img,
            retail_price: retail_price,
            resell_price: resell_price,
            cat_id: cat_id,
            brand: brand,
            date: date,
            id: id,
            sizes: cleanedSizes
          });

          let config = {
            method: "post",
            maxBodyLength: Infinity,
            url: baseUrl + "update/raffle.php",
            headers: {
              "Content-Type": "application/json",
            },
            data: data1,
          };

          const response2 = await axios.request(config);
          const data2 = response2.data;

          // console.log(data2);
        
          if (data2.isSuccess && cat_id != 4) {
            return res.redirect("/v1/sneaker_release");
          }
          else if (data2.isSuccess && cat_id == 4) {
            return res.redirect("/v1/raffle");
          }
          else {
            req.flash("error", "Failed to update, try again...");
            return res.redirect("/v1/sneaker_release");
          }
      }
    }

    catch (error) {
      console.log("post edit raffle error ", error);
    }
  }
)

router.get("/deleteRaffle/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("delete/raffle.php", "post", postData)
    );
    const data2 = response.data;

    // console.log(data2, id);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/raffle");
    } else {
      req.flash("error", "Failed to delete raffle, Try again...");
      return res.redirect("/v1/raffle");
    }
  } catch (error) {
    console.log("delete raffle error", error);
  }
});

router.get("/deleteSneaker/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const postData = { id: id };
    const response = await axios.request(
      insertUrl("delete/raffle.php", "post", postData)
    );
    const data2 = response.data;

    // console.log(data2, id);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/sneaker_release");
    } else {
      req.flash("error", "Failed to delete raffle, Try again...");
      return res.redirect("/v1/sneaker_release");
    }
  } catch (error) {
    console.log("delete raffle error", error);
  }
});

router.get("/ads", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    // if (req.session._prodToken === req.user?.rem_token) {
    const response = await axios.request(
      insertUrl("get/ads.php", "get")
    );
    const data = response.data;
    
    // console.log(data);
    
    return res.render("ads", {
      title1: "Advertisement",
      errorMessage: message,
      showData: data.length >= 1 ? data.reverse() : [],
      type: ''
    });
  }
  
  catch(error) {
    console.log("get ads error ", error);
  }
})

router.get("/adsFilter", isAuth, async (req, res, next) => {
  try {
    const type =
      req.query.type != undefined ? req.query.type.trim() : req.query.type;
    const name =
      req.query.name != undefined ? req.query.name.trim() : req.query.name;

    // Log the values to verify
    // console.log(type, name, type && name == undefined);
    // console.log(req.query.name, req.query.type);

    let message = req.flash("error");

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    if (type && name == undefined) {
      let today = new Date(type);
      // console.log(today);
      today =
        today.getFullYear() +
        "-" +
        String(today.getMonth() + 1) +
        "-" +
        today.getDate();
      const postData = { date: today };
      const response2 = await axios.request(
        insertUrl("get/adsByDate.php", "post", postData)
      );
      const data2 = response2.data;
      
      return res.render("ads", {
        title1: "Advertisement",
        errorMessage: message,
        showData: data2,
        type: today
      });
      
      // return res.render("sneakers", {
      //   title1: "Raffles",
      //   errorMessage: message,
      //   showData: data2,
      //   type: today
      // });
    }
    
    else if (type == undefined && name) {
      const postData = { s: name };
      const response3 = await axios.request(
        insertUrl("get/adsSearch.php", "post", postData)
      );
      const data3 =
        response3.data != "" ? response3.data.reverse() : response3.data;

      // console.log(data3);
      
      return res.render("ads", {
        title1: "Advertisement",
        errorMessage: message,
        showData: data3,
        type: ''
      });

      // return res.render("sneakers", {
      //   title1: "Raffles",
      //   errorMessage: message,
      //   showData: data3,
      //   type: ''
      // });
    }
    
    else {
      const response = await axios.request(
        insertUrl("get/ads.php", "get")
      );
      const data = response.data;
      
      return res.render("ads", {
        title1: "Advertisement",
        errorMessage: message,
        showData: data.reverse(),
        type: ''
      });
    }
  }
  
  catch (error) {
    console.log("raffle filter error ", error);
  }
})

router.get("/addAds", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("add_ads", {
      title1: "Add Advertisement",
      editing: false,
      errorMessage: message,
      sid: "",
      oldInput: {
        title: "",
        image: "",
        link_android: "",
        link_ios: "",
        date: ""
      },
    });
  } catch (error) {
    console.log("Ads Error", error);
  }
});

router.post(
  "/addAds",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Title Question..."),
    body("image").trim().notEmpty().withMessage("Image is required").escape(),
    body("link_android")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Android Link is required"),
    body("link_ios")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("IOS Link is required"),
    body("date").trim().notEmpty().withMessage("Date is required"),
  ],
  async (req, res, next) => {
    try {
      const { title, image, link_android, link_ios, date } = req.body;
      const des = req.body.des.trim();
      
      // console.log(req.body);

      // console.log(des, !des, !link_android, !link_ios);
      // console.log(!des || !link_android || !link_ios);
      
      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("add_ads", {
            title1: "Add Advertisement",
            editing: false,
            errorMessage: msg1,
            sid: "",
            oldInput: {
              title: title,
              image: image,
              link_android: link_android,
              link_ios: link_ios,
              date: date,
              des: des.replace(/"/g, '\\"'),
            },
          });
      }
      
      else {
        if (!des || !link_android || !link_ios) {
          return res.render("add_ads", {
            title1: "Add Advertisement",
            editing: false,
            errorMessage: "Insert either code or android or ios link...",
            sid: "",
            oldInput: {
              title: title,
              image: image,
              link_android: link_android,
              link_ios: link_ios,
              date: date,
              des: des.replace(/"/g, '\\"'),
            },
          });
        }

        else {
          const response = await axios.request(
            insertUrl("insert/ads.php", "post", { 'title': title, 'img': image, 'android_link': link_android, 'ios_link': link_ios, 'des': des, 'date': date })
          );

          // const response = await axios.request(config);
          const data1 = response.data;
          
          // console.log(data1);
          
          if (data1.isSuccess) {
            return res.redirect("/v1/ads");
          }
          else {
            req.flash("error", "Failed to add, try again...");
            return res.redirect("/v1/addAds");
          }
        }
      }
    }
    
    catch (error) {
      console.log("post ads error ", error);
      
      return res.redirect("/v1/addAds")
    }
  }
)

router.get("/viewAds/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    const response = await axios.request(
      insertUrl("get/adsById.php", "post", { id: id })
    );
    const data = response.data;
    
    // console.log(data2);
    
    return res.render("add_ads", {
      title1: "Edit Advertisement",
      editing: true,
      errorMessage: message,
      sid: id,
      oldInput: {
        title: data[0].title,
        image: data[0].image,
        link_android: data[0].link_android,
        link_ios: data[0].link_ios,
        date: data[0].date,
        des: data[0].code
      },
    });
  }
  
  catch (error) {
    console.log("edit ads error ", error);
  }
})

router.post("/viewAds/:id",
  [
    body("title")
      .trim()
      .notEmpty()
      .withMessage("Title is required.")
      .matches(/^[^<>]*$/)
      .withMessage("Title Question..."),
    body("image").trim().notEmpty().withMessage("Image is required").escape(),
    body("link_android")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("Android Link is required"),
    body("link_ios")
      .optional({ checkFalsy: true })
      .isURL()
      .withMessage("IOS Link is required"),
    body("date").trim().notEmpty().withMessage("Date is required"),
  ],
  async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const { title, image, link_android, link_ios, date } = req.body;

      const des = req.body.des.trim();
            
      // console.log(req.body, id);

      // console.log(!des, !link_android, !link_ios);
      // console.log(!des || !link_android || !link_ios);

      const error = validationResult(req);
      
      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        return res.render("add_ads", {
            title1: "Add Advertisement",
            editing: true,
            errorMessage: msg1,
            sid: id,
            oldInput: {
              title: title,
              image: image,
              link_android: link_android,
              link_ios: link_ios,
              des: des.replace(/"/g, '\\"'),
              date: date,
            },
          });
      }
      
      else {
        if (!des || !link_android || !link_ios) {
          return res.render("add_ads", {
            title1: "Add Advertisement",
            editing: true,
            errorMessage: "Insert either code or android or ios link...",
            sid: id,
            oldInput: {
              title: title,
              image: image,
              link_android: link_android,
              link_ios: link_ios,
              des: des.replace(/"/g, '\\"'),
              date: date,
            },
          });
        }

        else {       
          const response = await axios.request(
            insertUrl("update/ads.php", "post", { 'adId': id, 'title': title, 'img': image, 'android_link': link_android, 'ios_link': link_ios, 'des': des, 'date': date })
          );

          const data1 = response.data;

          // console.log(data2);
          return res.redirect("/v1/ads");
        }
      }
    }

    catch (error) {
      console.log("post edit ads error ", error);
    }
  }
)

router.get("/deleteAds/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    const response = await axios.request(
      insertUrl("delete/ads.php", "post", { id: id })
    );
    const data2 = response.data;

    // console.log(data2, id);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/ads");
    } else {
      req.flash("error", "Failed to delete ads, Try again...");
      return res.redirect("/v1/addAds");
    }
  } catch (error) {
    console.log("delete ads error", error);
  }
});

router.get("/showDesktopAds", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;
    let offset = 0;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    if (page == 1) {
      offset = 0;
    }
    else {
      offset += itemsPerPage * (page - 1);
    }
    
    const response = await axios.request(
      insertUrl("get/getDesktopAds.php", "post", { 'limit': itemsPerPage, 'offset': offset })
    );
    const data = response.data;
    
    // console.log(data.results);
    
    return res.render("showAllAds", {
      title1: "Desktop Advertisement",
      errorMessage: message,
      showData: data.results,
      screen: 'desktop',
      type: '',
      page: page,
      totalCount: Math.ceil(data.totalCount / itemsPerPage)
    });
  }
  
  catch(error) {
    console.log("show desktop ads page error: ", error);
  }
})

router.get("/showMobileAds", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;
    
    const page = parseInt(req.query.page) || 1;
    const itemsPerPage = 5;
    let offset = 0;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    if (page == 1) {
      offset = 0;
    }
    else {
      offset += itemsPerPage * (page - 1);
    }
    
    const response = await axios.request(
      insertUrl("get/mobile_ads.php", "post", { 'limit': itemsPerPage, 'offset': offset })
    );
    const data = response.data;
    
    // console.log(data);
    
    return res.render("showAllAds", {
      title1: "Mobile Advertisement",
      errorMessage: message,
      showData: data.results,
      screen: 'mobile',
      type: '',
      page: page,
      totalCount: Math.ceil(data.totalCount / itemsPerPage)
    });
  }
  
  catch(error) {
    console.log("show mobile ads page error: ", error);
  }
})

router.get("/desktopAds", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    const response = await fetchPageData();
    
    // console.log(response);
    
    if (response.error) {
      return res.redirect("/v1/showAds");
    }
    
    else {
      return res.render("page_ads", {
        title1: "Add Desktop Ads",
        editing: false,
        errorMessage: message,
        sid: "",
        screen: 'desktop',
        page: response?.data,
        ads: response?.data2,
        oldInput: {
          page_id: "",
          ads_id: ""
        },
      });
    }
  } catch (error) {
    console.log("Page Ads Error", error);
  }
})

router.get("/mobileAds", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    const response = await fetchPageData();
    
    // console.log(response);
    
    if (response.error) {
      return res.redirect("/v1/showAds");
    }
    
    else {
      return res.render("page_ads", {
        title1: "Add Mobile Ads",
        editing: false,
        errorMessage: message,
        sid: "",
        screen: 'mobile',
        page: response?.data,
        ads: response?.data2,
        oldInput: {
          page_id: "",
          ads_id: ""
        },
      });
    }
  } catch (error) {
    console.log("Page Ads Error", error);
  }
})

router.post("/desktopAds", 
  [
    body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
  ],
  async (req, res, next) => {
    try {
      const {page_id, ads_id} = req.body;
      
      const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];
      
      // console.log(req.body);
      
      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await fetchPageData();

        return res.render("page_ads", {
          title1: "Add Desktop Ads",
          editing: false,
          errorMessage: msg1,
          sid: "",
          screen: 'desktop',
          page: response?.data,
          ads: response?.data2,
          oldInput: {
            page_id: page_id,
            ads_id: cleanedAds
          },
        });
      }
      
      else {        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: baseUrl + 'insert/page_ads.php',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : JSON.stringify({
            "page_id": page_id,
            "ads_id": cleanedAds
          })
        };

        const response = await axios.request(config);
        
        // console.log(response.data);
        
        if (response.data.hasOwnProperty('error')) {
          req.flash("error", response.data.error);
          return res.redirect("/v1/desktopAds");
        }
        
        else return res.redirect("/v1/showDesktopAds")
      }
    }
  
    catch (error) {
      console.log("post desktop ads error: ", error);
      
      return res.redirect("/v1/desktopAds");
    }
  }
)

router.post("/mobileAds", 
  [
    body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
  ],
  async (req, res, next) => {
    try {
      const {page_id, ads_id} = req.body;
      
      const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];
      
      // console.log(req.body);
      
      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await fetchPageData();

        return res.render("page_ads", {
          title1: "Add Mobile Ads",
          editing: false,
          errorMessage: msg1,
          sid: "",
          screen: 'mobile',
          page: response?.data,
          ads: response?.data2,
          oldInput: {
            page_id: page_id,
            ads_id: cleanedAds
          },
        });
      }
      
      else {        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: baseUrl + 'insert/mobile_ads.php',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : JSON.stringify({
            "page_id": page_id,
            "ads_id": cleanedAds
          })
        };

        const response = await axios.request(config);
        
        // console.log(response.data);
        
        if (response.data.hasOwnProperty('error')) {
          req.flash("error", response.data.error);
          return res.redirect("/v1/mobileAds");
        }
        
        else return res.redirect("/v1/showMobileAds")
      }
    }
  
    catch (error) {
      console.log("post mobile ads error: ", error);
      
      return res.redirect("/v1/mobileAds");
    }
  }
)

router.get("/viewDesktopAds/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    const response = await axios.request(
      insertUrl("get/getPageAds.php", "post", { 'page_id': id })
    );
    const data = response.data;
    
    // console.log(data);
    
    const response2 = await fetchPageData();
    
    return res.render("page_ads", {
        title1: "Edit Desktop Ads",
        editing: true,
        errorMessage: message,
        sid: id,
        screen: 'desktop',
        page: response2?.data,
        ads: response2?.data2,
        oldInput: {
          page_id: data[0]?.page_id,
          ads_id: data[0]?.ads_id
        },
    });
  }
  
  catch(error) {
    console.log("edit desktop ads error: ", error);
    
    return res.redirect("/v1/desktopAds");
  }
})

router.post("/viewDesktopAds/:id",
  [
    body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
  ],
  async (req, res, next) => {
    try {
      const {page_id, ads_id} = req.body;
      
      const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];
      
      // console.log(req.body);
      
      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await fetchPageData();

        return res.render("page_ads", {
          title1: "Edit Desktop Ads",
          editing: true,
          errorMessage: msg1,
          sid: req.params.id,
          screen: 'desktop',
          page: response?.data,
          ads: response?.data2,
          oldInput: {
            page_id: page_id,
            ads_id: cleanedAds
          },
        });
      }
      
      else {        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: baseUrl + 'update/page_ads.php',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : JSON.stringify({
            "page_id": page_id,
            "ads_id": cleanedAds
          })
        };

        const response = await axios.request(config);
        
        // console.log(response.data);
        
        if (response.data.hasOwnProperty('error')) {
          req.flash("error", response.data.error);
          return res.redirect(`/v1/viewDesktopAds/${page_id}`);
        }
        
        else return res.redirect("/v1/showDesktopAds")
      }
    }

    catch (error) {
      console.log("post desktop ads error: ", error);
      
      return res.redirect("/v1/showDesktopAds");
    }
  }
)

router.get("/viewMobileAds/:id", isAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }
    
    const response = await axios.request(
      insertUrl("get/getMobileAds.php", "post", { 'page_id': id })
    );
    const data = response.data;
    
    // console.log(data);
    
    const response2 = await fetchPageData();
    
    return res.render("page_ads", {
        title1: "Edit Mobile Ads",
        editing: true,
        errorMessage: message,
        sid: id,
        screen: 'mobile',
        page: response2?.data,
        ads: response2?.data2,
        oldInput: {
          page_id: data[0]?.page_id,
          ads_id: data[0]?.ads_id
        },
    });
  }
  
  catch(error) {
    console.log("edit page ads error: ", error);
    
    return res.redirect("/v1/showAds");
  }
})

router.post("/viewMobileAds/:id",
  [
    body("page_id").trim().notEmpty().withMessage("Page is required")
      .isNumeric().withMessage("Please select a valid Page"),
    body("ads_id").trim().notEmpty().withMessage("Ads is required")
      .isNumeric().withMessage("Please select a valid Ads")
  ],
  async (req, res, next) => {
    try {
      const {page_id, ads_id} = req.body;
      
      const cleanedAds =
        typeof ads_id == "object" ? ads_id.filter((ads) => ads !== "") : [ads_id];
      
      // console.log(req.body);
      
      const error = validationResult(req);

      if (!error.isEmpty()) {
        // console.log(error.array());
        let msg1 = error.array()[0].msg;

        const response = await fetchPageData();

        return res.render("page_ads", {
          title1: "Edit Mobile Ads",
          editing: true,
          errorMessage: msg1,
          sid: req.params.id,
          screen: 'mobile',
          page: response?.data,
          ads: response?.data2,
          oldInput: {
            page_id: page_id,
            ads_id: cleanedAds
          },
        });
      }
      
      else {        
        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: baseUrl + 'update/mobile_ads.php',
          headers: { 
            'Content-Type': 'application/json'
          },
          data : JSON.stringify({
            "page_id": page_id,
            "ads_id": cleanedAds
          })
        };

        const response = await axios.request(config);
        
        // console.log(response.data);
        
        if (response.data.hasOwnProperty('error')) {
          req.flash("error", response.data.error);
          return res.redirect(`/v1/viewMobileAds/${page_id}`);
        }
        
        else return res.redirect("/v1/showMobileAds")
      }
    }

    catch (error) {
      console.log("post mobile ads error: ", error);
      
      return res.redirect("/v1/showMobileAds");
    }
  }
)

router.get("/deleteDesktopAds", isAuth, async (req, res, next) => {
  try {
    const { pid, aid } = req.query;

    const response = await axios.request(
      insertUrl("delete/page_ads.php", "post", { pid: pid, aid: aid })
    );
    const data2 = response.data;

    // console.log(data2, pid, aid);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/showDesktopAds");
    } else {
      req.flash("error", "Failed to delete desktop ads, Try again...");
      return res.redirect("/v1/showDesktopAds");
    }
  } catch (error) {
    console.log("delete desktop ads error", error);
    return res.redirect("/v1/showDesktopAds");
  }
})

router.get("/deleteMobileAds", isAuth, async (req, res, next) => {
  try {
    const { pid, aid } = req.query;

    const response = await axios.request(
      insertUrl("delete/mobile_ads.php", "post", { pid: pid, aid: aid })
    );
    const data2 = response.data;

    // console.log(data2, pid, aid);

    if (data2.isSuccess == true) {
      return res.redirect("/v1/showMobileAds");
    } else {
      req.flash("error", "Failed to delete mobile ads, Try again...");
      return res.redirect("/v1/showMobileAds");
    }
  } catch (error) {
    console.log("delete mobile ads error", error);
    return res.redirect("/v1/showMobileAds");
  }
})

// music

router.get("/add_single", isAuth, async (req, res, next) => {
  try {
    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("add_single", {
      title1: "Add Music",
      editing: false,
      errorMessage: message,
      category: [],
      sid: "",
      oldInput: {
        title: "",
        des: "",
        cover: "",
        fileCode: "",
        tags: [],
      },
    });
  }

  catch(error) {
    console.log("add albums error: ", error);
  }
})

router.post("/addSingle", async (req, res, next) => {
  try {
    console.log(req.body);

    return res.send("singles...");
  }

  catch(error) {
    console.log("post single error: ", error);
  }
})

router.get("/viewSingle/:sid", isAuth, async (req, res, next) => {
  try {
    const { sid } = req.params;

    console.log(sid);

    let message = req.flash("error");
    // console.log(message);

    if (message.length > 0) {
      message = message[0];
    } else {
      message = null;
    }

    return res.render("add_single", {
      title1: "Edit Music",
      editing: true,
      errorMessage: message,
      category: [],
      sid: sid,
      oldInput: {
        title: "",
        des: "",
        cover: "",
        fileCode: "",
        tags: [],
      },
    });
  }

  catch(error) {
    console.log("view single error: ", error);
    return res.redirect("/v1/singles");
  }
})

router.post("/viewSingle/:sid", async (req, res, next) => {
  try {
    const { sid } = req.params;

    console.log(sid);
  }

  catch(error) {
    console.log("view single error: ", error);
    return res.redirect("/v1/singles");
  }
})

module.exports = router;

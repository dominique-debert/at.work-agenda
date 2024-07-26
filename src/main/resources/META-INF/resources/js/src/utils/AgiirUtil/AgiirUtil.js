import React from "react";
import LFS from "../FetchService/LiferayFetchService";
import { GROUP_ID, COMPANY_ID } from "../../constants/constants";

class AgiirUtil extends React.Component {
  static myInstance = null;

  static getInstance() {
    //Instance needed for non-static methods !!!
    if (AgiirUtil.myInstance == null) {
      AgiirUtil.myInstance = new AgiirUtil();
    }

    return this.myInstance;
  }

  static currRangeMin = 0;
  static currRangeMax = 0;
  static ESEARCH_URL = "";
  static ESEARCH_PORT = "";
  static ESEARCH_FULL_URL = "";
  static queryObject = {};

  constructor(props) {
    super(props);

    this.currRangeMin = 0;
    this.currRangeMax = 0;
    this.CONTEXT = "agiir.service.builder.agenda.model.AgendaEvents";
    this.ESEARCH_URL = "http://localhost";
    this.ESEARCH_PORT = "9200";
    this.ESEARCH_FULL_URL = "127.0.0.1";
    this.queryObject = {
      search: null,
      entity: null,
      range: null
    };
    this.startOffset = 0;
    this.sizeOffset = 10000;
    this.searchAttemptCount = 0;
    this.sorting = {};
  }

  async search(filters, sorting) {
    let results = [];
    let query = this.prepareFilterQuery(filters).join("");
    let groupQuery =
      " groupId:" + GROUP_ID + " AND _index: liferay-" + COMPANY_ID;
    if (query != "") {
      groupQuery = " AND" + groupQuery;
    }
    query = query + groupQuery;
    this.queryObject.entity = query != null ? query : "";
    this.sorting = sorting;
    //console.log("search sorting : ", sorting);
    let fullQuery = this.buildFullQuery(this.CONTEXT);
    results = await this.executeSearchQuery(fullQuery);
    return results;
  }

  /*prepareSearchQuery(searchParams) {
    //console.log(searchParams);
    let other = 0;
    //console.log("handleSearch --> Header");
    let searchQuery = searchParams.map(param => {
      let query = "";
      let key = param.name + ":";
      param.list.map(value => {
        let queryitem = key + value;
        if (query == "") {
          query = queryitem;
        } else {
          query = query + " OR " + queryitem;
        }
      });
      query = query == "" ? query : "(" + query + ") ";
      query = param.list.length > 0 && other > 0 ? " AND " + query : query;
      other += param.list.length > 0 ? 1 : 0;
      return query;
    });
    return searchQuery;
  }*/

  /*prepareAdvancedFilterQuery(advancedFilters) {
    let query = "";
    let keys = Object.keys(advancedFilters);
    keys.map(key => {
      let queryitem =
        key +
        ":(>=" +
        advancedFilters[key].min +
        " AND <= " +
        advancedFilters[key].max +
        ")";
      if (query == "") {
        query = queryitem;
      } else {
        query = query + " AND " + queryitem;
      }
    });
    //console.log(query);
    return query;
  }*/

  prepareFilterQuery(filters) {
    let other = 0;
    let filterQuery = filters.map(filter => {
      let query = "";
      if (filter.name == "Catégorie") {
        let key = "categoriesIDS:";
        filter.list.map(selectedItem => {
          let queryitem = key + "(" + selectedItem.id + ")";
          if (query == "") {
            query = queryitem;
          } else {
            query = query + " OR " + queryitem;
          }
        });
      } else if (filter.name == "Date") {
        let key1 = "start_date_sortable:<=";
        let key2 = "end_date_sortable:>=";
        filter.list.map(selectedItem => {
          let realDate = new Date(selectedItem);
          realDate.setHours(0, 0, 0, 0);
          let end = realDate.getTime();
          realDate.setDate(realDate.getDate() + 1);
          let start = realDate.getTime();
          let queryitem = key1 + start + " AND " + key2 + end;
          if (query == "") {
            query = queryitem;
          } else {
            query = query + " OR " + queryitem;
          }
        });
      } else if (filter.name == "Région") {
        //console.log("Regions : ", filter);
        let key = "price_sortable:";
        filter.list.map(selectedItem => {
          let queryitem = key + "(" + selectedItem.id + ")";
          if (query == "") {
            query = queryitem;
          } else {
            query = query + " OR " + queryitem;
          }
        });
      }
      query = query == "" ? query : "(" + query + ") ";
      query = filter.list.length > 0 && other > 0 ? " AND " + query : query;
      other += filter.list.length > 0 ? 1 : 0;
      return query;
    });
    return filterQuery;
  }

  buildRange() {
    if (this.currRangeMin == "") {
      this.currRangeMin = 0;
    }

    if (this.currRangeMax == "") {
      this.currRangeMax = 100000;
    }

    return "[" + this.currRangeMin + " TO " + this.currRangeMax + "]";
  }

  buildFullQuery = () => {
    let doOffset = '"from":0, "size":' + this.sizeOffset + ",";
    let fullQuery =
      "{" +
      doOffset +
      '"query": {"query_string": {"query": "entryClassName:' +
      this.CONTEXT;

    if (this.queryObject.entity != "") {
      fullQuery = fullQuery + " AND (" + this.queryObject.entity + ') " }}';
    } else {
      fullQuery = fullQuery + ' " }}';
    }

    // Tri sur la date de publication
    if (this.sorting != null) {
      fullQuery +=
        ',"sort" : [{"' +
        this.sorting.attribut +
        '" : {"order" : "' +
        this.sorting.order +
        '"}}]}';
    } else {
      fullQuery +=
        ',"sort" : [{"publish_date_sortable" : {"order" : "desc"}}]}';
    }

    //console.log("full query", fullQuery);
    return fullQuery;
  };

  async executeSearchQuery(fullQuery) {
    let hits = [];
    while (this.searchAttemptCount <= 3) {
      let json = await LFS.apiCall("searchQuery", "permission", {
        url: this.ESEARCH_FULL_URL,
        query: fullQuery
      });
      if (json.hits && json.hits.hits) {
        hits = json.hits.hits;
        if (!hits) {
          this.searchAttemptCount++;
        } else {
          break;
        }
      } else {
        break;
      }
    }
    return hits;
  }

  static formatDateIntl(dateInput) {
    return new Intl.DateTimeFormat("fr", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }).format(new Date(new Date(dateInput)));
  }

  //Check for non valid character in a sting. Usually non valid characters for a database / Regex
  static includesIncorrectChar(str) {
    let invalidChar = [
      "?",
      "'",
      '"',
      "/",
      "\\",
      ":",
      "*",
      "[",
      "]",
      "^",
      "&",
      ".",
      ",",
      "(",
      ")"
    ];
    for (var i = 0; i != invalidChar.length; i++) {
      var substring = invalidChar[i];
      if (typeof str == "string") {
        if (str.indexOf(substring) != -1) {
          return true;
        }
      } else {
        return false;
      }
    }
    return false;
  }

  incrementSearchOffset() {
    this.startOffset = this.startOffset + this.sizeOffset;
  }

  resetOffset() {
    this.startOffset = 0;
  }

  static parseDateMonth(ts) {
    var options = { year: "numeric", month: "short", day: "numeric" };
    let date = new Date(ts);
    let d = new Date(date);
    return d.toLocaleDateString("fr-FR", options).toUpperCase();
  }

  static pad(s) {
    return s < 10 ? "0" + s : s;
  }

  static convertDate(inputFormat) {
    let date = inputFormat.replace("CET", "GMT");
    var d = new Date(date);
    return [
      AgiirUtil.pad(d.getDate()),
      AgiirUtil.pad(d.getMonth() + 1),
      d.getFullYear()
    ].join("/");
  }

  static normalizeString(string) {
    return string
      .split("")
      .map(
        function(letter) {
          let i = this.accents.indexOf(letter);
          return i !== -1 ? this.out[i] : letter;
        }.bind({
          accents:
            "ÀÁÂÃÄÅĄàáâãäåąßÒÓÔÕÕÖØÓòóôõöøóÈÉÊËĘèéêëęðÇĆçćÐÌÍÎÏìíîïÙÚÛÜùúûüÑŃñńŠŚšśŸÿýŽŻŹžżź",
          out:
            "AAAAAAAaaaaaaaBOOOOOOOOoooooooEEEEEeeeeeeCCccDIIIIiiiiUUUUuuuuNNnnSSssYyyZZZzzz"
        })
      )
      .join("");
  }
}

export default AgiirUtil;

export const createDatabaseReqBody = (page_id) => {
  return {
    parent: {
      type: "page_id",
      page_id: `${page_id}`,
    },
    title: [
      {
        type: "text",
        text: {
          content: "Sights to visit",
          link: null,
        },
      },
    ],
    properties: {
      Name: {
        title: {},
      },
      Description: {
        rich_text: {},
      },
      Visited: {
        checkbox: {},
      },
      Type: {
        select: {
          options: [
            {
              name: "Museum",
              color: "green",
            },
            {
              name: "Park",
              color: "red",
            },
            {
              name: "Castle",
              color: "yellow",
            },
            {
              name: "Church",
              color: "purple",
            },
            {
              name: "Restaurant",
              color: "blue",
            },
          ],
        },
      },
      "Public transport cost": {
        number: {
          format: "dollar",
        },
      },
      "Distance from city center (km)": {
        number: {},
      },
      "When to visit": {
        date: {},
      },
      "Activities to do": {
        type: "multi_select",
        multi_select: {
          options: [
            {
              name: "Walk",
              color: "blue",
            },
            {
              name: "Photo shooting",
              color: "gray",
            },
            {
              name: "Pray",
              color: "purple",
            },
            {
              name: "Eat",
              color: "yellow",
            },
          ],
        },
      },
      "+1": {
        people: {},
      },
      Photo: {
        files: {},
      },
    },
  };
};

export const updateDatabaseReqBody = () => {
  return {
    title: [
      {
        text: {
          content: "Sights to visit in Lisbon",
        },
      },
    ],
    properties: {
      "Extra notes": { rich_text: {} },
    },
  };
};

export const updateDatabasePropsReqBody = () => {
  return {
    properties: {
      "Extra notes": {
        name: "Some Extra Notes",
      },
    },
  };
};

export const createPageReqBody = (database_id, user_id) => {
  return {
    parent: {
      database_id: `${database_id}`,
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: "Saint George's Castle",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Historic castle in the Portuguese capital of Lisbon",
            },
          },
        ],
      },
      Visited: {
        checkbox: false,
      },
      Type: {
        select: {
          name: "Castle",
        },
      },
      "Public transport cost": {
        number: 2,
      },
      "Distance from city center (km)": {
        number: 0.5,
      },
      "When to visit": {
        date: {
          start: "2024-11-17",
        },
      },
      "Activities to do": {
        multi_select: [
          {
            name: "Walk",
          },
          {
            name: "Photo shooting",
          },
        ],
      },
      "+1": {
        people: [
          {
            object: "user",
            id: `${user_id}`,
          },
        ],
      },
      Photo: {
        files: [],
      },
    },
  };
};

export const createPageWithContentReqBody = (database_id, user_id) => {
  return {
    parent: {
      database_id: `${database_id}`,
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: "Lisbon Cathedral",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Roman Catholic cathedral located in Lisbon, Portugal",
            },
          },
        ],
      },
      Visited: {
        checkbox: false,
      },
      Type: {
        select: {
          name: "Church",
        },
      },
      "Public transport cost": {
        number: 1.5,
      },
      "Distance from city center (km)": {
        number: 0.4,
      },
      "When to visit": {
        date: {
          start: "2024-11-16",
        },
      },
      "Activities to do": {
        multi_select: [
          {
            name: "Pray",
          },
        ],
      },
      "+1": {
        people: [
          {
            object: "user",
            id: `${user_id}`,
          },
        ],
      },
      Photo: {
        files: [],
      },
    },
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [
            {
              type: "text",
              text: {
                content: "Lisbon Cathedral description",
              },
            },
          ],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "The Cathedral of Saint Mary Major (Portuguese: Santa Maria Maior de Lisboa or Metropolitan Cathedral of St. Mary Major), often called Lisbon Cathedral or simply the Sé (Sé de Lisboa), is a Roman Catholic cathedral located in Lisbon, Portugal. The oldest church in the city, initially built as a mosque, it is the seat of the Patriarchate of Lisbon. Built in 1147, the cathedral has survived many earthquakes and has been modified, renovated and restored several times. It is currently a mix of different architectural styles. It has been classified as a National Monument since 1910.",
                link: {
                  url: "https://en.wikipedia.org/wiki/Lisbon_Cathedral",
                },
              },
            },
          ],
        },
      },
    ],
  };
};

export const createPage2ReqBody = (database_id, user_id) => {
  return {
    parent: {
      database_id: `${database_id}`,
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: "Edward VII Park",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Public park in Lisbon",
            },
          },
        ],
      },
      Visited: {
        checkbox: false,
      },
      Type: {
        select: {
          name: "Park",
        },
      },
      "Public transport cost": {
        number: 3,
      },
      "Distance from city center (km)": {
        number: 1,
      },
      "When to visit": {
        date: {
          start: "2024-11-18",
        },
      },
      "Activities to do": {
        multi_select: [
          {
            name: "Walk",
          },
          {
            name: "Photo shooting",
          },
        ],
      },
      "+1": {
        people: [
          {
            object: "user",
            id: `${user_id}`,
          },
        ],
      },
      Photo: {
        files: [],
      },
    },
  };
};

export const appendBlockChildren = () => {
  return {
    children: [
      {
        object: "block",
        type: "heading_2",
        heading_2: {
          rich_text: [{ type: "text", text: { content: "Edward VII Park" } }],
        },
      },
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: {
                content:
                  "Edward VII Park (Portuguese: Parque Eduardo VII) is a public park in Lisbon, Portugal.[1] The park occupies an area of 26 hectares (64 acres) to the north of Avenida da Liberdade and Marquis of Pombal Square in Lisbon's city center. The park is named for King Edward VII of the United Kingdom, who visited Portugal in 1903 to strengthen relations between the two countries and reaffirm the Anglo-Portuguese Alliance. The Lisbon Book Fair is held annually in Eduardo VII Park.",
                link: { url: "https://en.wikipedia.org/wiki/Edward_VII_Park" },
              },
            },
          ],
        },
      },
    ],
  };
};

export const updateBlockReqBody = () => {
  return {
    paragraph: {
      rich_text: [
        {
          type: "text",
          text: {
            content:
              "Edward VII Park (Portuguese: Parque Eduardo VII) is a public park in Lisbon, Portugal.[1] The park occupies an area of 26 hectares (64 acres) to the north of Avenida da Liberdade and Marquis of Pombal Square in Lisbon's city center. The park is named for King Edward VII of the United Kingdom, who visited Portugal in 1903 to strengthen relations between the two countries and reaffirm the Anglo-Portuguese Alliance. The Lisbon Book Fair is held annually in Eduardo VII Park. The park was originally built to was built in the first half of the 20th century to restore public green space formerly occupied by Passeio Público, which was destroyed to make way for Avenida da Liberdade in 1879. The park was built on land belonging to the Pedreira de São Sebastião, and was known as Parque da Liberdade (Liberty Park) until the name was changed following Edward VII's visit. In 1945, Portuguese Modernist architect Francisco Keil do Amaral redesigned the park to its current configuration.",
            link: { url: "https://en.wikipedia.org/wiki/Edward_VII_Park" },
          },
        },
      ],
    },
  };
};

export const createPage3ReqBody = (database_id, user_id) => {
  return {
    parent: {
      database_id: `${database_id}`,
    },
    properties: {
      Name: {
        title: [
          {
            type: "text",
            text: {
              content: "Restaurante Ponto Final",
            },
          },
        ],
      },
      Description: {
        rich_text: [
          {
            type: "text",
            text: {
              content: "Restaurant in Lisbon",
            },
          },
        ],
      },
      Visited: {
        checkbox: false,
      },
      Type: {
        select: {
          name: "Restaurant",
        },
      },
      "Public transport cost": {
        number: 4.2,
      },
      "Distance from city center (km)": {
        number: 2.1,
      },
      "When to visit": {
        date: {
          start: "2024-11-19",
        },
      },
      "Activities to do": {
        multi_select: [
          {
            name: "Eat",
          },
          {
            name: "Photo shooting",
          },
        ],
      },
      "+1": {
        people: [
          {
            object: "user",
            id: `${user_id}`,
          },
        ],
      },
      Photo: {
        files: [],
      },
    },
  };
};

export const addCommentToPageReqBody = (page_id) => {
  return {
    parent: {
      page_id: `${page_id}`,
    },
    rich_text: [
      {
        text: {
          content: "I would love to go there!",
        },
      },
    ],
  };
};

export const addCommentToDiscussionReqBody = (discussion_id) => {
  return {
    discussion_id: `${discussion_id}`,
    rich_text: [
      {
        text: {
          content: "Check out this info!",
          link: {
            type: "url",
            url:
              "https://www.tripadvisor.com.gr/Restaurant_Review-g1022768-d713330-Reviews-Ponto_Final-Almada_Setubal_District_Alentejo.html",
          },
        },
      },
    ],
  };
};

export const archiveAPageReqBody = () => {
  return {
    archived: true,
  };
};

export const filterADatabaseReqBody = () => {
  return {
    filter: {
      property: "Type",
      select: {
        equals: "Park",
      },
    },
  };
};

export const sortADatabaseReqBody = () => {
  return {
    sorts: [
      {
        property: "When to visit",
        direction: "ascending",
      },
    ],
  };
};

export const queryADatabaseReqBody = () => {
  return {
    filter: {
      property: "Activities to do",
      multi_select: {
        contains: "Eat",
      },
    },
    sorts: [
      {
        property: "Distance from city center (km)",
        direction: "ascending",
      },
    ],
  };
};

export const search1ReqBody = () => {
  return {
    query: "Sights to visit in Lisbon",
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  };
};

export const search2ReqBody = () => {
  return {
    query: "Saint George's Castle",
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  };
};

export const search3ReqBody = () => {
  return {
    query: "love to go",
    sort: {
      direction: "ascending",
      timestamp: "last_edited_time",
    },
  };
};

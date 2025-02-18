import { PrismaClient } from "@prisma/client";

const map = {
  document: {
    store: {
      "document:document": {
        gridSize: 10,
        name: "",
        meta: {},
        id: "document:document",
        typeName: "document",
      },
      "page:page": {
        meta: {},
        id: "page:page",
        name: "Page 1",
        index: "a1",
        typeName: "page",
      },
      "asset:map": {
        id: "asset:map",
        type: "image",
        typeName: "asset",
        props: {
          name: "tldraw.png",
          src: "https://impartial-lynx-958.convex.cloud/api/storage/0063429f-13e3-41f3-9e93-429bd34d2b4e",
          w: 1105,
          h: 1012,
          mimeType: "image/png",
          isAnimated: false,
        },
        meta: {},
      },
      "shape:O1y3ZowkXtY6iB2iOYxTn": {
        x: 149.59441270888493,
        y: 580.6381915909448,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:O1y3ZowkXtY6iB2iOYxTn",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZvC53",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -27.877254817097935,
              y: -10.91664831741548,
            },
            a2CId: {
              id: "a2CId",
              index: "a2CId",
              x: 71.56742453885334,
              y: 356.14606611348825,
            },
            a30WD: {
              id: "a30WD",
              index: "a30WD",
              x: -99.39045003694753,
              y: 173.57396541615458,
            },
            a1iQg: {
              id: "a1iQg",
              index: "a1iQg",
              x: 93.65456578459998,
              y: -48.03463247589667,
            },
            a1xMeA2z: {
              id: "a1xMeA2z",
              index: "a1xMeA2z",
              x: 259.71784597624804,
              y: -5.605825991899138,
            },
            a24pdlxQ: {
              id: "a24pdlxQ",
              index: "a24pdlxQ",
              x: 475.41831503038566,
              y: 179.0482901045889,
            },
            a2168yJK: {
              id: "a2168yJK",
              index: "a2168yJK",
              x: 424.96490356975494,
              y: -81.67784649728875,
            },
            a22xtUPU: {
              id: "a22xtUPU",
              index: "a22xtUPU",
              x: 534.8369764274528,
              y: -28.516469009541368,
            },
            a23tlmRu: {
              id: "a23tlmRu",
              index: "a23tlmRu",
              x: 532.9102001392273,
              y: 82.54123608595793,
            },
            a28Z8PUK: {
              id: "a28Z8PUK",
              index: "a28Z8PUK",
              x: 176.68649731402786,
              y: 354.80404905366487,
            },
          },
          fill: "grey",
        },
        typeName: "shape",
      },
      "shape:Z5ffTgtevRDD2euFbu0UO": {
        x: 269.7099046723827,
        y: 683.7069324730201,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:Z5ffTgtevRDD2euFbu0UO",
        type: "polygon-shape",
        parentId: "page:page",
        index: "Zz6Xf",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -25.1329867222521,
              y: -69.86777560599762,
            },
            a4BYs: {
              id: "a4BYs",
              index: "a4BYs",
              x: -23.215200235380564,
              y: 160.9245060111757,
            },
            a54vX: {
              id: "a54vX",
              index: "a54vX",
              x: -125.75786577251779,
              y: 48.172334161939716,
            },
            a615n: {
              id: "a615n",
              index: "a615n",
              x: -92.8581597214843,
              y: -45.507974939103406,
            },
            a1hAC: {
              id: "a1hAC",
              index: "a1hAC",
              x: 143.31937859587248,
              y: -17.32840614258805,
            },
            a1sdN6C4: {
              id: "a1sdN6C4",
              index: "a1sdN6C4",
              x: 324.94190818448374,
              y: -86.45186397555295,
            },
            a1mtmZu0: {
              id: "a1mtmZu0",
              index: "a1mtmZu0",
              x: 294.147609902902,
              y: -97.52326816830336,
            },
            a1yMyDP5: {
              id: "a1yMyDP5",
              index: "a1yMyDP5",
              x: 327.5330164904241,
              y: -27.27946150240362,
            },
            a21Elmig: {
              id: "a21Elmig",
              index: "a21Elmig",
              x: 300.4968897684403,
              y: 7.963045813216453,
            },
            a3l9G: {
              id: "a3l9G",
              index: "a3l9G",
              x: 90.88805663174548,
              y: 139.31902670967736,
            },
            a22ffUf2: {
              id: "a22ffUf2",
              index: "a22ffUf2",
              x: 261.54537779480984,
              y: 19.18661738359844,
            },
            a2tuSoWp: {
              id: "a2tuSoWp",
              index: "a2tuSoWp",
              x: 115.41489560397599,
              y: 102.93105169483931,
            },
          },
          fill: "light-violet",
        },
        typeName: "shape",
      },
      "shape:svf8gFgovcJBfu9HwlF7T": {
        x: 234.92305714215013,
        y: 702.66976447511,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:svf8gFgovcJBfu9HwlF7T",
        type: "polygon-shape",
        parentId: "page:page",
        index: "a2AlT",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -37.89030742908642,
              y: -2.1245300118500836,
            },
            a208u: {
              id: "a208u",
              index: "a208u",
              x: 194.77502682903923,
              y: 36.2348016839652,
            },
            a35Nv: {
              id: "a35Nv",
              index: "a35Nv",
              x: 102.86340385669723,
              y: 129.73699517594764,
            },
            a42Ii: {
              id: "a42Ii",
              index: "a42Ii",
              x: 26.31461719314865,
              y: 156.3857118467663,
            },
            a1gmb: {
              id: "a1gmb",
              index: "a1gmb",
              x: 53.78003575697136,
              y: -40.271837039144316,
            },
            a1qSk97I: {
              id: "a1qSk97I",
              index: "a1qSk97I",
              x: 140.28111043972964,
              y: -13.86834081828232,
            },
            a1vIp5xr: {
              id: "a1vIp5xr",
              index: "a1vIp5xr",
              x: 335.7096765331531,
              y: -69.36258530876555,
            },
            a1xirj91: {
              id: "a1xirj91",
              index: "a1xirj91",
              x: 330.6027036636066,
              y: -50.46213881599395,
            },
            a52PB: {
              id: "a52PB",
              index: "a52PB",
              x: -38.11196958254058,
              y: 79.27011257253696,
            },
          },
          fill: "violet",
        },
        typeName: "shape",
      },
      "shape:wZZX37CMDiNMs9mVZOJbW": {
        x: -3.248635825415022,
        y: 220.8090046216504,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:wZZX37CMDiNMs9mVZOJbW",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZyBto",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: 4.574855984280447,
              y: -222.77685289182622,
            },
            a2Bbe: {
              id: "a2Bbe",
              index: "a2Bbe",
              x: 232.36654517457748,
              y: 40.44518891614962,
            },
            a31Zj: {
              id: "a31Zj",
              index: "a31Zj",
              x: 29.60231447026564,
              y: 235.06754381142179,
            },
            a1jGs: {
              id: "a1jGs",
              index: "a1jGs",
              x: 186.12588736260977,
              y: -223.98821631052996,
            },
            a1xRGBMi: {
              id: "a1xRGBMi",
              index: "a1xRGBMi",
              x: 183.54933895703653,
              y: -197.69668518369713,
            },
            a24WSDpM: {
              id: "a24WSDpM",
              index: "a24WSDpM",
              x: 86.43579982809487,
              y: -197.3585321821148,
            },
            a28437lS: {
              id: "a28437lS",
              index: "a28437lS",
              x: 30.144396798279203,
              y: -127.316683705569,
            },
            a29pqjpc: {
              id: "a29pqjpc",
              index: "a29pqjpc",
              x: 27.378259165813915,
              y: -40.718271315168835,
            },
            a2giY: {
              id: "a2giY",
              index: "a2giY",
              x: 217.56851099765123,
              y: 88.72533311819927,
            },
            a2lvqGCi: {
              id: "a2lvqGCi",
              index: "a2lvqGCi",
              x: 104.60230293968135,
              y: 67.78946586801652,
            },
            a2tkmfFq: {
              id: "a2tkmfFq",
              index: "a2tkmfFq",
              x: 29.674914563946416,
              y: 148.61275073271088,
            },
            a3Y1A: {
              id: "a3Y1A",
              index: "a3Y1A",
              x: 3.278586407713064,
              y: 237.40358753502127,
            },
          },
          fill: "violet",
        },
        typeName: "shape",
      },
      "shape:Ef5dFBoIuTFcJWgvqm6rp": {
        x: 242.9324157964022,
        y: 249.37677021021403,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:Ef5dFBoIuTFcJWgvqm6rp",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZxBdV",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -218.46103600958023,
              y: -88.03234302693681,
            },
            a23Pd: {
              id: "a23Pd",
              index: "a23Pd",
              x: 95.94769130702764,
              y: -4.8622194718533365,
            },
            a39tm: {
              id: "a39tm",
              index: "a39tm",
              x: 193.10668198849714,
              y: 160.7157604303946,
            },
            a4CNM: {
              id: "a4CNM",
              index: "a4CNM",
              x: -33.59473391441327,
              y: 83.77965682549927,
            },
            a2hfk: {
              id: "a2hfk",
              index: "a2hfk",
              x: 226.29924992977766,
              y: 89.31648515710489,
            },
            a2Roc: {
              id: "a2Roc",
              index: "a2Roc",
              x: 194.94826483095264,
              y: 50.804198182917716,
            },
            a1hPp: {
              id: "a1hPp",
              index: "a1hPp",
              x: 43.36506764988184,
              y: -0.819552573867611,
            },
            a3rd4: {
              id: "a3rd4",
              index: "a3rd4",
              x: 107.59212458434985,
              y: 162.6064318381647,
            },
            a51as: {
              id: "a51as",
              index: "a51as",
              x: -87.84639412362242,
              y: 89.67323157161198,
            },
            a420D8JB: {
              id: "a420D8JB",
              index: "a420D8JB",
              x: 84.41107222184675,
              y: 153.1113572471902,
            },
            a6BNu: {
              id: "a6BNu",
              index: "a6BNu",
              x: -200.7038802576731,
              y: 206.64636115221606,
            },
            a76V7: {
              id: "a76V7",
              index: "a76V7",
              x: -220.63545928816734,
              y: 205.84468712769888,
            },
          },
          fill: "light-violet",
        },
        typeName: "shape",
      },
      "shape:qsPO6k4UJ5R6PwYK_yWGd": {
        x: 24.412177603002903,
        y: 435.9995132729799,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:qsPO6k4UJ5R6PwYK_yWGd",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZuA1e",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -1.949256716814375,
              y: -347.7655956048512,
            },
            a33rm: {
              id: "a33rm",
              index: "a33rm",
              x: 56.010907099445575,
              y: 101.5861361841853,
            },
            a40Eo: {
              id: "a40Eo",
              index: "a40Eo",
              x: -22.8395019081224,
              y: 99.05095039290484,
            },
            a1el9: {
              id: "a1el9",
              index: "a1el9",
              x: 56.901936933542146,
              y: -412.88172322767156,
            },
            a1rYS4XV: {
              id: "a1rYS4XV",
              index: "a1rYS4XV",
              x: 155.93696744421868,
              y: -416.1773866768242,
            },
            a1xx6h0U: {
              id: "a1xx6h0U",
              index: "a1xx6h0U",
              x: 334.9531435036225,
              y: -269.86947498872735,
            },
            a1ukmZ0V: {
              id: "a1ukmZ0V",
              index: "a1ukmZ0V",
              x: 145.56847692397895,
              y: -308.5062934894631,
            },
            a219QvOz: {
              id: "a219QvOz",
              index: "a219QvOz",
              x: 520.2714656676778,
              y: -15.069228971567156,
            },
            a1zYGqj9: {
              id: "a1zYGqj9",
              index: "a1zYGqj9",
              x: 535.8997671413392,
              y: -161.86585225137569,
            },
            a22kb7Sl: {
              id: "a22kb7Sl",
              index: "a22kb7Sl",
              x: 282.7150294610127,
              y: 51.807079593772045,
            },
            a21x16NJ: {
              id: "a21x16NJ",
              index: "a21x16NJ",
              x: 451.60991374248357,
              y: 55.34759554853589,
            },
            a23YBAWT: {
              id: "a23YBAWT",
              index: "a23YBAWT",
              x: 178.57490307635254,
              y: -11.59137287785309,
            },
            a51zT: {
              id: "a51zT",
              index: "a51zT",
              x: -26.386507625808463,
              y: -123.52920022449331,
            },
            a4fyl: {
              id: "a4fyl",
              index: "a4fyl",
              x: -23.294081449361016,
              y: 23.31508536482474,
            },
          },
          fill: "grey",
        },
        typeName: "shape",
      },
      "shape:nppI1I1KkQPXyu4VsE7ln": {
        x: 865.7551816149032,
        y: 167.27050954650122,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:nppI1I1KkQPXyu4VsE7ln",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZtSAJ",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -323.9234473065668,
              y: -144.8566184979918,
            },
            a33kt: {
              id: "a33kt",
              index: "a33kt",
              x: 134.43076749814895,
              y: 144.55095588167376,
            },
            a4732: {
              id: "a4732",
              index: "a4732",
              x: 10.938304878280405,
              y: 117.45412237031985,
            },
            a57xD: {
              id: "a57xD",
              index: "a57xD",
              x: -323.7237438014271,
              y: -114.4493847190979,
            },
            a1hwR: {
              id: "a1hwR",
              index: "a1hwR",
              x: 58.739301983784515,
              y: -137.23711057732274,
            },
            a1vVA1lM: {
              id: "a1vVA1lM",
              index: "a1vVA1lM",
              x: 112.49231107087209,
              y: -119.42943480549856,
            },
            a22HX7CO: {
              id: "a22HX7CO",
              index: "a22HX7CO",
              x: 133.5355784701867,
              y: -17.108451128259027,
            },
            a3ksO: {
              id: "a3ksO",
              index: "a3ksO",
              x: 101.25892884934967,
              y: 194.918982071254,
            },
            a3vxiBRk: {
              id: "a3vxiBRk",
              index: "a3vxiBRk",
              x: -22.13340901636485,
              y: 216.1579850222938,
            },
            a4nLR: {
              id: "a4nLR",
              index: "a4nLR",
              x: -26.4985293778671,
              y: 14.600967081502347,
            },
            a4xeKAru: {
              id: "a4xeKAru",
              index: "a4xeKAru",
              x: -104.07475098273571,
              y: -62.78406845344378,
            },
            a52nldzq: {
              id: "a52nldzq",
              index: "a52nldzq",
              x: -242.38192948529888,
              y: -38.25743473649233,
            },
          },
          fill: "light-violet",
        },
        typeName: "shape",
      },
      "shape:QnIXr70nUY4_2ycC13nHY": {
        x: 539.1878174348661,
        y: -3.034010588031208,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:QnIXr70nUY4_2ycC13nHY",
        type: "polygon-shape",
        parentId: "page:page",
        index: "ZtlCH",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: 3.32352642011881,
              y: 1.0403577310427465,
            },
            a2BTV: {
              id: "a2BTV",
              index: "a2BTV",
              x: 545.9052414605053,
              y: 2.9180954541436392,
            },
            a4307: {
              id: "a4307",
              index: "a4307",
              x: 3.7351768398293643,
              y: 27.28665666463158,
            },
            a2erG: {
              id: "a2erG",
              index: "a2erG",
              x: 547.8896091601675,
              y: 432.78249007334074,
            },
            a2pfC2kY: {
              id: "a2pfC2kY",
              index: "a2pfC2kY",
              x: 326.53191248043356,
              y: 431.3756150519868,
            },
            a2v4AbAU: {
              id: "a2v4AbAU",
              index: "a2v4AbAU",
              x: 326.11093769469045,
              y: 570.0011379992026,
            },
            a2xlesRy: {
              id: "a2xlesRy",
              index: "a2xlesRy",
              x: 303.3682701790917,
              y: 569.7282204377044,
            },
            a2z7P1Mf: {
              id: "a2z7P1Mf",
              index: "a2z7P1Mf",
              x: 303.75277444787264,
              y: 386.90057629914554,
            },
            a2znHCUx: {
              id: "a2znHCUx",
              index: "a2znHCUx",
              x: 429.50220983098507,
              y: 364.4928642182158,
            },
            a308DBaD: {
              id: "a308DBaD",
              index: "a308DBaD",
              x: 456.8468425318506,
              y: 310.10805481218733,
            },
            a30IgHz9: {
              id: "a30IgHz9",
              index: "a30IgHz9",
              x: 453.9356602202445,
              y: 150.80976181185042,
            },
            a30Nug7p: {
              id: "a30Nug7p",
              index: "a30Nug7p",
              x: 432.4085058248978,
              y: 59.620833721644686,
            },
            a30QWz8T: {
              id: "a30QWz8T",
              index: "a30QWz8T",
              x: 380.53863449041177,
              y: 34.565844017945764,
            },
          },
          fill: "violet",
        },
        typeName: "shape",
      },
      "shape:YIBSuJVEqogKCWCW_raEH": {
        x: 460.6654898463263,
        y: -0.7233583896631899,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:YIBSuJVEqogKCWCW_raEH",
        type: "polygon-shape",
        parentId: "page:page",
        index: "Zt4Bg",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: { id: "a1", index: "a1", x: 0, y: 0 },
            a286y: {
              id: "a286y",
              index: "a286y",
              x: 600.4281222528522,
              y: 7.889762097271046,
            },
            a39Ik: {
              id: "a39Ik",
              index: "a39Ik",
              x: 262.46977364303063,
              y: 210.24025094994994,
            },
            a494W: {
              id: "a494W",
              index: "a494W",
              x: -1.2281233453300047,
              y: 88.73374451804779,
            },
            a3p03: {
              id: "a3p03",
              index: "a3p03",
              x: 126.29758573610957,
              y: 208.8563874269707,
            },
            a2nmZ: {
              id: "a2nmZ",
              index: "a2nmZ",
              x: 390.01070829624337,
              y: 408.68595023539604,
            },
            a2yXe08j: {
              id: "a2yXe08j",
              index: "a2yXe08j",
              x: 301.8228750275564,
              y: 341.3686267156633,
            },
            a2Vzw: {
              id: "a2Vzw",
              index: "a2Vzw",
              x: 589.7099548754271,
              y: 378.3899551737578,
            },
            a2tA6VmZ: {
              id: "a2tA6VmZ",
              index: "a2tA6VmZ",
              x: 383.76060493362235,
              y: 608.0318296098785,
            },
            a2vqsQOh: {
              id: "a2vqsQOh",
              index: "a2vqsQOh",
              x: 302.7325741842932,
              y: 605.6560608320184,
            },
            a33vC04y: {
              id: "a33vC04y",
              index: "a33vC04y",
              x: 327.383607804319,
              y: 277.22801791261463,
            },
          },
          fill: "grey",
        },
        typeName: "shape",
      },
      "shape:jeQyciRteYyjeZ_WyKnF0": {
        x: 0,
        y: 0,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:jeQyciRteYyjeZ_WyKnF0",
        type: "geo",
        props: {
          w: 1085.9607390383076,
          h: 1004.027213126607,
          geo: "rectangle",
          color: "black",
          labelColor: "black",
          fill: "none",
          dash: "solid",
          size: "m",
          font: "draw",
          text: "",
          align: "middle",
          verticalAlign: "middle",
          growY: 0,
          url: "",
          scale: 1,
        },
        parentId: "page:page",
        index: "Ztxbx9Vq",
        typeName: "shape",
      },
      "shape:5uuH21mjenCZuqCwssTAN": {
        x: 595.1051555111785,
        y: 374.0371737549433,
        rotation: 0,
        isLocked: false,
        opacity: 1,
        meta: {},
        id: "shape:5uuH21mjenCZuqCwssTAN",
        type: "polygon-shape",
        parentId: "page:page",
        index: "Zs8c0",
        props: {
          w: 100,
          h: 100,
          points: {
            a1: {
              id: "a1",
              index: "a1",
              x: -593.939387137737,
              y: -375.7413800895274,
            },
            a27CU: {
              id: "a27CU",
              index: "a27CU",
              x: 490.6840560121059,
              y: -373.37887091842816,
            },
            a32QC: {
              id: "a32QC",
              index: "a32QC",
              x: 490.37747658827175,
              y: 629.5434135412023,
            },
            a4BDj: {
              id: "a4BDj",
              index: "a4BDj",
              x: -34.589715489375976,
              y: 628.8245075841785,
            },
            a5AjD: {
              id: "a5AjD",
              index: "a5AjD",
              x: -596.7228172580861,
              y: 628.3320868056338,
            },
          },
          fill: "black",
        },
        typeName: "shape",
      },
    },
    schema: {
      schemaVersion: 2,
      sequences: {
        "com.tldraw.store": 4,
        "com.tldraw.asset": 1,
        "com.tldraw.camera": 1,
        "com.tldraw.document": 2,
        "com.tldraw.instance": 25,
        "com.tldraw.instance_page_state": 5,
        "com.tldraw.page": 1,
        "com.tldraw.instance_presence": 6,
        "com.tldraw.pointer": 1,
        "com.tldraw.shape": 4,
        "com.tldraw.asset.bookmark": 2,
        "com.tldraw.asset.image": 5,
        "com.tldraw.asset.video": 5,
        "com.tldraw.shape.group": 0,
        "com.tldraw.shape.text": 2,
        "com.tldraw.shape.bookmark": 2,
        "com.tldraw.shape.draw": 2,
        "com.tldraw.shape.geo": 9,
        "com.tldraw.shape.note": 8,
        "com.tldraw.shape.line": 5,
        "com.tldraw.shape.frame": 0,
        "com.tldraw.shape.arrow": 5,
        "com.tldraw.shape.highlight": 1,
        "com.tldraw.shape.embed": 4,
        "com.tldraw.shape.image": 4,
        "com.tldraw.shape.video": 2,
        "com.tldraw.shape.polygon-shape": 0,
        "com.tldraw.binding.arrow": 0,
      },
    },
  },
  session: {
    version: 0,
    currentPageId: "page:page",
    exportBackground: true,
    isFocusMode: false,
    isDebugMode: false,
    isToolLocked: false,
    isGridMode: false,
    pageStates: [
      {
        pageId: "page:page",
        camera: {
          x: 781.4153607780911,
          y: 341.4222455995479,
          z: 0.3806287296776323,
        },
        selectedShapeIds: [],
        focusedGroupId: null,
      },
    ],
  },
  center: { lat: -27.4075, lng: 153.0005 },
  zoom: 14,
};

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.location.deleteMany({});

  // Sample locations
  const locations = [
    {
      name: "Enoggra",
      slug: "enoggra",
      organizationId: "org_2rcDzOAeZ1khUtDYZb4QsyP9X6Y",
      map: map,
    },
    {
      name: "Morningside",
      slug: "morningside",
      organizationId: "org_2rcDzOAeZ1khUtDYZb4QsyP9X6Y",
      map: map,
    },
  ];

  await prisma.location.createMany({
    data: locations,
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

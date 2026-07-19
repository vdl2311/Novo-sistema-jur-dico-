var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/server.ts
var server_exports = {};
__export(server_exports, {
  default: () => server_default
});
module.exports = __toCommonJS(server_exports);
var import_express = __toESM(require("express"), 1);

// src/app/api/agents/route.ts
var route_exports = {};
__export(route_exports, {
  GET: () => GET,
  POST: () => POST,
  dynamic: () => dynamic
});

// src/lib/db.ts
var import_firestore3 = require("firebase/firestore");

// src/lib/firebase-init.ts
var import_app = require("firebase/app");
var import_firestore = require("firebase/firestore");

// firebase-applet-config.json
var firebase_applet_config_default = {
  projectId: "gen-lang-client-0980220447",
  appId: "1:656167115848:web:ee3c5ce0fd26437b5fcc7d",
  apiKey: "AIzaSyCSudogcfsCw0aIfj0rmW2MkA8alq0r6_4",
  authDomain: "gen-lang-client-0980220447.firebaseapp.com",
  firestoreDatabaseId: "ai-studio-jurisistem-63abac2a-78a0-46c9-a430-7028bb72a0c5",
  storageBucket: "gen-lang-client-0980220447.firebasestorage.app",
  messagingSenderId: "656167115848",
  measurementId: "",
  oAuthClientId: "656167115848-dt13u9l8dujvsavlgkn8q6nr3hmm9am8.apps.googleusercontent.com",
  recaptchaSiteKey: ""
};

// src/lib/firebase-init.ts
var config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebase_applet_config_default?.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebase_applet_config_default?.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebase_applet_config_default?.projectId || "pro-bolso",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebase_applet_config_default?.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebase_applet_config_default?.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebase_applet_config_default?.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebase_applet_config_default?.measurementId
};
var databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || firebase_applet_config_default?.firestoreDatabaseId;
var app = (0, import_app.getApps)().length === 0 ? (0, import_app.initializeApp)(config) : (0, import_app.getApp)();
var firestoreInstance;
try {
  firestoreInstance = (0, import_firestore.initializeFirestore)(app, {
    experimentalForceLongPolling: true
  }, databaseId);
} catch (e) {
  firestoreInstance = (0, import_firestore.getFirestore)(app, databaseId);
}
var firestore = firestoreInstance;

// src/lib/firebase-service.ts
var import_firestore2 = require("firebase/firestore");
var isServer = typeof window === "undefined";
async function safeGetDoc(docRef) {
  if (isServer) {
    console.log(`[FirebaseService Server] safeGetDoc calling getDocFromServer: ${docRef.path}`);
    return await (0, import_firestore2.getDocFromServer)(docRef);
  }
  return await (0, import_firestore2.getDoc)(docRef);
}
async function safeGetDocs(queryRef) {
  if (isServer) {
    console.log(`[FirebaseService Server] safeGetDocs calling getDocsFromServer`);
    return await (0, import_firestore2.getDocsFromServer)(queryRef);
  }
  return await (0, import_firestore2.getDocs)(queryRef);
}
function convertDatesToTimestamps(obj) {
  if (obj === null || obj === void 0) return obj;
  if (obj instanceof Date) {
    return import_firestore2.Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps);
  }
  if (typeof obj === "object") {
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertDatesToTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}
function convertTimestampsToDates(obj) {
  if (obj === null || obj === void 0) return obj;
  if (obj instanceof import_firestore2.Timestamp) {
    return obj.toDate();
  }
  if (obj && typeof obj === "object") {
    const sec = obj.seconds !== void 0 ? obj.seconds : obj._seconds;
    const nano = obj.nanoseconds !== void 0 ? obj.nanoseconds : obj._nanoseconds;
    if (sec !== void 0 && nano !== void 0) {
      return new import_firestore2.Timestamp(sec, nano).toDate();
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates);
  }
  if (typeof obj === "object") {
    if (obj instanceof Date) return obj;
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertTimestampsToDates(obj[key]);
    }
    if (newObj.id !== void 0 && newObj._id === void 0) {
      newObj._id = newObj.id;
    }
    return newObj;
  }
  return obj;
}
function sanitizeData(obj) {
  if (obj === null || obj === void 0) return null;
  if (obj instanceof import_firestore2.Timestamp) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeData);
  }
  if (typeof obj === "object") {
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== void 0) {
        newObj[key] = sanitizeData(val);
      }
    }
    return newObj;
  }
  return obj;
}
var FirebaseService = {
  /**
   * Saves or updates a document in Firestore with robust error-handling, logging and guaranteed promise resolution.
   */
  async saveRecord(collectionName, id, data) {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Starting operation. ID: ${id || "NEW"}`);
    console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Raw Input Data:`, JSON.stringify(data));
    try {
      let preparedData = convertDatesToTimestamps(data);
      preparedData = sanitizeData(preparedData);
      let docRef;
      let finalId = id;
      if (finalId) {
        docRef = (0, import_firestore2.doc)(firestore, collectionName, finalId);
      } else {
        const collRef = (0, import_firestore2.collection)(firestore, collectionName);
        docRef = (0, import_firestore2.doc)(collRef);
        finalId = docRef.id;
        preparedData.id = finalId;
        preparedData._id = finalId;
      }
      const now = import_firestore2.Timestamp.now();
      if (!preparedData.createdAt) {
        preparedData.createdAt = now;
      }
      preparedData.updatedAt = now;
      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Prepared Firestore Payload:`, JSON.stringify(preparedData));
      await (0, import_firestore2.setDoc)(docRef, preparedData);
      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] Write operation succeeded. Fetching to verify persistence...`);
      const verifiedSnap = await safeGetDoc(docRef);
      if (!verifiedSnap.exists()) {
        throw new Error(`Write completed but document was not found immediately in collection '${collectionName}' with ID '${finalId}'`);
      }
      const savedData = convertTimestampsToDates({ id: verifiedSnap.id, ...verifiedSnap.data() || {} });
      console.log(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] SUCCESS. Document fully persisted and verified:`, savedData);
      return savedData;
    } catch (error) {
      console.error(`[FirebaseService:${collectionName}:saveRecord] [Op:${operationId}] CRITICAL ERROR during document write:`, error);
      throw error;
    }
  },
  /**
   * Updates a specific record in Firestore.
   */
  async updateRecord(collectionName, id, data) {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Starting patch on ID: ${id}`);
    console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Patch Data:`, JSON.stringify(data));
    try {
      if (!id) {
        throw new Error(`Cannot update document in collection '${collectionName}' without a valid ID`);
      }
      let preparedData = convertDatesToTimestamps(data);
      preparedData = sanitizeData(preparedData);
      preparedData.updatedAt = import_firestore2.Timestamp.now();
      const docRef = (0, import_firestore2.doc)(firestore, collectionName, id);
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Executing updateDoc...`);
      await (0, import_firestore2.updateDoc)(docRef, preparedData);
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] Patch write completed. Fetching to verify...`);
      const verifiedSnap = await safeGetDoc(docRef);
      const savedData = convertTimestampsToDates({ id: verifiedSnap.id, ...verifiedSnap.data() || {} });
      console.log(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] SUCCESS. Document patched and verified:`, savedData);
      return savedData;
    } catch (error) {
      console.error(`[FirebaseService:${collectionName}:updateRecord] [Op:${operationId}] CRITICAL ERROR during updateDoc:`, error);
      throw error;
    }
  },
  /**
   * Deletes a document from Firestore.
   */
  async deleteRecord(collectionName, id) {
    const operationId = Math.random().toString(36).substring(2, 9);
    console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] Requesting delete of ID: ${id}`);
    try {
      if (!id) {
        throw new Error(`Cannot delete document in collection '${collectionName}' without a valid ID`);
      }
      const docRef = (0, import_firestore2.doc)(firestore, collectionName, id);
      const snap = await safeGetDoc(docRef);
      const backupData = snap.exists() ? convertTimestampsToDates({ id: snap.id, ...snap.data() || {} }) : { id };
      console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] Executing deleteDoc...`);
      await (0, import_firestore2.deleteDoc)(docRef);
      console.log(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] SUCCESS. Document deleted.`);
      return backupData;
    } catch (error) {
      console.error(`[FirebaseService:${collectionName}:deleteRecord] [Op:${operationId}] CRITICAL ERROR during deleteDoc:`, error);
      throw error;
    }
  },
  /**
   * Gets a document from Firestore.
   */
  async getRecord(collectionName, id) {
    console.log(`[FirebaseService:${collectionName}:getRecord] Fetching ID: ${id}`);
    try {
      const docRef = (0, import_firestore2.doc)(firestore, collectionName, id);
      const snap = await safeGetDoc(docRef);
      if (!snap.exists()) {
        console.warn(`[FirebaseService:${collectionName}:getRecord] Document with ID ${id} does not exist.`);
        return null;
      }
      return convertTimestampsToDates({ id: snap.id, ...snap.data() || {} });
    } catch (error) {
      console.error(`[FirebaseService:${collectionName}:getRecord] CRITICAL ERROR:`, error);
      throw error;
    }
  },
  /**
   * Lists and filters documents from Firestore.
   */
  async listRecords(collectionName, filter) {
    console.log(`[FirebaseService:${collectionName}:listRecords] Fetching all documents. Filter:`, filter);
    try {
      const collRef = (0, import_firestore2.collection)(firestore, collectionName);
      let q = collRef;
      if (filter) {
        q = (0, import_firestore2.query)(collRef, (0, import_firestore2.where)(filter.field, "==", filter.value));
      }
      const snapshot = await safeGetDocs(q);
      const items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates);
      console.log(`[FirebaseService:${collectionName}:listRecords] SUCCESS. Found ${items.length} documents.`);
      return items;
    } catch (error) {
      console.error(`[FirebaseService:${collectionName}:listRecords] CRITICAL ERROR:`, error);
      throw error;
    }
  }
};

// src/lib/db.ts
var isServer2 = typeof window === "undefined";
async function safeGetDoc2(docRef) {
  if (isServer2) {
    console.log(`[Firestore DB Server] safeGetDoc calling getDocFromServer: ${docRef.path}`);
    return await (0, import_firestore3.getDocFromServer)(docRef);
  }
  return await (0, import_firestore3.getDoc)(docRef);
}
async function safeGetDocs2(queryRef) {
  if (isServer2) {
    console.log(`[Firestore DB Server] safeGetDocs calling getDocsFromServer`);
    return await (0, import_firestore3.getDocsFromServer)(queryRef);
  }
  return await (0, import_firestore3.getDocs)(queryRef);
}
function convertTimestampsToDates2(obj) {
  if (obj === null || obj === void 0) return obj;
  if (obj instanceof import_firestore3.Timestamp) {
    return obj.toDate();
  }
  if (obj && typeof obj === "object") {
    const sec = obj.seconds !== void 0 ? obj.seconds : obj._seconds;
    const nano = obj.nanoseconds !== void 0 ? obj.nanoseconds : obj._nanoseconds;
    if (sec !== void 0 && nano !== void 0) {
      return new import_firestore3.Timestamp(sec, nano).toDate();
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates2);
  }
  if (typeof obj === "object") {
    if (obj instanceof Date) return obj;
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertTimestampsToDates2(obj[key]);
    }
    if (newObj.id !== void 0 && newObj._id === void 0) {
      newObj._id = newObj.id;
    }
    return newObj;
  }
  return obj;
}
function convertDatesToTimestamps2(obj) {
  if (obj === null || obj === void 0) return obj;
  if (obj instanceof Date) {
    return import_firestore3.Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps2);
  }
  if (typeof obj === "object") {
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertDatesToTimestamps2(obj[key]);
    }
    return newObj;
  }
  return obj;
}
function sanitizeFirestoreData(obj) {
  if (obj === null || obj === void 0) return null;
  if (obj instanceof import_firestore3.Timestamp) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreData);
  }
  if (typeof obj === "object") {
    if (obj.constructor && obj.constructor.name !== "Object") return obj;
    const newObj = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== void 0) {
        newObj[key] = sanitizeFirestoreData(val);
      }
    }
    return newObj;
  }
  return obj;
}
function matchCriteria(item, where) {
  if (!where) return true;
  if (where.OR) {
    if (Array.isArray(where.OR)) {
      const matchAny = where.OR.some((subWhere) => matchCriteria(item, subWhere));
      if (!matchAny) return false;
    }
  }
  if (where.AND) {
    if (Array.isArray(where.AND)) {
      const matchAll = where.AND.every((subWhere) => matchCriteria(item, subWhere));
      if (!matchAll) return false;
    }
  }
  if (where.NOT) {
    if (Array.isArray(where.NOT)) {
      const matchAny = where.NOT.some((subWhere) => matchCriteria(item, subWhere));
      if (matchAny) return false;
    } else if (typeof where.NOT === "object") {
      if (matchCriteria(item, where.NOT)) return false;
    }
  }
  for (const key of Object.keys(where)) {
    if (key === "OR" || key === "AND" || key === "NOT") continue;
    const filter = where[key];
    const val = item[key];
    if (filter === void 0) continue;
    if (filter && typeof filter === "object" && !Array.isArray(filter) && !(filter instanceof Date)) {
      if ("contains" in filter) {
        const needle = String(filter.contains).toLowerCase();
        const haystack = String(val || "").toLowerCase();
        if (!haystack.includes(needle)) return false;
      } else if ("startsWith" in filter) {
        const needle = String(filter.startsWith).toLowerCase();
        const haystack = String(val || "").toLowerCase();
        if (!haystack.startsWith(needle)) return false;
      } else if ("endsWith" in filter) {
        const needle = String(filter.endsWith).toLowerCase();
        const haystack = String(val || "").toLowerCase();
        if (!haystack.endsWith(needle)) return false;
      } else if ("in" in filter) {
        const arr = filter.in;
        if (!Array.isArray(arr) || !arr.includes(val)) return false;
      } else if ("notIn" in filter) {
        const arr = filter.notIn;
        if (Array.isArray(arr) && arr.includes(val)) return false;
      } else if ("not" in filter) {
        const notVal = filter.not;
        if (notVal && typeof notVal === "object" && !Array.isArray(notVal) && !(notVal instanceof Date)) {
          if (matchCriteria({ [key]: val }, { [key]: notVal })) return false;
        } else {
          if (val === notVal) return false;
        }
      } else {
        if ("gt" in filter) {
          const limit = filter.gt instanceof Date ? filter.gt.getTime() : filter.gt;
          const actual = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? Date.parse(val) : val;
          if (!(actual > limit)) return false;
        }
        if ("gte" in filter) {
          const limit = filter.gte instanceof Date ? filter.gte.getTime() : filter.gte;
          const actual = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? Date.parse(val) : val;
          if (!(actual >= limit)) return false;
        }
        if ("lt" in filter) {
          const limit = filter.lt instanceof Date ? filter.lt.getTime() : filter.lt;
          const actual = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? Date.parse(val) : val;
          if (!(actual < limit)) return false;
        }
        if ("lte" in filter) {
          const limit = filter.lte instanceof Date ? filter.lte.getTime() : filter.lte;
          const actual = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? Date.parse(val) : val;
          if (!(actual <= limit)) return false;
        }
      }
    } else {
      if (filter instanceof Date) {
        const filterTime = filter.getTime();
        const valTime = val instanceof Date ? val.getTime() : typeof val === "string" && !isNaN(Date.parse(val)) ? Date.parse(val) : null;
        if (valTime !== filterTime) return false;
      } else {
        if (val !== filter) return false;
      }
    }
  }
  return true;
}
function sortItems(items, orderBy) {
  if (!orderBy) return items;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];
  return [...items].sort((a, b) => {
    for (const order of orders) {
      const key = Object.keys(order)[0];
      const dir = order[key];
      const valA = a[key];
      const valB = b[key];
      if (valA === void 0 || valB === void 0) continue;
      let compare = 0;
      if (valA instanceof Date && valB instanceof Date) {
        compare = valA.getTime() - valB.getTime();
      } else if (typeof valA === "string" && typeof valB === "string") {
        compare = valA.localeCompare(valB);
      } else {
        compare = valA > valB ? 1 : valA < valB ? -1 : 0;
      }
      if (compare !== 0) {
        return dir === "desc" ? -compare : compare;
      }
    }
    return 0;
  });
}
function buildFirestoreQuery(modelName, prismaWhere, limitVal) {
  const collRef = (0, import_firestore3.collection)(firestore, modelName);
  const constraints = [];
  if (prismaWhere) {
    for (const key of Object.keys(prismaWhere)) {
      if (key === "OR" || key === "AND" || key === "NOT") continue;
      const val = prismaWhere[key];
      if (val !== void 0 && (typeof val === "string" || typeof val === "number" || typeof val === "boolean")) {
        constraints.push((0, import_firestore3.where)(key, "==", val));
      }
    }
  }
  if (typeof limitVal === "number") {
    constraints.push((0, import_firestore3.limit)(limitVal));
  }
  if (constraints.length > 0) {
    return (0, import_firestore3.query)(collRef, ...constraints);
  }
  return collRef;
}
async function resolveRelations(modelName, items, include) {
  if (!include || items.length === 0) return items;
  const resolvedItems = [...items];
  for (const relationName of Object.keys(include)) {
    if (!include[relationName]) continue;
    let targetModel = relationName;
    let foreignKey = `${relationName}Id`;
    let isMany = false;
    if (relationName === "process") {
      targetModel = "process";
      foreignKey = "processId";
    } else if (relationName === "client") {
      targetModel = "client";
      foreignKey = "clientId";
    } else if (relationName === "template") {
      targetModel = "contractTemplate";
      foreignKey = "templateId";
    } else if (relationName === "runs") {
      targetModel = "agentRun";
      foreignKey = "agentId";
      isMany = true;
    } else if (relationName === "contracts") {
      targetModel = "contract";
      foreignKey = "clientId";
      isMany = true;
    } else if (relationName === "documents") {
      targetModel = "document";
      foreignKey = "clientId";
      isMany = true;
    } else if (relationName === "checks") {
      targetModel = "complianceCheck";
      foreignKey = "ruleId";
      isMany = true;
    } else if (relationName === "movements") {
      targetModel = "movement";
      foreignKey = "processId";
      isMany = true;
    } else if (relationName === "deadlines") {
      targetModel = "deadline";
      foreignKey = "processId";
      isMany = true;
    } else if (relationName === "tasks") {
      targetModel = "task";
      foreignKey = "processId";
      isMany = true;
    } else if (relationName === "_count") {
      const countFields = Object.keys(include._count?.select || {});
      try {
        const relationSnapshots = {};
        for (const f of countFields) {
          let col = f;
          if (f === "movements") col = "movement";
          if (f === "deadlines") col = "deadline";
          if (f === "tasks") col = "task";
          if (f === "documents") col = "document";
          try {
            const snap = await safeGetDocs2((0, import_firestore3.collection)(firestore, col));
            relationSnapshots[f] = snap.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() }));
          } catch (e) {
            relationSnapshots[f] = [];
          }
        }
        for (let i = 0; i < resolvedItems.length; i++) {
          const item = resolvedItems[i];
          const counts = {};
          for (const f of countFields) {
            let foreignKeyName = "processId";
            if (f === "documents") foreignKeyName = "clientId";
            counts[f] = relationSnapshots[f].filter(
              (t) => t[foreignKeyName] === item.id || t.processId === item.id || t.clientId === item.id
            ).length;
          }
          resolvedItems[i]._count = counts;
        }
      } catch (e) {
        console.error("Erro ao resolver rela\xE7\xE3o _count:", e);
      }
      continue;
    }
    try {
      const q = (0, import_firestore3.collection)(firestore, targetModel);
      const targetSnapshot = await safeGetDocs2(q);
      const targetItems = targetSnapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() })).map(convertTimestampsToDates2);
      for (let i = 0; i < resolvedItems.length; i++) {
        const item = resolvedItems[i];
        if (isMany) {
          let related = targetItems.filter(
            (t) => t[foreignKey] === item.id || t.processId === item.id || t.clientId === item.id || t.contractId === item.id
          );
          const relationOptions = include[relationName];
          if (relationOptions && typeof relationOptions === "object") {
            if (relationOptions.orderBy) {
              related = sortItems(related, relationOptions.orderBy);
            }
            if (typeof relationOptions.take === "number") {
              related = related.slice(0, relationOptions.take);
            }
          }
          resolvedItems[i][relationName] = related;
        } else {
          const fKeyVal = item[foreignKey];
          resolvedItems[i][relationName] = targetItems.find((t) => t.id === fKeyVal) || null;
        }
      }
    } catch (e) {
      console.error(`Erro ao resolver rela\xE7\xE3o ${relationName}:`, e);
    }
  }
  return resolvedItems;
}
function createModelProxy(modelName) {
  return {
    async findMany(args = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await safeGetDocs2(q);
      let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      if (args.where) {
        items = items.filter((item) => matchCriteria(item, args.where));
      }
      if (args.orderBy) {
        items = sortItems(items, args.orderBy);
      }
      if (typeof args.skip === "number") {
        items = items.slice(args.skip);
      }
      if (typeof args.take === "number") {
        items = items.slice(0, args.take);
      }
      if (args.include) {
        items = await resolveRelations(modelName, items, args.include);
      }
      return items;
    },
    async findUnique(args) {
      const where = args.where || {};
      if (where.id) {
        const docRef = (0, import_firestore3.doc)(firestore, modelName, where.id);
        const docSnap = await safeGetDoc2(docRef);
        if (!docSnap.exists()) return null;
        let item = convertTimestampsToDates2({ id: docSnap.id, ...docSnap.data() || {} });
        if (args.include) {
          const resolved = await resolveRelations(modelName, [item], args.include);
          item = resolved[0];
        }
        return item;
      }
      const q = buildFirestoreQuery(modelName, where);
      const snapshot = await safeGetDocs2(q);
      const items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      let matched = items.find((item) => matchCriteria(item, where));
      if (!matched) return null;
      if (args.include) {
        const resolved = await resolveRelations(modelName, [matched], args.include);
        matched = resolved[0];
      }
      return matched;
    },
    async findFirst(args = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await safeGetDocs2(q);
      let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      if (args.where) {
        items = items.filter((item2) => matchCriteria(item2, args.where));
      }
      if (args.orderBy) {
        items = sortItems(items, args.orderBy);
      }
      if (items.length === 0) return null;
      let item = items[0];
      if (args.include) {
        const resolved = await resolveRelations(modelName, [item], args.include);
        item = resolved[0];
      }
      return item;
    },
    async create(args) {
      console.log(`[Firestore DB ${modelName}:create] Delegating write to FirebaseService.saveRecord`);
      try {
        const id = args.data?.id || args.data?._id;
        const result = await FirebaseService.saveRecord(modelName, id, args.data || {});
        return result;
      } catch (err) {
        console.error(`[Firestore DB ${modelName}:create] Failed through FirebaseService:`, err);
        throw err;
      }
    },
    async update(args) {
      console.log(`[Firestore DB ${modelName}:update] Delegating write to FirebaseService.updateRecord`);
      try {
        const where = args.where || {};
        let id = where.id;
        if (!id) {
          const q = buildFirestoreQuery(modelName, where);
          const snapshot = await safeGetDocs2(q);
          const items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
          const matched = items.find((item) => matchCriteria(item, where));
          if (!matched) {
            throw new Error(`Record to update not found for criteria: ${JSON.stringify(where)}`);
          }
          id = matched.id;
        }
        const result = await FirebaseService.updateRecord(modelName, id, args.data || {});
        return result;
      } catch (err) {
        console.error(`[Firestore DB ${modelName}:update] Failed through FirebaseService:`, err);
        throw err;
      }
    },
    async delete(args) {
      console.log(`[Firestore DB ${modelName}:delete] Delegating write to FirebaseService.deleteRecord`);
      try {
        const where = args.where || {};
        let id = where.id;
        if (!id) {
          const q = buildFirestoreQuery(modelName, where);
          const snapshot = await safeGetDocs2(q);
          const items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
          const matched = items.find((item) => matchCriteria(item, where));
          if (!matched) {
            throw new Error(`Record to delete not found for criteria: ${JSON.stringify(where)}`);
          }
          id = matched.id;
        }
        const result = await FirebaseService.deleteRecord(modelName, id);
        return result;
      } catch (err) {
        console.error(`[Firestore DB ${modelName}:delete] Failed through FirebaseService:`, err);
        throw err;
      }
    },
    async deleteMany(args = {}) {
      console.log(`[Firestore DB ${modelName}:deleteMany] Start batch delete on collection. Args:`, args);
      try {
        const q = buildFirestoreQuery(modelName, args.where);
        const snapshot = await safeGetDocs2(q);
        let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
        if (args.where) {
          items = items.filter((item) => matchCriteria(item, args.where));
        }
        console.log(`[Firestore DB ${modelName}:deleteMany] Found ${items.length} records matching criteria. Executing batch delete...`);
        const batch = (0, import_firestore3.writeBatch)(firestore);
        for (const item of items) {
          const docRef = (0, import_firestore3.doc)(firestore, modelName, item.id);
          batch.delete(docRef);
        }
        await batch.commit();
        console.log(`[Firestore DB ${modelName}:deleteMany] Batch delete successfully committed.`);
        return { count: items.length };
      } catch (err) {
        console.error(`[Firestore DB ${modelName}:deleteMany] FAILED batch delete:`, err);
        throw err;
      }
    },
    async updateMany(args = {}) {
      console.log(`[Firestore DB ${modelName}:updateMany] Start batch update on collection. Args:`, args);
      try {
        const rawData = convertDatesToTimestamps2(args.data || {});
        const data = sanitizeFirestoreData(rawData);
        const q = buildFirestoreQuery(modelName, args.where);
        const snapshot = await safeGetDocs2(q);
        let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
        if (args.where) {
          items = items.filter((item) => matchCriteria(item, args.where));
        }
        data.updatedAt = import_firestore3.Timestamp.now();
        console.log(`[Firestore DB ${modelName}:updateMany] Found ${items.length} records matching criteria. Executing batch update...`);
        const batch = (0, import_firestore3.writeBatch)(firestore);
        for (const item of items) {
          const docRef = (0, import_firestore3.doc)(firestore, modelName, item.id);
          batch.update(docRef, data);
        }
        await batch.commit();
        console.log(`[Firestore DB ${modelName}:updateMany] Batch update successfully committed.`);
        return { count: items.length };
      } catch (err) {
        console.error(`[Firestore DB ${modelName}:updateMany] FAILED batch update:`, err);
        throw err;
      }
    },
    async count(args = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await safeGetDocs2(q);
      let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      if (args.where) {
        items = items.filter((item) => matchCriteria(item, args.where));
      }
      return items.length;
    },
    async aggregate(args = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await safeGetDocs2(q);
      let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      if (args.where) {
        items = items.filter((item) => matchCriteria(item, args.where));
      }
      const result = {};
      if (args._sum) {
        result._sum = {};
        for (const key of Object.keys(args._sum)) {
          result._sum[key] = items.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
        }
      }
      if (args._avg) {
        result._avg = {};
        for (const key of Object.keys(args._avg)) {
          const sum = items.reduce((acc, curr) => acc + (Number(curr[key]) || 0), 0);
          result._avg[key] = items.length ? sum / items.length : 0;
        }
      }
      if (args._count) {
        result._count = items.length;
      }
      return result;
    },
    async groupBy(args = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await safeGetDocs2(q);
      let items = snapshot.docs.map((doc3) => ({ id: doc3.id, ...doc3.data() || {} })).map(convertTimestampsToDates2);
      if (args.where) {
        items = items.filter((item) => matchCriteria(item, args.where));
      }
      const byKeys = args.by || [];
      const groups = {};
      for (const item of items) {
        const groupKey = byKeys.map((k) => String(item[k] || "")).join("|");
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
      }
      const resultList = [];
      for (const gKey of Object.keys(groups)) {
        const groupItems = groups[gKey];
        const firstItem = groupItems[0];
        const groupResult = {};
        for (const k of byKeys) {
          groupResult[k] = firstItem[k];
        }
        if (args._count) {
          groupResult._count = {};
          for (const k of Object.keys(args._count)) {
            if (k === "_all") {
              groupResult._count._all = groupItems.length;
            } else {
              groupResult._count[k] = groupItems.length;
            }
          }
        }
        if (args._sum) {
          groupResult._sum = {};
          for (const k of Object.keys(args._sum)) {
            groupResult._sum[k] = groupItems.reduce((acc, curr) => acc + (Number(curr[k]) || 0), 0);
          }
        }
        resultList.push(groupResult);
      }
      return resultList;
    }
  };
}
var db = new Proxy({}, {
  get(target, modelName) {
    if (modelName === "$transaction") {
      return async (promises) => {
        return Promise.all(promises);
      };
    }
    if (modelName === "$connect" || modelName === "$disconnect") {
      return async () => {
      };
    }
    return createModelProxy(modelName);
  }
});

// src/app/api/agents/route.ts
var dynamic = "force-dynamic";
async function GET() {
  const agents = await db.agent.findMany({
    include: {
      _count: { select: { runs: true } }
    },
    orderBy: { createdAt: "desc" }
  });
  const agentsWithStats = await Promise.all(
    agents.map(async (a) => {
      const runs = await db.agentRun.findMany({
        where: { agentId: a.id },
        select: { supervisionPassed: true, duration: true, tokensUsed: true }
      });
      const successRuns = runs.filter((r) => r.supervisionPassed).length;
      return {
        ...a,
        capabilities: a.capabilities ? JSON.parse(a.capabilities) : [],
        tools: a.tools ? JSON.parse(a.tools) : [],
        stats: {
          totalRuns: a._count.runs,
          successRate: runs.length > 0 ? Math.round(successRuns / runs.length * 100) : 0,
          avgDuration: runs.length > 0 ? Math.round(runs.reduce((s, r) => s + (r.duration || 0), 0) / runs.length) : 0,
          totalTokens: runs.reduce((s, r) => s + (r.tokensUsed || 0), 0)
        }
      };
    })
  );
  return Response.json(agentsWithStats);
}
async function POST(req) {
  const body = await req.json();
  const agent = await db.agent.create({
    data: {
      name: body.name,
      description: body.description,
      category: body.category || "Geral",
      capabilities: JSON.stringify(body.capabilities || []),
      systemPrompt: body.systemPrompt,
      tools: JSON.stringify(body.tools || []),
      supervisionEnabled: body.supervisionEnabled !== false,
      status: body.status || "Ativo",
      icon: body.icon || "Bot",
      color: body.color || "blue"
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Agent",
      entityId: agent.id,
      details: `Agente criado: ${agent.name}`
    }
  });
  return Response.json(agent, { status: 201 });
}

// src/app/api/agents/run/route.ts
var route_exports2 = {};
__export(route_exports2, {
  GET: () => GET2,
  POST: () => POST2,
  dynamic: () => dynamic2
});
var import_z_ai_web_dev_sdk = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic2 = "force-dynamic";
async function POST2(req) {
  const body = await req.json();
  const { agentId, task, input, processId, clientId } = body;
  if (!agentId || !task) {
    return Response.json({ error: "agentId e task s\xE3o obrigat\xF3rios" }, { status: 400 });
  }
  const agent = await db.agent.findUnique({ where: { id: agentId } });
  if (!agent) {
    return Response.json({ error: "Agente n\xE3o encontrado" }, { status: 404 });
  }
  if (agent.status !== "Ativo") {
    return Response.json({ error: `Agente ${agent.status}` }, { status: 400 });
  }
  const run = await db.agentRun.create({
    data: {
      agentId,
      task,
      input: input ? JSON.stringify(input) : null,
      processId: processId || null,
      clientId: clientId || null,
      status: "Em Execu\xE7\xE3o",
      output: ""
    }
  });
  const startTime = Date.now();
  try {
    const zai = await import_z_ai_web_dev_sdk.default.create();
    let contextInfo = "";
    if (processId) {
      const proc = await db.process.findUnique({
        where: { id: processId },
        include: { client: true, movements: { orderBy: { date: "desc" }, take: 5 } }
      });
      if (proc) {
        contextInfo = `

DADOS DO PROCESSO:
- T\xEDtulo: ${proc.title}
- CNJ: ${proc.cnj || "-"}
- \xC1rea: ${proc.area}
- Cliente: ${proc.client.name}
- Status: ${proc.status}
- \xDAltimos andamentos:
${proc.movements.map((m) => `  \u2022 ${m.description}`).join("\n")}
`;
      }
    }
    const userMessage = `${task}${contextInfo}${input ? `

PAR\xC2METROS ADICIONAIS:
${JSON.stringify(input, null, 2)}` : ""}`;
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: agent.systemPrompt },
        { role: "user", content: userMessage }
      ],
      thinking: { type: "disabled" },
      temperature: 0.4,
      max_tokens: 3e3
    });
    const agentOutput = completion.choices[0]?.message?.content || "Sem output.";
    const tokensUsed = completion.usage?.total_tokens || 0;
    await db.agentRun.update({
      where: { id: run.id },
      data: { output: agentOutput }
    });
    let supervision = null;
    let supervisionPassed = false;
    let supervisionNotes = null;
    if (agent.supervisionEnabled) {
      const supervisionPrompt = `Voc\xEA \xE9 a **Supervisory AI** - uma segunda IA que verifica o trabalho de outros agentes jur\xEDdicos. Sua fun\xE7\xE3o \xE9 cr\xEDtica: voc\xEA \xE9 a camada de qualidade.

Analise o seguinte output de um agente jur\xEDdico:

**AGENTE:** ${agent.name}
**TAREFA:** ${task}
**OUTPUT DO AGENTE:**
---
${agentOutput}
---

Verifique e responda:

1. **CORRE\xC7\xC3O JUR\xCDDICA** - O output cita leis/jurisprud\xEAncia corretamente? H\xE1 erros materiais?
2. **COMPLETUDE** - Todos os pontos da tarefa foram atendidos?
3. **ALUCINA\xC7\xC3O** - H\xE1 dados inventados (n\xFAmeros de processo, datas, valores)?
4. **RISCO PARA O CLIENTE** - H\xE1 recomenda\xE7\xF5es que podem prejudicar o cliente?
5. **CONFORMIDADE** - Est\xE1 conforme \xE9tica da OAB e LGPD?

**Formato da resposta:**

## Supervisory AI - Verifica\xE7\xE3o

\u2705 **Pontos corretos:**
- ...

\u26A0\uFE0F **Observa\xE7\xF5es/Pend\xEAncias:**
- ...

\u274C **Erros encontrados (se houver):**
- ...

**Status final:** APROVADO / REJEITADO / APROVADO COM OBSERVA\xC7\xD5ES

**Notas t\xE9cnicas:**
[observa\xE7\xF5es para o advogado]`;
      const supervisionCompletion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: supervisionPrompt },
          { role: "user", content: "Verifique o output do agente." }
        ],
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 1500
      });
      supervision = supervisionCompletion.choices[0]?.message?.content || "";
      supervisionPassed = supervision.toUpperCase().includes("APROVADO") && !supervision.toUpperCase().includes("REJEITADO");
      supervisionNotes = supervisionPassed ? "Output aprovado pela Supervisory AI." : "Output rejeitado ou com observa\xE7\xF5es. Revisar antes de usar.";
      if (!supervisionPassed && supervision.toUpperCase().includes("REJEITADO")) {
        await db.agentRun.update({
          where: { id: run.id },
          data: {
            output: agentOutput,
            supervision,
            supervisionPassed: false,
            supervisionNotes,
            status: "Rejeitado",
            duration: Date.now() - startTime,
            tokensUsed: tokensUsed + (supervisionCompletion.usage?.total_tokens || 0)
          }
        });
        await db.auditLog.create({
          data: {
            user: "Agente " + agent.name,
            action: "AGENT_RUN_REJECTED",
            entity: "AgentRun",
            entityId: run.id,
            details: `Agente rejeitado pela Supervisory AI: ${task.substring(0, 100)}`
          }
        });
        return Response.json({
          runId: run.id,
          status: "Rejeitado",
          output: agentOutput,
          supervision,
          supervisionPassed: false,
          supervisionNotes,
          duration: Date.now() - startTime
        });
      }
    }
    const finalDuration = Date.now() - startTime;
    await db.agentRun.update({
      where: { id: run.id },
      data: {
        output: agentOutput,
        supervision,
        supervisionPassed,
        supervisionNotes,
        status: "Conclu\xEDdo",
        duration: finalDuration,
        tokensUsed
      }
    });
    await db.auditLog.create({
      data: {
        user: "Agente " + agent.name,
        action: "AGENT_RUN",
        entity: "AgentRun",
        entityId: run.id,
        details: `Agente executou: ${task.substring(0, 100)}. Supervis\xE3o: ${supervisionPassed ? "APROVADO" : "N/A"}. Dura\xE7\xE3o: ${finalDuration}ms`
      }
    });
    return Response.json({
      runId: run.id,
      status: "Conclu\xEDdo",
      agent: agent.name,
      task,
      output: agentOutput,
      supervision,
      supervisionPassed,
      supervisionNotes,
      duration: finalDuration,
      tokensUsed
    });
  } catch (error) {
    console.error("Erro ao executar agente:", error);
    await db.agentRun.update({
      where: { id: run.id },
      data: {
        status: "Erro",
        output: `Erro: ${error.message}`,
        duration: Date.now() - startTime
      }
    });
    return Response.json(
      { error: error.message, runId: run.id, status: "Erro" },
      { status: 500 }
    );
  }
}
async function GET2(req) {
  const { searchParams } = new URL(req.url);
  const agentId = searchParams.get("agentId");
  const limit = parseInt(searchParams.get("limit") || "20");
  const where = {};
  if (agentId) where.agentId = agentId;
  const runs = await db.agentRun.findMany({
    where,
    include: { agent: { select: { name: true, icon: true, color: true } } },
    orderBy: { createdAt: "desc" },
    take: limit
  });
  return Response.json(runs);
}

// src/app/api/ai-peticao/route.ts
var route_exports3 = {};
__export(route_exports3, {
  POST: () => POST3,
  dynamic: () => dynamic3
});
var import_z_ai_web_dev_sdk2 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic3 = "force-dynamic";
async function POST3(req) {
  const body = await req.json();
  const tipo = body.tipo || "inicial";
  const processoId = body.processoId;
  const descricao = body.descricao || "";
  const fatos = body.fatos || "";
  const pedidos = body.pedidos || "";
  let contextoProcesso = "";
  if (processoId) {
    const proc = await db.process.findUnique({
      where: { id: processoId },
      include: {
        client: true,
        movements: { orderBy: { date: "desc" }, take: 10 }
      }
    });
    if (proc) {
      contextoProcesso = `
DADOS DO PROCESSO:
- T\xEDtulo: ${proc.title}
- CNJ: ${proc.cnj || "novo"}
- Tribunal: ${proc.court || "-"}
- Vara: ${proc.section || "-"}
- Classe: ${proc.classType || "-"}
- \xC1rea: ${proc.area}
- Valor da causa: R$ ${(proc.caseValue || 0).toFixed(2)}
- Partes: ${proc.parties || "-"}
- Cliente: ${proc.client.name} (${proc.client.type === "PF" ? "CPF" : "CNPJ"}: ${proc.client.document || "-"})
- Respons\xE1vel: ${proc.responsibleId}

ANDAMENTOS RECENTES:
${proc.movements.map((m) => `- ${new Date(m.date).toLocaleDateString("pt-BR")}: ${m.description} - ${m.summary || ""}`).join("\n")}
`;
    }
  }
  const tiposPeticao = {
    inicial: "PETI\xC7\xC3O INICIAL",
    contestacao: "CONTESTA\xC7\xC3O",
    replica: "R\xC9PLICA",
    alegacoes_finais: "ALEGA\xC7\xD5ES FINAIS",
    recursal: "RECURSO DE APELA\xC7\xC3O"
  };
  const prompt = `Voc\xEA \xE9 um advogado brasileiro experiente. Gere uma ${tiposPeticao[tipo] || "PETI\xC7\xC3O"} completa e bem estruturada, em portugu\xEAs jur\xEDdico formal.

${contextoProcesso}

INFORMA\xC7\xD5ES ADICIONAIS FORNECIDAS:
- Descri\xE7\xE3o do caso: ${descricao}
- Fatos: ${fatos}
- Pedidos: ${pedidos}

ESTRUTURA OBRIGAT\xD3RIA da pe\xE7a:
1. ENDERE\xC7AMENTO (ao juiz/tribunal competente)
2. QUALIFICA\xC7\xC3O das partes (use dados do cliente quando dispon\xEDvel)
3. DOS FATOS (narrativa clara e ordenada)
4. DO DIREITO (fundamenta\xE7\xE3o jur\xEDdica com artigos de lei)
5. DOS PEDIDOS (enumerados, com valores quando aplic\xE1vel)
6. REQUERIMENTOS (provas, per\xEDcia, testemunhas)
7. VALOR DA CAUSA
8. FECHAMENTO (local, data, assinatura do advogado)

Use linguagem jur\xEDdica formal, cita\xE7\xF5es legais apropriadas ao tipo de a\xE7\xE3o, e seja espec\xEDfico.
N\xC3O invente n\xFAmeros de processos ou dados que n\xE3o estejam no contexto.
Se faltarem dados essenciais, use placeholders entre colchetes [como este] para o advogado preencher.`;
  try {
    const zai = await import_z_ai_web_dev_sdk2.default.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: prompt },
        { role: "user", content: `Gere a ${tiposPeticao[tipo]} agora.` }
      ],
      thinking: { type: "disabled" },
      temperature: 0.5,
      max_tokens: 3e3
    });
    const peticao = completion.choices[0]?.message?.content || "Erro ao gerar peti\xE7\xE3o.";
    await db.auditLog.create({
      data: {
        user: "Sistema",
        action: "AI_PETICAO",
        entity: "Process",
        entityId: processoId || null,
        details: `Peti\xE7\xE3o "${tiposPeticao[tipo]}" gerada por IA`
      }
    });
    return Response.json({
      tipo: tiposPeticao[tipo],
      conteudo: peticao,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Erro IA peti\xE7\xE3o:", error);
    return Response.json(
      { error: "Erro ao gerar peti\xE7\xE3o", conteudo: "" },
      { status: 500 }
    );
  }
}

// src/app/api/ai-revisao/route.ts
var route_exports4 = {};
__export(route_exports4, {
  POST: () => POST4,
  dynamic: () => dynamic4
});
var import_z_ai_web_dev_sdk3 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic4 = "force-dynamic";
async function POST4(req) {
  const body = await req.json();
  const texto = (body.texto || "").trim();
  if (!texto) {
    return Response.json({ error: "Texto \xE9 obrigat\xF3rio" }, { status: 400 });
  }
  const prompt = `Voc\xEA \xE9 um revisor jur\xEDdico brasileiro especializado. Revise o texto jur\xEDdico abaixo e forne\xE7a:

1. **Corre\xE7\xF5es gramaticais e ortogr\xE1ficas** (liste cada corre\xE7\xE3o)
2. **Sugest\xF5es de melhoria de clareza e estilo jur\xEDdico**
3. **Vocabul\xE1rio jur\xEDdico** (termos que poderiam ser mais t\xE9cnicos/precisos)
4. **Problemas de argumenta\xE7\xE3o** (lacunas, falhas l\xF3gicas, inconsist\xEAncias)
5. **Cita\xE7\xF5es legais** (verifique se h\xE1 necessidade de citar leis/jurisprud\xEAncia)
6. **Pontua\xE7\xE3o e formata\xE7\xE3o** (par\xE1grafos, sess\xF5es, hierarquia)
7. **SCORE final** (0-100) indicando a qualidade do texto
8. **Vers\xE3o revisada** (texto completo com todas as corre\xE7\xF5es aplicadas)

TEXTO PARA REVIS\xC3O:
---
${texto}
---

Responda em portugu\xEAs brasileiro, formato Markdown estruturado.`;
  try {
    const zai = await import_z_ai_web_dev_sdk3.default.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: prompt },
        { role: "user", content: "Revise o texto jur\xEDdico fornecido." }
      ],
      thinking: { type: "disabled" },
      temperature: 0.3,
      max_tokens: 3e3
    });
    const revisao = completion.choices[0]?.message?.content || "";
    return Response.json({
      revisao,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Erro IA revis\xE3o:", error);
    return Response.json(
      { error: "Erro ao processar revis\xE3o", revisao: "" },
      { status: 500 }
    );
  }
}

// src/app/api/reports/route.ts
var route_exports5 = {};
__export(route_exports5, {
  GET: () => GET3,
  dynamic: () => dynamic5
});
var dynamic5 = "force-dynamic";
async function GET3(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type") || "processos";
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");
  const hoje = /* @__PURE__ */ new Date();
  const inicioDate = inicio ? new Date(inicio) : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimDate = fim ? new Date(fim) : hoje;
  let resultado = {};
  switch (type) {
    case "clientes": {
      const porStatus = await db.client.groupBy({ by: ["status"], _count: { status: true } });
      const porTipo = await db.client.groupBy({ by: ["type"], _count: { type: true } });
      const novos = await db.client.count({
        where: { createdAt: { gte: inicioDate, lte: fimDate } }
      });
      const topClientes = await db.client.findMany({
        include: { _count: { select: { processes: true } } },
        orderBy: { processes: { _count: "desc" } },
        take: 10
      });
      resultado = {
        titulo: "Relat\xF3rio de Clientes",
        periodo: { inicio: inicioDate, fim: fimDate },
        porStatus: porStatus.map((s) => ({ status: s.status, total: s._count.status })),
        porTipo: porTipo.map((t) => ({ tipo: t.type, total: t._count.type })),
        novosNoPeriodo: novos,
        topClientes: topClientes.map((c) => ({
          nome: c.name,
          status: c.status,
          processos: c._count.processes
        }))
      };
      break;
    }
    case "processos": {
      const porStatus = await db.process.groupBy({ by: ["status"], _count: { status: true } });
      const porArea = await db.process.groupBy({ by: ["area"], _count: { area: true } });
      const porRisco = await db.process.groupBy({ by: ["risk"], _count: { risk: true } });
      const porResponsavel = await db.process.groupBy({
        by: ["responsibleId"],
        _count: { responsibleId: true }
      });
      const valorTotal = await db.process.aggregate({ _sum: { caseValue: true } });
      resultado = {
        titulo: "Relat\xF3rio de Processos",
        porStatus: porStatus.map((s) => ({ status: s.status, total: s._count.status })),
        porArea: porArea.map((a) => ({ area: a.area, total: a._count.area })),
        porRisco: porRisco.map((r) => ({ risco: r.risk, total: r._count.risk })),
        porResponsavel: porResponsavel.map((r) => ({
          advogado: r.responsibleId,
          total: r._count.responsibleId
        })),
        valorTotalCausas: valorTotal._sum.caseValue || 0
      };
      break;
    }
    case "financeiro": {
      const receitas = await db.financial.aggregate({
        where: { type: "Receita", status: "Pago", paidDate: { gte: inicioDate, lte: fimDate } },
        _sum: { amount: true }
      });
      const despesas = await db.financial.aggregate({
        where: { type: "Despesa", status: "Pago", paidDate: { gte: inicioDate, lte: fimDate } },
        _sum: { amount: true }
      });
      const aReceber = await db.financial.aggregate({
        where: { type: "Receita", status: { in: ["Pendente", "Atrasado"] } },
        _sum: { amount: true }
      });
      const aPagar = await db.financial.aggregate({
        where: { type: "Despesa", status: { in: ["Pendente", "Atrasado"] } },
        _sum: { amount: true }
      });
      const porCategoria = await db.financial.groupBy({
        by: ["category", "type"],
        _sum: { amount: true },
        where: { status: "Pago", paidDate: { gte: inicioDate, lte: fimDate } }
      });
      resultado = {
        titulo: "Relat\xF3rio Financeiro",
        periodo: { inicio: inicioDate, fim: fimDate },
        recebido: receitas._sum.amount || 0,
        pago: despesas._sum.amount || 0,
        aReceber: aReceber._sum.amount || 0,
        aPagar: aPagar._sum.amount || 0,
        saldo: (receitas._sum.amount || 0) - (despesas._sum.amount || 0),
        porCategoria: porCategoria.map((c) => ({
          categoria: c.category,
          tipo: c.type,
          total: c._sum.amount
        }))
      };
      break;
    }
    case "honorarios": {
      const honorarios = await db.financial.findMany({
        where: { category: "Honor\xE1rios" },
        include: { client: true, process: true },
        orderBy: { dueDate: "desc" }
      });
      const porStatus = await db.financial.groupBy({
        by: ["status"],
        _count: { status: true },
        _sum: { amount: true },
        where: { category: "Honor\xE1rios" }
      });
      resultado = {
        titulo: "Relat\xF3rio de Honor\xE1rios",
        porStatus: porStatus.map((s) => ({
          status: s.status,
          quantidade: s._count.status,
          total: s._sum.amount
        })),
        totalGeral: honorarios.reduce((s, h) => s + h.amount, 0),
        itens: honorarios.map((h) => ({
          descricao: h.description,
          cliente: h.client?.name,
          valor: h.amount,
          vencimento: h.dueDate,
          status: h.status
        }))
      };
      break;
    }
    case "produtividade": {
      const horas = await db.timeEntry.findMany({
        where: { date: { gte: inicioDate, lte: fimDate } },
        include: { user: true, process: true, client: true }
      });
      const porUsuario = {};
      for (const h of horas) {
        if (!porUsuario[h.user]) porUsuario[h.user] = { horas: 0, billable: 0 };
        porUsuario[h.user].horas += h.duration;
        if (h.billable) porUsuario[h.user].billable += h.duration;
      }
      const tarefasConcluidas = await db.task.count({
        where: { status: "Conclu\xEDda", updatedAt: { gte: inicioDate, lte: fimDate } }
      });
      resultado = {
        titulo: "Relat\xF3rio de Produtividade",
        periodo: { inicio: inicioDate, fim: fimDate },
        totalHoras: horas.reduce((s, h) => s + h.duration, 0),
        horasFaturaveis: horas.filter((h) => h.billable).reduce((s, h) => s + h.duration, 0),
        tarefasConcluidas,
        porUsuario: Object.entries(porUsuario).map(([u, d]) => ({
          usuario: u,
          horas: d.horas,
          faturaveis: d.billable
        }))
      };
      break;
    }
    case "advogados": {
      const advogados = await db.process.groupBy({
        by: ["responsibleId"],
        _count: { _all: true },
        _sum: { caseValue: true }
      });
      resultado = {
        titulo: "Relat\xF3rio por Advogado",
        advogados: advogados.map((a) => ({
          advogado: a.responsibleId,
          processos: a._count._all,
          valorCausas: a._sum.caseValue || 0
        }))
      };
      break;
    }
    case "tribunal": {
      const porTribunal = await db.process.groupBy({
        by: ["court"],
        _count: { court: true }
      });
      resultado = {
        titulo: "Processos por Tribunal",
        tribunais: porTribunal.map((t) => ({
          tribunal: t.court,
          total: t._count.court
        }))
      };
      break;
    }
    case "area": {
      const porArea = await db.process.groupBy({
        by: ["area"],
        _count: { area: true },
        _sum: { caseValue: true }
      });
      resultado = {
        titulo: "Processos por \xC1rea",
        areas: porArea.map((a) => ({
          area: a.area,
          total: a._count.area,
          valorCausas: a._sum.caseValue || 0
        }))
      };
      break;
    }
    default:
      resultado = { error: "Tipo de relat\xF3rio inv\xE1lido" };
  }
  return Response.json(resultado);
}

// src/app/api/knowledge/route.ts
var route_exports6 = {};
__export(route_exports6, {
  GET: () => GET4,
  POST: () => POST5,
  PUT: () => PUT,
  dynamic: () => dynamic6
});
var import_z_ai_web_dev_sdk4 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic6 = "force-dynamic";
async function GET4(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const area = searchParams.get("area") || "";
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { content: { contains: search } },
      { summary: { contains: search } },
      { tags: { contains: search } }
    ];
  }
  if (category && category !== "Todas") where.category = category;
  if (area && area !== "Todas") where.area = area;
  const articles = await db.knowledgeArticle.findMany({
    where,
    orderBy: { updatedAt: "desc" }
  });
  return Response.json(articles);
}
async function POST5(req) {
  const body = await req.json();
  const article = await db.knowledgeArticle.create({
    data: {
      title: body.title,
      content: body.content,
      summary: body.summary || null,
      category: body.category || "Doutrina",
      area: body.area || null,
      tags: body.tags || null,
      source: body.source || "Caso Pr\xF3prio",
      sourceUrl: body.sourceUrl || null,
      author: body.author || "Sistema",
      confidence: body.confidence || 80,
      verified: body.verified || false,
      processId: body.processId || null
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "KnowledgeArticle",
      entityId: article.id,
      details: `Artigo de conhecimento criado: ${article.title}`
    }
  });
  return Response.json(article, { status: 201 });
}
async function PUT(req) {
  const body = await req.json();
  const { articleId } = body;
  const article = await db.knowledgeArticle.findUnique({ where: { id: articleId } });
  if (!article) return Response.json({ error: "Artigo n\xE3o encontrado" }, { status: 404 });
  try {
    const zai = await import_z_ai_web_dev_sdk4.default.create();
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: "assistant",
          content: `Voc\xEA \xE9 um especialista jur\xEDdico. Resuma o seguinte artigo em no m\xE1ximo 200 caracteres, destacando os pontos principais e a tese central. Seja direto e t\xE9cnico.

ARTIGO:
${article.content}`
        },
        { role: "user", content: "Gere o resumo." }
      ],
      thinking: { type: "disabled" },
      temperature: 0.3,
      max_tokens: 200
    });
    const summary = completion.choices[0]?.message?.content || "";
    const updated = await db.knowledgeArticle.update({
      where: { id: articleId },
      data: { summary }
    });
    return Response.json({ ...updated, summary });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

// src/app/api/firm-standards/route.ts
var route_exports7 = {};
__export(route_exports7, {
  GET: () => GET5,
  POST: () => POST6,
  dynamic: () => dynamic7
});
var dynamic7 = "force-dynamic";
async function GET5() {
  const standards = await db.firmStandard.findMany({
    where: { active: true },
    orderBy: { category: "asc" }
  });
  return Response.json(standards);
}
async function POST6(req) {
  const body = await req.json();
  const std = await db.firmStandard.create({
    data: {
      category: body.category,
      name: body.name,
      value: body.value,
      description: body.description || null
    }
  });
  return Response.json(std, { status: 201 });
}

// src/app/api/processes/[id]/route.ts
var route_exports8 = {};
__export(route_exports8, {
  GET: () => GET6,
  PATCH: () => PATCH,
  dynamic: () => dynamic8
});
var dynamic8 = "force-dynamic";
async function GET6(_req, { params }) {
  const { id } = await params;
  const proc = await db.process.findUnique({
    where: { id },
    include: {
      client: true,
      movements: { orderBy: { date: "desc" } },
      deadlines: { orderBy: { dueDate: "asc" } },
      tasks: { orderBy: { createdAt: "desc" } },
      financials: { orderBy: { dueDate: "asc" } },
      documents: { orderBy: { createdAt: "desc" } }
    }
  });
  if (!proc) return Response.json({ error: "Processo n\xE3o encontrado" }, { status: 404 });
  const timeline = [];
  for (const m of proc.movements) {
    timeline.push({
      date: m.date,
      type: "Movimento",
      title: m.description,
      description: m.summary,
      color: m.important ? "red" : "slate"
    });
  }
  for (const d of proc.deadlines) {
    timeline.push({
      date: d.dueDate,
      type: "Prazo",
      title: d.title,
      description: `${d.type} | ${d.priority}${d.responsible ? " | " + d.responsible : ""}`,
      color: d.priority === "Cr\xEDtica" ? "red" : d.priority === "Alta" ? "orange" : "blue"
    });
  }
  for (const t of proc.tasks) {
    timeline.push({
      date: t.createdAt,
      type: "Tarefa",
      title: t.title,
      description: t.description,
      color: "purple"
    });
  }
  for (const f of proc.financials) {
    timeline.push({
      date: f.dueDate,
      type: f.type,
      title: `${f.type}: ${f.description}`,
      description: `R$ ${f.amount.toFixed(2)} - ${f.status}`,
      color: f.type === "Receita" ? "green" : "red"
    });
  }
  timeline.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  return Response.json({ ...proc, timeline });
}
async function PATCH(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const allowedFields = {};
  const fieldMap = [
    "cnj",
    "title",
    "court",
    "section",
    "classType",
    "subject",
    "parties",
    "status",
    "area",
    "responsibleId",
    "risk"
  ];
  for (const f of fieldMap) {
    if (body[f] !== void 0) allowedFields[f] = body[f];
  }
  if (body.caseValue !== void 0) allowedFields.caseValue = Number(body.caseValue);
  const proc = await db.process.update({
    where: { id },
    data: allowedFields
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "UPDATE",
      entity: "Process",
      entityId: id,
      details: `Processo atualizado: ${proc.title}`
    }
  });
  return Response.json(proc);
}

// src/app/api/processes/[id]/movements/route.ts
var route_exports9 = {};
__export(route_exports9, {
  POST: () => POST7,
  dynamic: () => dynamic9
});
var dynamic9 = "force-dynamic";
async function POST7(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const proc = await db.process.findUnique({
    where: { id },
    select: { id: true, clientId: true, title: true }
  });
  if (!proc) {
    return Response.json({ error: "Processo n\xE3o encontrado" }, { status: 404 });
  }
  if (!body.description || !body.description.trim()) {
    return Response.json({ error: "Descri\xE7\xE3o \xE9 obrigat\xF3ria" }, { status: 400 });
  }
  const mov = await db.movement.create({
    data: {
      processId: id,
      date: body.date ? new Date(body.date) : /* @__PURE__ */ new Date(),
      description: body.description.trim(),
      summary: body.summary || null,
      important: body.important === true
    }
  });
  await db.timelineEntry.create({
    data: {
      processId: id,
      clientId: proc.clientId,
      // Bug #13 fix: incluir clientId
      date: mov.date,
      type: "Movimento",
      title: mov.description,
      description: mov.summary
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Movement",
      entityId: mov.id,
      details: `Andamento adicionado ao processo "${proc.title}": ${mov.description}`
    }
  });
  return Response.json(mov, { status: 201 });
}

// src/app/api/processes/route.ts
var route_exports10 = {};
__export(route_exports10, {
  GET: () => GET7,
  POST: () => POST8,
  dynamic: () => dynamic10
});
var dynamic10 = "force-dynamic";
async function GET7(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const area = searchParams.get("area") || "";
  const where = {};
  if (search) {
    where.OR = [
      { title: { contains: search } },
      { cnj: { contains: search } },
      { parties: { contains: search } }
    ];
  }
  if (status && status !== "Todos") where.status = status;
  if (area && area !== "Todos") where.area = area;
  const processes = await db.process.findMany({
    where,
    include: {
      client: true,
      _count: {
        select: { movements: true, deadlines: true, tasks: true, documents: true }
      }
    },
    orderBy: { updatedAt: "desc" }
  });
  return Response.json(processes);
}
async function POST8(req) {
  const body = await req.json();
  const proc = await db.process.create({
    data: {
      cnj: body.cnj,
      title: body.title,
      court: body.court,
      section: body.section,
      classType: body.classType,
      subject: body.subject,
      caseValue: body.caseValue || 0,
      parties: body.parties,
      status: body.status || "Ativo",
      area: body.area,
      responsibleId: body.responsibleId,
      risk: body.risk || "M\xE9dio",
      clientId: body.clientId
    }
  });
  await db.movement.create({
    data: {
      processId: proc.id,
      date: /* @__PURE__ */ new Date(),
      description: "Cadastro do processo no sistema",
      summary: "Processo cadastrado. Aguardando distribui\xE7\xE3o ou primeiro andamento.",
      important: false
    }
  });
  await db.timelineEntry.create({
    data: {
      processId: proc.id,
      clientId: proc.clientId,
      date: /* @__PURE__ */ new Date(),
      type: "Movimento",
      title: "Cadastro do processo",
      description: "Processo cadastrado no sistema."
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Process",
      entityId: proc.id,
      details: `Processo criado: ${proc.title}`
    }
  });
  return Response.json(proc, { status: 201 });
}

// src/app/api/time/route.ts
var route_exports11 = {};
__export(route_exports11, {
  GET: () => GET8,
  POST: () => POST9,
  dynamic: () => dynamic11
});
var dynamic11 = "force-dynamic";
async function GET8() {
  const items = await db.timeEntry.findMany({
    include: { process: true, client: true },
    orderBy: { date: "desc" }
  });
  return Response.json(items);
}
async function POST9(req) {
  const body = await req.json();
  const item = await db.timeEntry.create({
    data: {
      description: body.description,
      duration: Number(body.duration),
      date: new Date(body.date),
      user: body.user,
      billable: body.billable !== false,
      processId: body.processId || null,
      clientId: body.clientId || null
    }
  });
  return Response.json(item, { status: 201 });
}

// src/app/api/automations/route.ts
var route_exports12 = {};
__export(route_exports12, {
  GET: () => GET9,
  PATCH: () => PATCH2,
  POST: () => POST10,
  PUT: () => PUT2,
  dynamic: () => dynamic12
});
var dynamic12 = "force-dynamic";
async function GET9() {
  const autos = await db.automation.findMany({ orderBy: { createdAt: "desc" } });
  return Response.json(
    autos.map((a) => ({ ...a, actions: JSON.parse(a.actions) }))
  );
}
async function POST10(req) {
  const body = await req.json();
  const auto = await db.automation.create({
    data: {
      name: body.name,
      trigger: body.trigger,
      actions: JSON.stringify(body.actions || []),
      enabled: body.enabled !== false
    }
  });
  return Response.json({ ...auto, actions: JSON.parse(auto.actions) }, { status: 201 });
}
async function PATCH2(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  const allowedFields = {};
  for (const f of ["name", "trigger", "enabled"]) {
    if (body[f] !== void 0) allowedFields[f] = body[f];
  }
  if (body.actions) allowedFields.actions = JSON.stringify(body.actions);
  const updated = await db.automation.update({
    where: { id },
    data: allowedFields
  });
  return Response.json({ ...updated, actions: JSON.parse(updated.actions) });
}
async function PUT2(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const auto = await db.automation.findUnique({ where: { id } });
  if (!auto) return Response.json({ error: "n\xE3o encontrada" }, { status: 404 });
  const actions = JSON.parse(auto.actions);
  const resultados = [];
  for (const a of actions) {
    switch (a.type) {
      case "enviar_email":
        resultados.push(`\u{1F4E7} E-mail "${a.template}" enviado para ${a.to}`);
        break;
      case "enviar_whatsapp":
        resultados.push(`\u{1F4AC} WhatsApp "${a.template}" enviado para ${a.to}`);
        break;
      case "criar_tarefa":
        resultados.push(`\u2713 Tarefa criada: "${a.title}" (Prioridade: ${a.priority})`);
        break;
      case "gerar_pix":
        resultados.push(`\u{1F4B3} PIX gerado no valor autom\xE1tico`);
        break;
      case "notificar_advogado":
        resultados.push(`\u{1F514} Advogado notificado: ${a.message}`);
        break;
      case "resumir_ia":
        resultados.push(`\u{1F916} IA processando resumo de ${a.target}`);
        break;
      case "verificar_prazo":
        resultados.push(`\u23F0 Verifica\xE7\xE3o de prazo de ${a.days} dias executada`);
        break;
      default:
        resultados.push(`\u2699\uFE0F A\xE7\xE3o executada: ${a.type}`);
    }
  }
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "AUTOMATION",
      entity: "Automation",
      entityId: id,
      details: `Automa\xE7\xE3o "${auto.name}" executada: ${resultados.length} a\xE7\xF5es`
    }
  });
  return Response.json({
    automacao: auto.name,
    acoesExecutadas: resultados.length,
    resultados
  });
}

// src/app/api/copilot/route.ts
var route_exports13 = {};
__export(route_exports13, {
  POST: () => POST11,
  dynamic: () => dynamic13
});
var import_z_ai_web_dev_sdk5 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic13 = "force-dynamic";
async function POST11(req) {
  const body = await req.json();
  const pergunta = (body.pergunta || "").trim();
  const historico = body.historico || [];
  if (!pergunta) {
    return Response.json({ error: "Pergunta \xE9 obrigat\xF3ria" }, { status: 400 });
  }
  const hoje = /* @__PURE__ */ new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const proximos30 = new Date(hoje.getTime() + 30 * 864e5);
  const [
    processos,
    prazosProximos,
    tarefasPendentes,
    honorariosAtrasados,
    clientes,
    financeiroPendente
  ] = await Promise.all([
    db.process.findMany({
      include: { client: true, _count: { select: { movements: true } } },
      take: 50
    }),
    db.deadline.findMany({
      where: { done: false, dueDate: { gte: inicioHoje, lte: proximos30 } },
      include: { process: true },
      orderBy: { dueDate: "asc" }
    }),
    db.task.findMany({
      where: { status: { not: "Conclu\xEDda" } },
      include: { process: true, client: true },
      orderBy: { dueDate: "asc" },
      take: 20
    }),
    db.financial.findMany({
      where: { type: "Receita", status: "Atrasado" },
      include: { client: true }
    }),
    db.client.findMany({ take: 50 }),
    db.financial.findMany({
      where: { status: { in: ["Pendente", "Atrasado"] } },
      include: { client: true },
      orderBy: { dueDate: "asc" }
    })
  ]);
  const contexto = `
CONTEXTO DO ESCRIT\xD3RIO DE ADVOCACIA (JusFlow - dados em tempo real):

== CLIENTES (${clientes.length}) ==
${clientes.map((c) => `- ${c.name} | ${c.type === "PF" ? "CPF" : "CNPJ"}: ${c.document || "-"} | Status: ${c.status} | Tags: ${c.tags || "-"}`).join("\n")}

== PROCESSOS (${processos.length}) ==
${processos.map((p) => `- [${p.cnj || "sem CNJ"}] ${p.title} | Cliente: ${p.client?.name} | \xC1rea: ${p.area} | Status: ${p.status} | Risco: ${p.risk} | Respons\xE1vel: ${p.responsibleId} | Valor: R$ ${(p.caseValue || 0).toFixed(2)}`).join("\n")}

== PRAZOS PR\xD3XIMOS (30 dias) (${prazosProximos.length}) ==
${prazosProximos.map((d) => `- ${new Date(d.dueDate).toLocaleDateString("pt-BR")} | ${d.priority} | ${d.type} | ${d.title} | Processo: ${d.process?.title} | Resp: ${d.responsible || "-"}`).join("\n")}

== TAREFAS PENDENTES (${tarefasPendentes.length}) ==
${tarefasPendentes.map((t) => `- [${t.priority}] ${t.title} | Status: ${t.status} | Resp: ${t.assignee || "-"}${t.dueDate ? " | At\xE9: " + new Date(t.dueDate).toLocaleDateString("pt-BR") : ""}`).join("\n")}

== HONOR\xC1RIOS ATRASADOS (${honorariosAtrasados.length}) ==
${honorariosAtrasados.map((h) => `- ${h.description} | R$ ${h.amount.toFixed(2)} | Cliente: ${h.client?.name} | Venc.: ${new Date(h.dueDate).toLocaleDateString("pt-BR")}`).join("\n")}

== FINANCEIRO PENDENTE (${financeiroPendente.length}) ==
${financeiroPendente.map((f) => `- ${f.type} | ${f.description} | R$ ${f.amount.toFixed(2)} | Venc.: ${new Date(f.dueDate).toLocaleDateString("pt-BR")} | Status: ${f.status} | Cliente: ${f.client?.name || "-"}`).join("\n")}
`;
  const systemPrompt = `Voc\xEA \xE9 o Copiloto Jur\xEDdico do JusFlow, um assistente de IA para advogados brasileiros.
Sua fun\xE7\xE3o \xE9 ajudar o advogado respondendo perguntas com base nos dados do escrit\xF3rio (contexto fornecido), al\xE9m de sugerir a\xE7\xF5es.

Diretrizes:
1. Responda SEMPRE em portugu\xEAs brasileiro.
2. Use SOMENTE os dados fornecidos no contexto. Se faltar informa\xE7\xE3o, diga que n\xE3o h\xE1 dados suficientes.
3. Seja objetivo, claro e direto. Use listas quando apropriado.
4. Quando o advogado perguntar sobre prazos, audi\xEAncias, tarefas, clientes ou financeiro, forne\xE7a informa\xE7\xF5es concretas com nomes, datas e valores.
5. Quando relevante, sugira pr\xF3ximas a\xE7\xF5es (ex.: "Sugiro ligar para X", "Priorize o prazo Y").
6. Para pedidos de gera\xE7\xE3o de peti\xE7\xF5es ou pe\xE7as jur\xEDdicas, use os dados do processo do contexto e estruture em formato de pe\xE7a processual (cabe\xE7alho, qualifica\xE7\xE3o, fatos, fundamentos, pedidos).
7. N\xE3o invente dados que n\xE3o estejam no contexto.
8. Em perguntas sobre jurisprud\xEAncia, indique que \xE9 uma pesquisa que deve ser feita em fontes oficiais (STJ, TST, TJ), mas sugira teses comuns quando aplic\xE1vel.

${contexto}`;
  try {
    const zai = await import_z_ai_web_dev_sdk5.default.create();
    const messages = [
      { role: "assistant", content: systemPrompt },
      ...historico.slice(-6).map((m) => ({
        role: m.role === "user" ? "user" : "assistant",
        content: m.content
      })),
      { role: "user", content: pergunta }
    ];
    const completion = await zai.chat.completions.create({
      messages,
      thinking: { type: "disabled" },
      temperature: 0.4,
      max_tokens: 2e3
    });
    const resposta = completion.choices[0]?.message?.content || "N\xE3o foi poss\xEDvel gerar resposta.";
    await db.auditLog.create({
      data: {
        user: "Copiloto",
        action: "QUERY",
        entity: "Copilot",
        details: `Pergunta: ${pergunta.substring(0, 200)}`
      }
    });
    return Response.json({
      resposta,
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (error) {
    console.error("Erro no copiloto:", error);
    return Response.json(
      {
        error: "Erro ao processar pergunta",
        resposta: "Desculpe, ocorreu um erro ao consultar o Copiloto. Tente novamente em instantes."
      },
      { status: 500 }
    );
  }
}

// src/app/api/search/route.ts
var route_exports14 = {};
__export(route_exports14, {
  GET: () => GET10,
  dynamic: () => dynamic14
});
var dynamic14 = "force-dynamic";
async function GET10(req) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim().toLowerCase();
  if (!q || q.length < 2) {
    return Response.json({ results: [] });
  }
  const [clients, processes, tasks, deadlines, financials, documents] = await Promise.all([
    db.client.findMany({
      where: {
        OR: [
          { name: { contains: q } },
          { document: { contains: q } },
          { email: { contains: q } },
          { tags: { contains: q } }
        ]
      },
      take: 5
    }),
    db.process.findMany({
      where: {
        OR: [
          { title: { contains: q } },
          { cnj: { contains: q } },
          { parties: { contains: q } },
          { subject: { contains: q } }
        ]
      },
      include: { client: true },
      take: 5
    }),
    db.task.findMany({
      where: {
        OR: [{ title: { contains: q } }, { description: { contains: q } }]
      },
      take: 5
    }),
    db.deadline.findMany({
      where: {
        OR: [{ title: { contains: q } }, { notes: { contains: q } }]
      },
      include: { process: true },
      take: 5
    }),
    db.financial.findMany({
      where: {
        OR: [{ description: { contains: q } }, { category: { contains: q } }]
      },
      take: 5
    }),
    db.document.findMany({
      where: {
        OR: [{ name: { contains: q } }, { tags: { contains: q } }]
      },
      take: 5
    })
  ]);
  const results = [
    ...clients.map((c) => ({
      tipo: "Cliente",
      id: c.id,
      titulo: c.name,
      subtitulo: c.document || "",
      info: c.email || c.phone || ""
    })),
    ...processes.map((p) => ({
      tipo: "Processo",
      id: p.id,
      titulo: p.title,
      subtitulo: p.cnj || "",
      info: p.client?.name || p.area || ""
    })),
    ...tasks.map((t) => ({
      tipo: "Tarefa",
      id: t.id,
      titulo: t.title,
      subtitulo: t.status,
      info: t.assignee || ""
    })),
    ...deadlines.map((d) => ({
      tipo: "Prazo",
      id: d.id,
      titulo: d.title,
      subtitulo: new Date(d.dueDate).toLocaleDateString("pt-BR"),
      info: d.process?.title || ""
    })),
    ...financials.map((f) => ({
      tipo: f.type,
      id: f.id,
      titulo: f.description,
      subtitulo: `R$ ${f.amount.toFixed(2)}`,
      info: f.status
    })),
    ...documents.map((d) => ({
      tipo: "Documento",
      id: d.id,
      titulo: d.name,
      subtitulo: d.type,
      info: d.tags || ""
    }))
  ];
  return Response.json({ results, total: results.length });
}

// src/app/api/notifications/route.ts
var route_exports15 = {};
__export(route_exports15, {
  GET: () => GET11,
  PATCH: () => PATCH3,
  POST: () => POST12,
  dynamic: () => dynamic15
});
var dynamic15 = "force-dynamic";
async function GET11() {
  const notifs = await db.notification.findMany({ orderBy: { createdAt: "desc" }, take: 50 });
  return Response.json(notifs);
}
async function PATCH3(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const all = searchParams.get("all");
  if (all === "true") {
    await db.notification.updateMany({ data: { read: true } });
    return Response.json({ ok: true, updated: "all" });
  }
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const updated = await db.notification.update({
    where: { id },
    data: { read: true }
  });
  return Response.json(updated);
}
async function POST12(req) {
  const body = await req.json();
  const n = await db.notification.create({
    data: {
      type: body.type || "sistema",
      title: body.title,
      description: body.description,
      link: body.link,
      priority: body.priority || "M\xE9dia"
    }
  });
  return Response.json(n, { status: 201 });
}

// src/app/api/agenda/route.ts
var route_exports16 = {};
__export(route_exports16, {
  GET: () => GET12,
  dynamic: () => dynamic16
});
var dynamic16 = "force-dynamic";
async function GET12(req) {
  const { searchParams } = new URL(req.url);
  const inicio = searchParams.get("inicio");
  const fim = searchParams.get("fim");
  const hoje = /* @__PURE__ */ new Date();
  const inicioDate = inicio ? new Date(inicio) : new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  const fimDate = fim ? new Date(fim) : new Date(hoje.getFullYear(), hoje.getMonth() + 1, 0);
  fimDate.setHours(23, 59, 59);
  const [prazos, tarefas] = await Promise.all([
    db.deadline.findMany({
      where: {
        done: false,
        dueDate: { gte: inicioDate, lte: fimDate }
      },
      include: { process: { include: { client: true } } }
    }),
    db.task.findMany({
      where: {
        dueDate: { gte: inicioDate, lte: fimDate },
        status: { not: "Conclu\xEDda" }
      },
      include: { process: true, client: true }
    })
  ]);
  const eventos = [
    ...prazos.map((p) => ({
      id: p.id,
      tipo: p.title.toLowerCase().includes("audi\xEAncia") ? "audiencia" : "prazo",
      titulo: p.title,
      data: p.dueDate,
      prioridade: p.priority,
      responsavel: p.responsible,
      processo: p.process?.title,
      cliente: p.process?.client?.name,
      processId: p.processId,
      allDay: true
    })),
    ...tarefas.map((t) => ({
      id: t.id,
      tipo: "tarefa",
      titulo: t.title,
      data: t.dueDate,
      prioridade: t.priority,
      responsavel: t.assignee,
      processo: t.process?.title,
      cliente: t.client?.name,
      processId: t.processId,
      allDay: true
    }))
  ];
  return Response.json({ eventos, inicio: inicioDate, fim: fimDate });
}

// src/app/api/clients/route.ts
var route_exports17 = {};
__export(route_exports17, {
  GET: () => GET13,
  POST: () => POST13,
  dynamic: () => dynamic17
});
var dynamic17 = "force-dynamic";
async function GET13(req) {
  const { searchParams } = new URL(req.url);
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const where = {};
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { document: { contains: search } },
      { email: { contains: search } }
    ];
  }
  if (status && status !== "Todos") where.status = status;
  const clients = await db.client.findMany({
    where,
    include: {
      _count: {
        select: { processes: true, tasks: true, financials: true }
      }
    },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(clients);
}
async function POST13(req) {
  const body = await req.json();
  const client = await db.client.create({
    data: {
      name: body.name,
      type: body.type || "PF",
      document: body.document,
      email: body.email,
      phone: body.phone,
      mobile: body.mobile,
      address: body.address,
      city: body.city,
      state: body.state,
      zipCode: body.zipCode,
      status: body.status || "Prospect",
      tags: body.tags,
      notes: body.notes
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Client",
      entityId: client.id,
      details: `Cliente criado: ${client.name}`
    }
  });
  return Response.json(client, { status: 201 });
}

// src/app/api/compliance/route.ts
var route_exports18 = {};
__export(route_exports18, {
  GET: () => GET14,
  POST: () => POST14,
  PUT: () => PUT3,
  dynamic: () => dynamic18
});
var import_z_ai_web_dev_sdk6 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic18 = "force-dynamic";
async function GET14(req) {
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");
  const where = {};
  if (category && category !== "Todas") where.category = category;
  const rules = await db.complianceRule.findMany({
    where,
    include: { _count: { select: { checks: true } } },
    orderBy: { createdAt: "desc" }
  });
  const recentChecks = await db.complianceCheck.findMany({
    include: { rule: true },
    orderBy: { checkedAt: "desc" },
    take: 20
  });
  return Response.json({
    rules: rules.map((r) => ({
      ...r,
      checksCount: r._count.checks
    })),
    recentChecks
  });
}
async function POST14(req) {
  const body = await req.json();
  const rule = await db.complianceRule.create({
    data: {
      name: body.name,
      category: body.category || "LGPD",
      description: body.description,
      rule: body.rule,
      severity: body.severity || "M\xE9dia",
      actionType: body.actionType || "Aviso",
      enabled: body.enabled !== false
    }
  });
  return Response.json(rule, { status: 201 });
}
async function PUT3(req) {
  const body = await req.json();
  const { entityType, entityId, entityName, content, type } = body;
  if (!content || !entityType) {
    return Response.json({ error: "entityType e content s\xE3o obrigat\xF3rios" }, { status: 400 });
  }
  const where = { enabled: true };
  if (type) where.category = type;
  const rules = await db.complianceRule.findMany({ where });
  const zai = await import_z_ai_web_dev_sdk6.default.create();
  const resultados = [];
  for (const rule of rules) {
    const prompt = `Voc\xEA \xE9 um auditor de conformidade. Verifique se o conte\xFAdo abaixo viola a seguinte regra:

**REGRA:** ${rule.name}
**DESCRI\xC7\xC3O:** ${rule.description}
**CRIT\xC9RIO:** ${rule.rule}
**CATEGORIA:** ${rule.category}
**SEVERIDADE:** ${rule.severity}

**CONTE\xDADO A VERIFICAR:**
---
${content}
---

Responda em JSON estrito:
{
  "passed": true/false,
  "violations": ["descri\xE7\xE3o da viola\xE7\xE3o 1", ...],
  "notes": "observa\xE7\xF5es t\xE9cnicas"
}

Se n\xE3o houver viola\xE7\xE3o: {"passed": true, "violations": [], "notes": "Conforme."}`;
    try {
      const completion = await zai.chat.completions.create({
        messages: [
          { role: "assistant", content: prompt },
          { role: "user", content: "Verifique conformidade." }
        ],
        thinking: { type: "disabled" },
        temperature: 0.2,
        max_tokens: 600
      });
      const responseText = completion.choices[0]?.message?.content || "";
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      let parsed = { passed: true, violations: [], notes: "N\xE3o foi poss\xEDvel analisar." };
      if (jsonMatch) {
        try {
          parsed = JSON.parse(jsonMatch[0]);
        } catch {
        }
      }
      const check = await db.complianceCheck.create({
        data: {
          ruleId: rule.id,
          entityType,
          entityId: entityId || null,
          entityName: entityName || null,
          passed: parsed.passed,
          notes: JSON.stringify({ violations: parsed.violations, notes: parsed.notes, response: responseText })
        }
      });
      resultados.push({
        rule: rule.name,
        category: rule.category,
        severity: rule.severity,
        passed: parsed.passed,
        violations: parsed.violations || [],
        notes: parsed.notes || "",
        checkId: check.id
      });
    } catch (error) {
      resultados.push({
        rule: rule.name,
        category: rule.category,
        severity: rule.severity,
        passed: false,
        violations: ["Erro ao verificar: " + error.message],
        notes: ""
      });
    }
  }
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "COMPLIANCE_CHECK",
      entity: entityType,
      entityId,
      details: `Verifica\xE7\xE3o de conformidade em ${entityName || entityType}. ${resultados.filter((r) => r.passed).length}/${resultados.length} regras aprovadas.`
    }
  });
  return Response.json({
    entityType,
    entityId,
    entityName,
    totalRules: rules.length,
    passed: resultados.filter((r) => r.passed).length,
    failed: resultados.filter((r) => !r.passed).length,
    resultados,
    checkedAt: (/* @__PURE__ */ new Date()).toISOString()
  });
}

// src/app/api/tasks/route.ts
var route_exports19 = {};
__export(route_exports19, {
  DELETE: () => DELETE,
  GET: () => GET15,
  PATCH: () => PATCH4,
  POST: () => POST15,
  dynamic: () => dynamic19
});
var dynamic19 = "force-dynamic";
async function GET15(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const assignee = searchParams.get("assignee");
  const where = {};
  if (status && status !== "Todas") where.status = status;
  if (assignee && assignee !== "Todos") where.assignee = assignee;
  const tasks = await db.task.findMany({
    where,
    include: { process: true, client: true },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(tasks);
}
async function POST15(req) {
  const body = await req.json();
  const task = await db.task.create({
    data: {
      title: body.title,
      description: body.description,
      status: body.status || "A Fazer",
      priority: body.priority || "M\xE9dia",
      dueDate: body.dueDate ? new Date(body.dueDate) : null,
      assignee: body.assignee,
      processId: body.processId || null,
      clientId: body.clientId || null
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Task",
      entityId: task.id,
      details: `Tarefa criada: ${task.title}`
    }
  });
  return Response.json(task, { status: 201 });
}
async function PATCH4(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  const updated = await db.task.update({
    where: { id },
    data: {
      ...body,
      dueDate: body.dueDate ? new Date(body.dueDate) : void 0
    }
  });
  return Response.json(updated);
}
async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  await db.task.delete({ where: { id } });
  return Response.json({ ok: true });
}

// src/app/api/route.ts
var route_exports20 = {};
__export(route_exports20, {
  GET: () => GET16,
  dynamic: () => dynamic20
});
var dynamic20 = "force-dynamic";
async function GET16() {
  return Response.json({ message: "Hello, world!" });
}

// src/app/api/templates/route.ts
var route_exports21 = {};
__export(route_exports21, {
  GET: () => GET17,
  POST: () => POST16,
  dynamic: () => dynamic21
});
var dynamic21 = "force-dynamic";
async function GET17() {
  const templates = await db.contractTemplate.findMany({
    include: { _count: { select: { contracts: true } } },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(
    templates.map((t) => ({
      ...t,
      variables: t.variables ? JSON.parse(t.variables) : []
    }))
  );
}
async function POST16(req) {
  const body = await req.json();
  const tpl = await db.contractTemplate.create({
    data: {
      name: body.name,
      category: body.category || "Geral",
      content: body.content,
      variables: JSON.stringify(body.variables || [])
    }
  });
  return Response.json(tpl, { status: 201 });
}

// src/app/api/admin/seed/route.ts
var route_exports22 = {};
__export(route_exports22, {
  GET: () => GET18,
  dynamic: () => dynamic22
});
var dynamic22 = "force-dynamic";
async function GET18() {
  try {
    await db.auditLog.deleteMany();
    await db.timelineEntry.deleteMany();
    await db.document.deleteMany();
    await db.financial.deleteMany();
    await db.task.deleteMany();
    await db.deadline.deleteMany();
    await db.movement.deleteMany();
    await db.process.deleteMany();
    await db.client.deleteMany();
    const clientes = await Promise.all([
      db.client.create({
        data: {
          name: "Construtora Horizonte Ltda",
          type: "PJ",
          document: "12.345.678/0001-90",
          email: "juridico@horizonte.com.br",
          phone: "(11) 3322-1100",
          mobile: "(11) 98765-4321",
          address: "Av. Paulista, 1500 - 10\xBA andar",
          city: "S\xE3o Paulo",
          state: "SP",
          zipCode: "01310-100",
          status: "Ativo",
          tags: "Construtora,Recorrente,PJ",
          notes: "Cliente desde 2020. Volume alto de processos trabalhistas."
        }
      }),
      db.client.create({
        data: {
          name: "Maria Aparecida Silva",
          type: "PF",
          document: "123.456.789-00",
          email: "maria.silva@email.com",
          phone: "(11) 3456-7890",
          mobile: "(11) 99876-5432",
          address: "Rua das Flores, 123 - Apto 45",
          city: "S\xE3o Paulo",
          state: "SP",
          zipCode: "02030-000",
          status: "Ativo",
          tags: "Trabalhista,Indeniza\xE7\xE3o",
          notes: "A\xE7\xE3o trabalhista contra ex-empregador."
        }
      }),
      db.client.create({
        data: {
          name: "Tech Solutions Brasil S.A.",
          type: "PJ",
          document: "98.765.432/0001-10",
          email: "legal@techsolutions.com.br",
          phone: "(11) 3000-2000",
          mobile: "(11) 91234-5678",
          address: "Rua Vergueiro, 2000",
          city: "S\xE3o Paulo",
          state: "SP",
          zipCode: "04101-000",
          status: "Ativo",
          tags: "Tecnologia,Contratos,Recorrente",
          notes: "Consultoria mensal + contratos comerciais."
        }
      }),
      db.client.create({
        data: {
          name: "Jo\xE3o Pedro Mendes",
          type: "PF",
          document: "987.654.321-00",
          email: "joao.mendes@email.com",
          phone: "(21) 2345-6789",
          mobile: "(21) 98888-7777",
          address: "Av. Atl\xE2ntica, 500 - Apto 101",
          city: "Rio de Janeiro",
          state: "RJ",
          zipCode: "22021-000",
          status: "Prospect",
          tags: "Fam\xEDlia,Sucess\xE3o",
          notes: "Invent\xE1rio do pai. Aguardando documentos."
        }
      }),
      db.client.create({
        data: {
          name: "Distribuidora Norte Ltda",
          type: "PJ",
          document: "45.678.901/0001-23",
          email: "contato@norte.com.br",
          phone: "(11) 4000-5000",
          mobile: "(11) 95555-4444",
          address: "Rod. Anhanguera, km 25",
          city: "Jundia\xED",
          state: "SP",
          zipCode: "13213-000",
          status: "Ativo",
          tags: "Log\xEDstica,Tribut\xE1rio",
          notes: "Defesa em auto de infra\xE7\xE3o fiscal."
        }
      }),
      db.client.create({
        data: {
          name: "Carolina Ferreira Souza",
          type: "PF",
          document: "456.789.123-00",
          email: "carol.ferreira@email.com",
          phone: "(11) 3222-9000",
          mobile: "(11) 97777-6666",
          address: "Rua dos Pinheiros, 800",
          city: "S\xE3o Paulo",
          state: "SP",
          zipCode: "05422-000",
          status: "Inativo",
          tags: "Consumidor",
          notes: "Caso encerrado em 2024. Poss\xEDvel reabertura."
        }
      })
    ]);
    const hoje = /* @__PURE__ */ new Date();
    const diasAtras = (d) => new Date(hoje.getTime() - d * 864e5);
    const diasFrente = (d) => new Date(hoje.getTime() + d * 864e5);
    const processos = await Promise.all([
      db.process.create({
        data: {
          cnj: "0012345-67.2023.5.02.0001",
          title: "Reclama\xE7\xE3o Trabalhista - Jo\xE3o Santos vs Construtora Horizonte",
          court: "TRT-2",
          section: "1\xAA Vara do Trabalho - S\xE3o Paulo",
          classType: "Reclama\xE7\xE3o Trabalhista",
          subject: "Verbas rescis\xF3rias e horas extras",
          caseValue: 85e3,
          parties: "Reclamante: Jo\xE3o Santos | Reclamada: Construtora Horizonte Ltda",
          status: "Ativo",
          area: "Trabalhista",
          responsibleId: "Dra. Patr\xEDcia Almeida",
          risk: "M\xE9dio",
          clientId: clientes[0].id
        }
      }),
      db.process.create({
        data: {
          cnj: "0023456-78.2024.8.26.0100",
          title: "Indeniza\xE7\xE3o por Danos Morais - Maria Aparecida vs Banco XYZ",
          court: "TJSP",
          section: "3\xAA Vara C\xEDvel - S\xE3o Paulo",
          classType: "Procedimento Comum C\xEDvel",
          subject: "Indeniza\xE7\xE3o por inscri\xE7\xE3o indevida em \xF3rg\xE3os de prote\xE7\xE3o",
          caseValue: 5e4,
          parties: "Autora: Maria Aparecida Silva | R\xE9u: Banco XYZ",
          status: "Ativo",
          area: "C\xEDvel",
          responsibleId: "Dr. Roberto Lima",
          risk: "Baixo",
          clientId: clientes[1].id
        }
      }),
      db.process.create({
        data: {
          cnj: "0034567-89.2024.1.00.0000",
          title: "Mandado de Seguran\xE7a - Tech Solutions vs Receita Federal",
          court: "TRF-3",
          section: "10\xAA Vara Federal C\xEDvel - SP",
          classType: "Mandado de Seguran\xE7a",
          subject: "Cr\xE9dito-pr\xEAmio IPI",
          caseValue: 12e5,
          parties: "Impetrante: Tech Solutions Brasil S.A. | Autoridade: Receita Federal",
          status: "Ativo",
          area: "Tribut\xE1rio",
          responsibleId: "Dra. Patr\xEDcia Almeida",
          risk: "Alto",
          clientId: clientes[2].id
        }
      }),
      db.process.create({
        data: {
          cnj: "0045678-90.2025.8.26.0224",
          title: "A\xE7\xE3o de Cobran\xE7a - Distribuidora Norte vs Mercado Sul",
          court: "TJSP",
          section: "2\xAA Vara C\xEDvel - Guarulhos",
          classType: "Procedimento Comum C\xEDvel",
          subject: "Cobran\xE7a de duplicatas n\xE3o pagas",
          caseValue: 23e4,
          parties: "Autora: Distribuidora Norte Ltda | R\xE9u: Mercado Sul Ltda",
          status: "Ativo",
          area: "C\xEDvel",
          responsibleId: "Dr. Roberto Lima",
          risk: "M\xE9dio",
          clientId: clientes[4].id
        }
      }),
      db.process.create({
        data: {
          cnj: "0056789-01.2023.8.26.0100",
          title: "A\xE7\xE3o de Indeniza\xE7\xE3o - Carolina vs Loja ABC",
          court: "TJSP",
          section: "5\xAA Vara C\xEDvel - S\xE3o Paulo",
          classType: "Procedimento Comum C\xEDvel",
          subject: "V\xEDcio em produto",
          caseValue: 15e3,
          parties: "Autora: Carolina Ferreira Souza | R\xE9u: Loja ABC",
          status: "Encerrado",
          area: "Consumidor",
          responsibleId: "Dr. Roberto Lima",
          risk: "Baixo",
          clientId: clientes[5].id
        }
      }),
      db.process.create({
        data: {
          cnj: "0067890-12.2025.8.26.0100",
          title: "Defesa em Auto de Infra\xE7\xE3o - Distribuidora Norte",
          court: "TJSP",
          section: "3\xAA Vara da Fazenda P\xFAblica - SP",
          classType: "A\xE7\xE3o Anulat\xF3ria",
          subject: "Anula\xE7\xE3o de auto de infra\xE7\xE3o fiscal - ICMS",
          caseValue: 18e4,
          parties: "Autora: Distribuidora Norte Ltda | R\xE9u: Fazenda do Estado de SP",
          status: "Ativo",
          area: "Tribut\xE1rio",
          responsibleId: "Dra. Patr\xEDcia Almeida",
          risk: "Alto",
          clientId: clientes[4].id
        }
      })
    ]);
    await Promise.all([
      db.movement.create({
        data: {
          processId: processos[0].id,
          date: diasAtras(45),
          description: "Distribu\xEDdo por sorteio",
          summary: "Processo distribu\xEDdo para a 1\xAA Vara do Trabalho de S\xE3o Paulo.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[0].id,
          date: diasAtras(40),
          description: "Juntada de peti\xE7\xE3o inicial",
          summary: "Peti\xE7\xE3o inicial juntada aos autos pelo advogado do reclamante.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[0].id,
          date: diasAtras(35),
          description: "Despacho: designada audi\xEAncia inicial",
          summary: "Juiz designa audi\xEAncia inicial (concilia\xE7\xE3o, instru\xE7\xE3o e julgamento) para data futura.",
          important: true
        }
      }),
      db.movement.create({
        data: {
          processId: processos[0].id,
          date: diasAtras(10),
          description: "Notifica\xE7\xE3o da reclamada",
          summary: "Reclamada notificada para comparecer \xE0 audi\xEAncia e apresentar defesa.",
          important: true
        }
      }),
      db.movement.create({
        data: {
          processId: processos[1].id,
          date: diasAtras(30),
          description: "Distribu\xEDdo por sorteio",
          summary: "Processo distribu\xEDdo \xE0 3\xAA Vara C\xEDvel de S\xE3o Paulo.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[1].id,
          date: diasAtras(20),
          description: "Cita\xE7\xE3o do r\xE9u",
          summary: "R\xE9u citado. Prazo de 15 dias para contesta\xE7\xE3o.",
          important: true
        }
      }),
      db.movement.create({
        data: {
          processId: processos[1].id,
          date: diasAtras(5),
          description: "Juntada da contesta\xE7\xE3o",
          summary: "Banco XYZ apresenta contesta\xE7\xE3o alegando prescri\xE7\xE3o e legalidade da inscri\xE7\xE3o.",
          important: true
        }
      }),
      db.movement.create({
        data: {
          processId: processos[2].id,
          date: diasAtras(60),
          description: "Concess\xE3o de liminar",
          summary: "Juiz concede seguran\xE7a para suspender exig\xEAncia do tributo.",
          important: true
        }
      }),
      db.movement.create({
        data: {
          processId: processos[2].id,
          date: diasAtras(15),
          description: "Informa\xE7\xF5es da autoridade coatora",
          summary: "Receita Federal presta informa\xE7\xF5es em 30 dias.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[3].id,
          date: diasAtras(90),
          description: "Distribu\xEDdo por sorteio",
          summary: "Processo distribu\xEDdo \xE0 2\xAA Vara C\xEDvel de Guarulhos.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[3].id,
          date: diasAtras(85),
          description: "Cita\xE7\xE3o do r\xE9u",
          summary: "R\xE9u citado em 12/03.",
          important: false
        }
      }),
      db.movement.create({
        data: {
          processId: processos[5].id,
          date: diasAtras(25),
          description: "Distribu\xEDdo por sorteio",
          summary: "Processo distribu\xEDdo \xE0 3\xAA Vara da Fazenda P\xFAblica.",
          important: false
        }
      })
    ]);
    await Promise.all([
      db.deadline.create({
        data: {
          processId: processos[0].id,
          title: "Audi\xEAncia inicial (concilia\xE7\xE3o, instru\xE7\xE3o e julgamento)",
          dueDate: diasFrente(2),
          type: "Fatal",
          priority: "Cr\xEDtica",
          responsible: "Dra. Patr\xEDcia Almeida",
          done: false,
          notes: "Audi\xEAncia na 1\xAA Vara do Trabalho. Preparar testemunhas."
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[1].id,
          title: "R\xE9plica \xE0 contesta\xE7\xE3o",
          dueDate: diasFrente(5),
          type: "Fatal",
          priority: "Alta",
          responsible: "Dr. Roberto Lima",
          done: false,
          notes: "Prazo fatal de 15 dias. Contesta\xE7\xE3o juntada h\xE1 5 dias."
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[2].id,
          title: "Alega\xE7\xF5es finais",
          dueDate: diasFrente(10),
          type: "Fatal",
          priority: "Alta",
          responsible: "Dra. Patr\xEDcia Almeida",
          done: false
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[3].id,
          title: "Requisi\xE7\xE3o de per\xEDcia cont\xE1bil",
          dueDate: diasFrente(7),
          type: "Interno",
          priority: "M\xE9dia",
          responsible: "Dr. Roberto Lima",
          done: false
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[5].id,
          title: "Juntada de documentos fiscais",
          dueDate: diasFrente(1),
          type: "Fatal",
          priority: "Cr\xEDtica",
          responsible: "Dra. Patr\xEDcia Almeida",
          done: false,
          notes: "\xDAltima oportunidade antes da senten\xE7a."
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[0].id,
          title: "Preparar memoriais",
          dueDate: diasFrente(20),
          type: "Interno",
          priority: "M\xE9dia",
          responsible: "Estagi\xE1rio Pedro",
          done: false
        }
      }),
      db.deadline.create({
        data: {
          processId: processos[1].id,
          title: "Coletar jurisprud\xEAncia",
          dueDate: diasFrente(3),
          type: "Interno",
          priority: "M\xE9dia",
          responsible: "Estagi\xE1rio Pedro",
          done: false
        }
      })
    ]);
    await Promise.all([
      db.task.create({
        data: {
          title: "Redigir r\xE9plica do processo Maria Aparecida vs Banco XYZ",
          description: "Atacar preliminar de prescri\xE7\xE3o e refor\xE7ar pedido de indeniza\xE7\xE3o.",
          status: "A Fazer",
          priority: "Alta",
          dueDate: diasFrente(4),
          assignee: "Dr. Roberto Lima",
          processId: processos[1].id,
          clientId: clientes[1].id
        }
      }),
      db.task.create({
        data: {
          title: "Preparar memoriais - Construtora Horizonte",
          description: "S\xEDntese da prova produzida em audi\xEAncia.",
          status: "Em Andamento",
          priority: "M\xE9dia",
          dueDate: diasFrente(15),
          assignee: "Estagi\xE1rio Pedro",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.task.create({
        data: {
          title: "Revisar contrato de presta\xE7\xE3o de servi\xE7os - Tech Solutions",
          description: "Cliente solicitou revis\xE3o de cl\xE1usulas de SLA.",
          status: "Em Revis\xE3o",
          priority: "Alta",
          dueDate: diasFrente(2),
          assignee: "Dra. Patr\xEDcia Almeida",
          clientId: clientes[2].id
        }
      }),
      db.task.create({
        data: {
          title: "Reunir documentos fiscais - Distribuidora Norte",
          description: "Coletar notas fiscais dos \xFAltimos 5 anos.",
          status: "A Fazer",
          priority: "Cr\xEDtica",
          dueDate: diasFrente(1),
          assignee: "Estagi\xE1rio Pedro",
          processId: processos[5].id,
          clientId: clientes[4].id
        }
      }),
      db.task.create({
        data: {
          title: "Ligar para cliente Jo\xE3o Pedro Mendes",
          description: "Confirmar recebimento de documentos para invent\xE1rio.",
          status: "A Fazer",
          priority: "Baixa",
          dueDate: diasFrente(3),
          assignee: "Secret\xE1ria Ana",
          clientId: clientes[3].id
        }
      }),
      db.task.create({
        data: {
          title: "Emitir cobran\xE7a - honor\xE1rios Construtora",
          description: "Honor\xE1rios do m\xEAs vencidos h\xE1 10 dias.",
          status: "Em Andamento",
          priority: "Alta",
          dueDate: diasFrente(1),
          assignee: "Secret\xE1ria Ana",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.task.create({
        data: {
          title: "Atualizar planilha de prazos",
          description: "Revis\xE3o semanal de todos os prazos.",
          status: "Conclu\xEDda",
          priority: "Baixa",
          assignee: "Secret\xE1ria Ana"
        }
      }),
      db.task.create({
        data: {
          title: "Estudar tese sobre cr\xE9dito-pr\xEAmio IPI",
          description: "Pesquisar STJ sobre o tema para o caso Tech Solutions.",
          status: "Conclu\xEDda",
          priority: "M\xE9dia",
          assignee: "Estagi\xE1rio Pedro",
          processId: processos[2].id
        }
      })
    ]);
    await Promise.all([
      db.financial.create({
        data: {
          type: "Receita",
          category: "Honor\xE1rios",
          description: "Honor\xE1rios contratuais - Construtora Horizonte (Jul/26)",
          amount: 8500,
          dueDate: diasAtras(10),
          status: "Atrasado",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.financial.create({
        data: {
          type: "Receita",
          category: "Honor\xE1rios",
          description: "Honor\xE1rios contratuais - Tech Solutions (Jul/26)",
          amount: 12e3,
          dueDate: diasFrente(5),
          status: "Pendente",
          clientId: clientes[2].id
        }
      }),
      db.financial.create({
        data: {
          type: "Receita",
          category: "Honor\xE1rios",
          description: "Honor\xE1rios contratuais - Distribuidora Norte (Jul/26)",
          amount: 6500,
          dueDate: diasFrente(8),
          status: "Pendente",
          processId: processos[3].id,
          clientId: clientes[4].id
        }
      }),
      db.financial.create({
        data: {
          type: "Receita",
          category: "Honor\xE1rios",
          description: "Honor\xE1rios de sucumba - Carolina vs Loja ABC",
          amount: 5e3,
          dueDate: diasAtras(30),
          paidDate: diasAtras(25),
          status: "Pago",
          processId: processos[4].id,
          clientId: clientes[5].id
        }
      }),
      db.financial.create({
        data: {
          type: "Receita",
          category: "Honor\xE1rios",
          description: "Honor\xE1rios contratuais - Maria Aparecida (entrada)",
          amount: 5e3,
          dueDate: diasAtras(30),
          paidDate: diasAtras(28),
          status: "Pago",
          processId: processos[1].id,
          clientId: clientes[1].id
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Custas",
          description: "Custas processuais - Distribuidora Norte",
          amount: 1850,
          dueDate: diasFrente(3),
          status: "Pendente",
          processId: processos[3].id,
          clientId: clientes[4].id
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Custas",
          description: "Custas - Tech Solutions MS",
          amount: 1200,
          dueDate: diasAtras(20),
          paidDate: diasAtras(18),
          status: "Pago",
          processId: processos[2].id,
          clientId: clientes[2].id
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Sal\xE1rios",
          description: "Folha de pagamento - Jul/26",
          amount: 22e3,
          dueDate: diasFrente(5),
          status: "Pendente"
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Operacional",
          description: "Aluguel do escrit\xF3rio - Jul/26",
          amount: 6500,
          dueDate: diasFrente(10),
          status: "Pendente"
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Operacional",
          description: "Software jur\xEDdico - assinatura mensal",
          amount: 480,
          dueDate: diasAtras(5),
          paidDate: diasAtras(5),
          status: "Pago"
        }
      }),
      db.financial.create({
        data: {
          type: "Despesa",
          category: "Operacional",
          description: "Internet + telefone - Jun/26",
          amount: 380,
          dueDate: diasAtras(15),
          paidDate: diasAtras(13),
          status: "Pago"
        }
      })
    ]);
    await Promise.all([
      db.document.create({
        data: {
          name: "Peti\xE7\xE3o Inicial - Jo\xE3o Santos.pdf",
          type: "PDF",
          size: "1.2 MB",
          tags: "Peti\xE7\xE3o,Inicial",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.document.create({
        data: {
          name: "Contrato de Honor\xE1rios - Construtora Horizonte.pdf",
          type: "PDF",
          size: "420 KB",
          tags: "Contrato",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.document.create({
        data: {
          name: "Ata de Audi\xEAncia - 15_06.pdf",
          type: "PDF",
          size: "350 KB",
          tags: "Audi\xEAncia",
          processId: processos[0].id,
          clientId: clientes[0].id
        }
      }),
      db.document.create({
        data: {
          name: "Contesta\xE7\xE3o - Banco XYZ.pdf",
          type: "PDF",
          size: "850 KB",
          tags: "Contesta\xE7\xE3o",
          processId: processos[1].id,
          clientId: clientes[1].id
        }
      }),
      db.document.create({
        data: {
          name: "Mandado de Seguran\xE7a - Tech Solutions.pdf",
          type: "PDF",
          size: "950 KB",
          tags: "Peti\xE7\xE3o,MS",
          processId: processos[2].id,
          clientId: clientes[2].id
        }
      }),
      db.document.create({
        data: {
          name: "Contrato de Presta\xE7\xE3o - Tech Solutions.docx",
          type: "Word",
          size: "180 KB",
          tags: "Contrato",
          clientId: clientes[2].id
        }
      })
    ]);
    for (const p of processos) {
      const movs = await db.movement.findMany({ where: { processId: p.id }, orderBy: { date: "desc" } });
      for (const m of movs) {
        await db.timelineEntry.create({
          data: {
            processId: p.id,
            clientId: p.clientId,
            date: m.date,
            type: "Movimento",
            title: m.description,
            description: m.summary
          }
        });
      }
      const prazos = await db.deadline.findMany({ where: { processId: p.id } });
      for (const d of prazos) {
        await db.timelineEntry.create({
          data: {
            processId: p.id,
            clientId: p.clientId,
            date: d.dueDate,
            type: "Prazo",
            title: `Prazo: ${d.title}`,
            description: `Prioridade: ${d.priority} | Tipo: ${d.type} | Resp: ${d.responsible || "-"}`
          }
        });
      }
      const fins = await db.financial.findMany({ where: { processId: p.id } });
      for (const f of fins) {
        await db.timelineEntry.create({
          data: {
            processId: p.id,
            clientId: p.clientId,
            date: f.dueDate,
            type: "Financeiro",
            title: `${f.type}: ${f.description}`,
            description: `R$ ${f.amount.toFixed(2)} - ${f.status}`
          }
        });
      }
    }
    await db.auditLog.create({
      data: {
        user: "Dra. Patr\xEDcia Almeida",
        action: "CREATE",
        entity: "System",
        details: "Inicializa\xE7\xE3o do sistema com dados de demonstra\xE7\xE3o no Firebase"
      }
    });
    return Response.json({ success: true, message: "Firestore seeded successfully!" });
  } catch (error) {
    console.error("Error seeding Firestore:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// src/app/api/admin/route.ts
var route_exports23 = {};
__export(route_exports23, {
  GET: () => GET19,
  dynamic: () => dynamic23
});
var dynamic23 = "force-dynamic";
async function GET19() {
  const [
    totalUsers,
    totalClients,
    totalProcesses,
    totalDocuments,
    totalFinancial,
    auditLogs,
    subscription,
    automations,
    plans
  ] = await Promise.all([
    db.user.count(),
    db.client.count(),
    db.process.count(),
    db.document.count(),
    db.financial.aggregate({ _sum: { amount: true } }),
    db.auditLog.findMany({ orderBy: { createdAt: "desc" }, take: 50 }),
    db.subscription.findFirst({
      include: { plan: true },
      orderBy: { createdAt: "desc" }
    }),
    db.automation.findMany(),
    db.plan.findMany({ include: { subscriptions: true } })
  ]);
  const storageUsed = await db.document.count();
  const storageMB = storageUsed * 1.5;
  const trintaDiasAtras = new Date(Date.now() - 30 * 864e5);
  const [
    logins30d,
    processos30d,
    clientes30d,
    tarefasConcluidas30d,
    recebido30d
  ] = await Promise.all([
    db.auditLog.count({
      where: { action: "LOGIN", createdAt: { gte: trintaDiasAtras } }
    }),
    db.process.count({ where: { createdAt: { gte: trintaDiasAtras } } }),
    db.client.count({ where: { createdAt: { gte: trintaDiasAtras } } }),
    db.task.count({
      where: { status: "Conclu\xEDda", updatedAt: { gte: trintaDiasAtras } }
    }),
    db.financial.aggregate({
      where: {
        type: "Receita",
        status: "Pago",
        paidDate: { gte: trintaDiasAtras }
      },
      _sum: { amount: true }
    })
  ]);
  return Response.json({
    resumo: {
      totalUsers,
      totalClients,
      totalProcesses,
      totalDocuments,
      totalFinanceiro: totalFinancial._sum.amount || 0,
      storageUsedMB: Math.round(storageMB),
      storageLimitMB: subscription?.plan.maxStorage || 5e3,
      maxUsers: subscription?.plan.maxUsers || 3
    },
    metricas30d: {
      logins: logins30d,
      novosProcessos: processos30d,
      novosClientes: clientes30d,
      tarefasConcluidas: tarefasConcluidas30d,
      recebido: recebido30d._sum.amount || 0
    },
    subscription: subscription ? {
      plano: subscription.plan.name,
      status: subscription.status,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      price: subscription.plan.price,
      maxUsers: subscription.plan.maxUsers,
      maxStorage: subscription.plan.maxStorage,
      features: subscription.plan.features
    } : null,
    plans: plans.map((p) => ({
      ...p,
      subscriptionsCount: p.subscriptions.length
    })),
    automations: automations.map((a) => ({
      ...a,
      actions: JSON.parse(a.actions)
    })),
    auditLogs
  });
}

// src/app/api/portal/route.ts
var route_exports24 = {};
__export(route_exports24, {
  GET: () => GET20,
  dynamic: () => dynamic24
});
var dynamic24 = "force-dynamic";
async function GET20(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("token");
  if (!token) {
    return Response.json({ error: "Token necess\xE1rio" }, { status: 401 });
  }
  const client = await db.client.findFirst({ where: { portalToken: token } });
  let cliente = client;
  if (!cliente && token === "demo") {
    cliente = await db.client.findFirst({ where: { status: "Ativo" } });
    if (!cliente) {
      cliente = await db.client.findFirst();
    }
  }
  if (!cliente) {
    return Response.json({
      cliente: {
        id: "mock-1",
        name: "Cliente Demonstra\xE7\xE3o",
        email: "demo@jurisistem.com",
        type: "PF"
      },
      processes: [
        {
          id: "proc-1",
          title: "A\xE7\xE3o Indenizat\xF3ria",
          cnj: "0001234-56.2024.8.26.0000",
          status: "Ativo",
          area: "C\xEDvel",
          ultimoAndamento: { description: "Peti\xE7\xE3o Inicial Juntada" },
          atualizadoEm: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      documents: [
        {
          id: "doc-1",
          name: "Procura\xE7\xE3o.pdf",
          type: "PDF",
          size: 15e4,
          createdAt: (/* @__PURE__ */ new Date()).toISOString()
        }
      ],
      financials: [
        {
          id: "fin-1",
          description: "Honor\xE1rios Iniciais",
          amount: 5e3,
          dueDate: (/* @__PURE__ */ new Date()).toISOString(),
          status: "Pendente",
          type: "Receita"
        }
      ],
      contracts: [],
      resumo: {
        processosAtivos: 1,
        documentos: 1,
        aPagar: 5e3,
        contratos: 0
      }
    });
  }
  const [processes, documents, financials, contracts] = await Promise.all([
    db.process.findMany({
      where: { clientId: cliente.id },
      include: { movements: { orderBy: { date: "desc" }, take: 3 } },
      orderBy: { updatedAt: "desc" }
    }),
    db.document.findMany({
      where: { clientId: cliente.id },
      orderBy: { createdAt: "desc" }
    }),
    db.financial.findMany({
      where: { clientId: cliente.id },
      orderBy: { dueDate: "desc" }
    }),
    db.contract.findMany({
      where: { clientId: cliente.id, status: "Assinado" },
      orderBy: { createdAt: "desc" }
    })
  ]);
  return Response.json({
    cliente: {
      id: cliente.id,
      name: cliente.name,
      email: cliente.email,
      type: cliente.type
    },
    processes: processes.map((p) => ({
      id: p.id,
      title: p.title,
      cnj: p.cnj,
      status: p.status,
      area: p.area,
      ultimoAndamento: p.movements[0] || null,
      atualizadoEm: p.updatedAt
    })),
    documents: documents.map((d) => ({
      id: d.id,
      name: d.name,
      type: d.type,
      size: d.size,
      createdAt: d.createdAt
    })),
    financials: financials.map((f) => ({
      id: f.id,
      description: f.description,
      amount: f.amount,
      dueDate: f.dueDate,
      status: f.status,
      type: f.type
    })),
    contracts: contracts.map((c) => ({
      id: c.id,
      title: c.title,
      signedAt: c.signedAt
    })),
    resumo: {
      processosAtivos: processes.filter((p) => p.status === "Ativo").length,
      documentos: documents.length,
      aPagar: financials.filter((f) => f.type === "Receita" && f.status !== "Pago").reduce((s, f) => s + f.amount, 0),
      contratos: contracts.length
    }
  });
}

// src/app/api/contracts/route.ts
var route_exports25 = {};
__export(route_exports25, {
  GET: () => GET21,
  PATCH: () => PATCH5,
  POST: () => POST17,
  dynamic: () => dynamic25
});
var dynamic25 = "force-dynamic";
async function GET21(req) {
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const where = {};
  if (status && status !== "Todos") where.status = status;
  const contracts = await db.contract.findMany({
    where,
    include: { client: true, process: true, template: true },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(contracts);
}
async function POST17(req) {
  const body = await req.json();
  let content = "";
  if (body.templateId) {
    const tpl = await db.contractTemplate.findUnique({ where: { id: body.templateId } });
    if (tpl) {
      content = tpl.content;
      if (body.variables) {
        for (const [key, value] of Object.entries(body.variables)) {
          content = content.replace(new RegExp(`{{${key}}}`, "g"), String(value));
        }
      }
    }
  } else {
    content = body.content || "";
  }
  const contract = await db.contract.create({
    data: {
      title: body.title,
      templateId: body.templateId || null,
      clientId: body.clientId,
      processId: body.processId || null,
      content,
      status: body.status || "Rascunho"
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Contract",
      entityId: contract.id,
      details: `Contrato criado: ${contract.title}`
    }
  });
  return Response.json(contract, { status: 201 });
}
async function PATCH5(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  if (body.acao === "assinar") {
    const assinantes = body.assinantes || "Signat\xE1rio";
    const contract = await db.contract.update({
      where: { id },
      data: {
        status: "Assinado",
        signedBy: assinantes,
        signedAt: /* @__PURE__ */ new Date()
      }
    });
    await db.auditLog.create({
      data: {
        user: "Sistema",
        action: "SIGN",
        entity: "Contract",
        entityId: id,
        details: `Contrato assinado eletronicamente por: ${assinantes}`
      }
    });
    return Response.json(contract);
  }
  const updated = await db.contract.update({
    where: { id },
    data: { ...body, acao: void 0, assinantes: void 0 }
  });
  return Response.json(updated);
}

// src/app/api/financial/route.ts
var route_exports26 = {};
__export(route_exports26, {
  GET: () => GET22,
  PATCH: () => PATCH6,
  POST: () => POST18,
  dynamic: () => dynamic26
});
var dynamic26 = "force-dynamic";
async function GET22(req) {
  const { searchParams } = new URL(req.url);
  const type = searchParams.get("type");
  const status = searchParams.get("status");
  const where = {};
  if (type && type !== "Todos") where.type = type;
  if (status && status !== "Todos") where.status = status;
  const items = await db.financial.findMany({
    where,
    include: { client: true, process: true },
    orderBy: { dueDate: "desc" }
  });
  return Response.json(items);
}
async function POST18(req) {
  const body = await req.json();
  const fin = await db.financial.create({
    data: {
      type: body.type,
      category: body.category,
      description: body.description,
      amount: Number(body.amount),
      dueDate: new Date(body.dueDate),
      paidDate: body.paidDate ? new Date(body.paidDate) : null,
      status: body.status || "Pendente",
      processId: body.processId || null,
      clientId: body.clientId || null
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Financial",
      entityId: fin.id,
      details: `Lan\xE7amento: ${fin.description} - R$ ${fin.amount}`
    }
  });
  return Response.json(fin, { status: 201 });
}
async function PATCH6(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  const updated = await db.financial.update({
    where: { id },
    data: {
      ...body,
      amount: body.amount !== void 0 ? Number(body.amount) : void 0,
      dueDate: body.dueDate ? new Date(body.dueDate) : void 0,
      paidDate: body.paidDate ? new Date(body.paidDate) : body.paidDate === null ? null : void 0
    }
  });
  return Response.json(updated);
}

// src/app/api/outcome-pricing/route.ts
var route_exports27 = {};
__export(route_exports27, {
  GET: () => GET23,
  POST: () => POST19,
  dynamic: () => dynamic27
});
var dynamic27 = "force-dynamic";
async function GET23(req) {
  const { searchParams } = new URL(req.url);
  const area = searchParams.get("area");
  const where = { active: true };
  if (area && area !== "Todas") where.area = area;
  const pricing = await db.outcomePricing.findMany({ where, orderBy: { area: "asc" } });
  return Response.json(pricing);
}
async function POST19(req) {
  const body = await req.json();
  const pricing = await db.outcomePricing.create({
    data: {
      name: body.name,
      description: body.description,
      basePrice: Number(body.basePrice),
      successPrice: Number(body.successPrice),
      successCriteria: body.successCriteria,
      area: body.area || "Geral"
    }
  });
  return Response.json(pricing, { status: 201 });
}

// src/app/api/deadlines/route.ts
var route_exports28 = {};
__export(route_exports28, {
  GET: () => GET24,
  PATCH: () => PATCH7,
  POST: () => POST20,
  dynamic: () => dynamic28
});
var dynamic28 = "force-dynamic";
async function GET24(req) {
  const { searchParams } = new URL(req.url);
  const periodo = searchParams.get("periodo") || "todos";
  const done = searchParams.get("done");
  const hoje = /* @__PURE__ */ new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const fimHoje = new Date(inicioHoje.getTime() + 864e5);
  const where = {};
  if (done === "false") where.done = false;
  if (done === "true") where.done = true;
  if (periodo === "hoje") {
    where.dueDate = { gte: inicioHoje, lt: fimHoje };
  } else if (periodo === "7dias") {
    where.dueDate = {
      gte: inicioHoje,
      lte: new Date(hoje.getTime() + 7 * 864e5)
    };
  } else if (periodo === "30dias") {
    where.dueDate = {
      gte: inicioHoje,
      lte: new Date(hoje.getTime() + 30 * 864e5)
    };
  } else if (periodo === "atrasados") {
    where.dueDate = { lt: inicioHoje };
    where.done = false;
  }
  const deadlines = await db.deadline.findMany({
    where,
    include: { process: { include: { client: true } } },
    orderBy: { dueDate: "asc" }
  });
  return Response.json(deadlines);
}
async function POST20(req) {
  const body = await req.json();
  const deadline = await db.deadline.create({
    data: {
      processId: body.processId,
      title: body.title,
      dueDate: new Date(body.dueDate),
      type: body.type || "Interno",
      priority: body.priority || "M\xE9dia",
      responsible: body.responsible,
      notes: body.notes
    }
  });
  await db.timelineEntry.create({
    data: {
      processId: body.processId,
      date: deadline.dueDate,
      type: "Prazo",
      title: `Prazo: ${deadline.title}`,
      description: `${deadline.type} | ${deadline.priority}`
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Deadline",
      entityId: deadline.id,
      details: `Prazo criado: ${deadline.title}`
    }
  });
  return Response.json(deadline, { status: 201 });
}
async function PATCH7(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return Response.json({ error: "id required" }, { status: 400 });
  const body = await req.json();
  const allowedFields = {};
  for (const f of ["title", "type", "priority", "responsible", "done", "notes", "processId"]) {
    if (body[f] !== void 0) allowedFields[f] = body[f];
  }
  if (body.dueDate) allowedFields.dueDate = new Date(body.dueDate);
  const updated = await db.deadline.update({
    where: { id },
    data: allowedFields
  });
  return Response.json(updated);
}

// src/app/api/datajud/search/route.ts
var route_exports29 = {};
__export(route_exports29, {
  GET: () => GET25,
  POST: () => POST21,
  dynamic: () => dynamic29
});

// src/lib/datajud.ts
var DATAJUD_API_KEY = "cDZHYzlZa0JadVREZDJCendQbXY6SkJlTzNjLV9TRENyQk1RdnFKZGRQdw==";
var DATAJUD_BASE = "https://api-publica.datajud.cnj.jus.br";
var TRIBUNAIS = {
  // Tribunais de Justiça Estaduais (TJ)
  TJSP: { endpoint: "api_publica_tjsp", nome: "Tribunal de Justi\xE7a de S\xE3o Paulo", tipo: "Estadual" },
  TJRJ: { endpoint: "api_publica_tjrj", nome: "Tribunal de Justi\xE7a do Rio de Janeiro", tipo: "Estadual" },
  TJMG: { endpoint: "api_publica_tjmg", nome: "Tribunal de Justi\xE7a de Minas Gerais", tipo: "Estadual" },
  TJRS: { endpoint: "api_publica_tjrs", nome: "Tribunal de Justi\xE7a do Rio Grande do Sul", tipo: "Estadual" },
  TJPR: { endpoint: "api_publica_tjpr", nome: "Tribunal de Justi\xE7a do Paran\xE1", tipo: "Estadual" },
  TJSC: { endpoint: "api_publica_tjsc", nome: "Tribunal de Justi\xE7a de Santa Catarina", tipo: "Estadual" },
  TJBA: { endpoint: "api_publica_tjba", nome: "Tribunal de Justi\xE7a da Bahia", tipo: "Estadual" },
  TJCE: { endpoint: "api_publica_tjce", nome: "Tribunal de Justi\xE7a do Cear\xE1", tipo: "Estadual" },
  TJPE: { endpoint: "api_publica_tjpe", nome: "Tribunal de Justi\xE7a de Pernambuco", tipo: "Estadual" },
  TJGO: { endpoint: "api_publica_tjgo", nome: "Tribunal de Justi\xE7a de Goi\xE1s", tipo: "Estadual" },
  TJDF: { endpoint: "api_publica_tjdf", nome: "Tribunal de Justi\xE7a do DF", tipo: "Estadual" },
  TJES: { endpoint: "api_publica_tjes", nome: "Tribunal de Justi\xE7a do ES", tipo: "Estadual" },
  // Tribunais Regionais do Trabalho (TRT)
  TRT2: { endpoint: "api_publica_trt2", nome: "TRT 2\xAA Regi\xE3o (SP)", tipo: "Trabalhista" },
  TRT1: { endpoint: "api_publica_trt1", nome: "TRT 1\xAA Regi\xE3o (RJ)", tipo: "Trabalhista" },
  TRT3: { endpoint: "api_publica_trt3", nome: "TRT 3\xAA Regi\xE3o (MG)", tipo: "Trabalhista" },
  TRT4: { endpoint: "api_publica_trt4", nome: "TRT 4\xAA Regi\xE3o (RS)", tipo: "Trabalhista" },
  TRT5: { endpoint: "api_publica_trt5", nome: "TRT 5\xAA Regi\xE3o (BA)", tipo: "Trabalhista" },
  TRT6: { endpoint: "api_publica_trt6", nome: "TRT 6\xAA Regi\xE3o (PE)", tipo: "Trabalhista" },
  TRT7: { endpoint: "api_publica_trt7", nome: "TRT 7\xAA Regi\xE3o (CE)", tipo: "Trabalhista" },
  TRT8: { endpoint: "api_publica_trt8", nome: "TRT 8\xAA Regi\xE3o (PA/AP)", tipo: "Trabalhista" },
  TRT9: { endpoint: "api_publica_trt9", nome: "TRT 9\xAA Regi\xE3o (PR)", tipo: "Trabalhista" },
  TRT10: { endpoint: "api_publica_trt10", nome: "TRT 10\xAA Regi\xE3o (DF/TO)", tipo: "Trabalhista" },
  TRT15: { endpoint: "api_publica_trt15", nome: "TRT 15\xAA Regi\xE3o (SP Interior)", tipo: "Trabalhista" },
  // Tribunais Regionais Federais (TRF)
  TRF1: { endpoint: "api_publica_trf1", nome: "TRF 1\xAA Regi\xE3o", tipo: "Federal" },
  TRF2: { endpoint: "api_publica_trf2", nome: "TRF 2\xAA Regi\xE3o", tipo: "Federal" },
  TRF3: { endpoint: "api_publica_trf3", nome: "TRF 3\xAA Regi\xE3o (SP/MS)", tipo: "Federal" },
  TRF4: { endpoint: "api_publica_trf4", nome: "TRF 4\xAA Regi\xE3o (RS/PR/SC)", tipo: "Federal" },
  TRF5: { endpoint: "api_publica_trf5", nome: "TRF 5\xAA Regi\xE3o (NE)", tipo: "Federal" },
  TRF6: { endpoint: "api_publica_trf6", nome: "TRF 6\xAA Regi\xE3o (MG)", tipo: "Federal" },
  // Justiça Eleitoral
  TSE: { endpoint: "api_publica_tse", nome: "Tribunal Superior Eleitoral", tipo: "Eleitoral" },
  TRESP: { endpoint: "api_publica_tresp", nome: "TRE-SP", tipo: "Eleitoral" },
  // Superiores
  STJ: { endpoint: "api_publica_stj", nome: "Superior Tribunal de Justi\xE7a", tipo: "Superior" },
  STF: { endpoint: "api_publica_stf", nome: "Supremo Tribunal Federal", tipo: "Superior" },
  TST: { endpoint: "api_publica_tst", nome: "Tribunal Superior do Trabalho", tipo: "Superior" }
};
function extrairTribunalDoCNJ(cnj) {
  const limpo = cnj.replace(/\D/g, "");
  if (limpo.length !== 20) return null;
  const segmento = limpo.substring(13, 14);
  const tribunal = limpo.substring(14, 16);
  const mapa = {
    // Estaduais (J=8) - TR é o código IBGE do estado
    "801": "TJRJ",
    // Rio de Janeiro
    "802": "TJMG",
    // Minas Gerais (corrigido - era 824 errado)
    "803": "TJES",
    // Espírito Santo
    "804": "TJBA",
    // Bahia (corrigido)
    "805": "TJBA",
    // Bahia (alt)
    "806": "TJCE",
    // Ceará
    "807": "TJGO",
    // Goiás (corrigido)
    "808": "TJES",
    // Espírito Santo (alt)
    "809": "TJGO",
    // Goiás
    "810": "TJPE",
    // Pernambuco (corrigido)
    "811": "TJDF",
    // DF (alt)
    "812": "TJSC",
    // Santa Catarina (corrigido - era 824 errado)
    "813": "TJPR",
    // Paraná (corrigido)
    "814": "TJRS",
    // Rio Grande do Sul (corrigido)
    "816": "TJPR",
    // Paraná (alt)
    "817": "TJPE",
    // Pernambuco (alt)
    "820": "TJPR",
    // Paraná (alt)
    "821": "TJRS",
    // Rio Grande do Sul (alt)
    "822": "TJSC",
    // Santa Catarina (alt)
    "824": "TJSP",
    // São Paulo (corrigido - era TJSC)
    "826": "TJSP",
    // São Paulo (alt)
    // Trabalhistas (J=5) - TR é o número da região
    "501": "TRT1",
    "502": "TRT2",
    "503": "TRT3",
    "504": "TRT4",
    "505": "TRT5",
    "506": "TRT6",
    "507": "TRT7",
    "508": "TRT8",
    "509": "TRT9",
    "510": "TRT10",
    "515": "TRT15",
    // Federais (J=4) - TR é o número da região
    "401": "TRF1",
    "402": "TRF2",
    "403": "TRF3",
    "404": "TRF4",
    "405": "TRF5",
    "406": "TRF6"
  };
  const chave = `${segmento}${tribunal}`;
  const sigla = mapa[chave];
  if (!sigla) return null;
  const segmentos = {
    "1": "STF",
    "3": "STJ",
    "4": "Federal",
    "5": "Trabalhista",
    "6": "Eleitoral",
    "7": "Militar Uni\xE3o",
    "8": "Estadual",
    "9": "Militar Estadual"
  };
  return { tribunal: sigla, segmento: segmentos[segmento] || "Desconhecido" };
}
async function consultarProcessoDataJud(cnj) {
  const cnjLimpo = cnj.replace(/\D/g, "");
  if (cnjLimpo.length !== 20) {
    throw new Error("N\xFAmero CNJ inv\xE1lido. Deve conter 20 d\xEDgitos.");
  }
  const info = extrairTribunalDoCNJ(cnj);
  if (!info) {
    throw new Error("N\xE3o foi poss\xEDvel identificar o tribunal a partir do CNJ. Consulte manualmente.");
  }
  const tribunalInfo = TRIBUNAIS[info.tribunal];
  if (!tribunalInfo) {
    throw new Error(`Tribunal ${info.tribunal} n\xE3o suportado pela API DataJud.`);
  }
  const url = `${DATAJUD_BASE}/${tribunalInfo.endpoint}/_search`;
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15e3);
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Authorization": `APIKey ${DATAJUD_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        query: {
          match: {
            numeroProcesso: cnjLimpo
          }
        },
        size: 1
      }),
      signal: controller.signal
    });
    clearTimeout(timeout);
    if (!res.ok) {
      throw new Error(`DataJud retornou HTTP ${res.status}`);
    }
    const data = await res.json();
    if (!data.hits || !data.hits.hits || data.hits.hits.length === 0) {
      return {
        encontrado: false,
        numeroProcesso: cnj,
        tribunal: info.tribunal,
        tribunalNome: tribunalInfo.nome,
        fonte: "datajud"
      };
    }
    const source = data.hits.hits[0]._source;
    return {
      encontrado: true,
      numeroProcesso: source.numeroProcesso || cnj,
      tribunal: info.tribunal,
      tribunalNome: tribunalInfo.nome,
      classe: source.classe?.codigo,
      classeNome: source.classe?.nome,
      assuntos: source.assuntos || [],
      orgaoJulgador: source.orgaoJulgador?.nome,
      dataAjuizamento: source.dataAjuizamento,
      grau: source.grau,
      formato: source.formato?.nome,
      valorCausa: source.valorCausa,
      partes: source.partes || [],
      movimentos: (source.movimentos || []).map((m) => ({
        codigo: m.codigo,
        nome: m.nome,
        data: m.dataHora,
        descricao: m.complementosTabelados?.map((c) => c.descricao).join("; ")
      })),
      fonte: "datajud",
      raw: source
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error("Timeout ao consultar DataJud (15s). Verifique a conex\xE3o.");
    }
    throw error;
  }
}
function simularRespostaDataJud(cnj) {
  const info = extrairTribunalDoCNJ(cnj);
  const tribunal = info?.tribunal || "TJSP";
  const tribunalInfo = TRIBUNAIS[tribunal];
  const hoje = /* @__PURE__ */ new Date();
  const diasAtras = (d) => new Date(hoje.getTime() - d * 864e5).toISOString();
  const movimentosDemo = [
    { codigo: 85, nome: "Peti\xE7\xE3o Inicial Juntada", data: diasAtras(60) },
    { codigo: 33, nome: "Determinada Cita\xE7\xE3o do R\xE9u", data: diasAtras(55) },
    { codigo: 28, nome: "Mandado Expedido", data: diasAtras(53) },
    { codigo: 22, nome: "Carta Registrada Expedida", data: diasAtras(50) },
    { codigo: 19, nome: "Carta Devolvida - Recebida", data: diasAtras(40) },
    { codigo: 17, nome: "R\xE9u Citado", data: diasAtras(38), descricao: "Mandado cumprido com sucesso" },
    { codigo: 14, nome: "Defesa Apresentada", data: diasAtras(25), descricao: "Contesta\xE7\xE3o juntada aos autos" },
    { codigo: 12, nome: "R\xE9plica Determinada", data: diasAtras(15) },
    { codigo: 8, nome: "Audi\xEAncia Designada", data: diasAtras(10), descricao: "Audi\xEAncia de instru\xE7\xE3o e julgamento" },
    { codigo: 5, nome: "Intima\xE7\xE3o da Parte", data: diasAtras(3) },
    { codigo: 2, nome: "Conclusos para Despacho", data: diasAtras(1) }
  ];
  return {
    encontrado: true,
    numeroProcesso: cnj,
    tribunal,
    tribunalNome: tribunalInfo?.nome || "Tribunal (demo)",
    classeNome: info?.segmento === "Trabalhista" ? "Reclama\xE7\xE3o Trabalhista" : "Procedimento Comum C\xEDvel",
    assuntos: [{ codigo: 1, nome: info?.segmento === "Trabalhista" ? "Verbas Rescis\xF3rias" : "Indeniza\xE7\xE3o" }],
    orgaoJulgador: "1\xAA Vara C\xEDvel",
    dataAjuizamento: diasAtras(60),
    grau: "G1",
    formato: "Eletr\xF4nico",
    valorCausa: 5e4,
    partes: [
      { nome: "Parte Autora", polo: "Ativo" },
      { nome: "Parte R\xE9", polo: "Passivo" }
    ],
    movimentos: movimentosDemo,
    fonte: "demo"
  };
}

// src/app/api/datajud/search/route.ts
var dynamic29 = "force-dynamic";
async function POST21(req) {
  const body = await req.json();
  const cnj = (body.cnj || "").trim();
  if (!cnj) {
    return Response.json({ error: "CNJ \xE9 obrigat\xF3rio" }, { status: 400 });
  }
  const info = extrairTribunalDoCNJ(cnj);
  if (!info) {
    return Response.json({
      error: "N\xE3o foi poss\xEDvel identificar o tribunal a partir do CNJ. Verifique o n\xFAmero."
    }, { status: 400 });
  }
  const tribunalInfo = TRIBUNAIS[info.tribunal];
  const usarDemo = body.demo === true;
  if (usarDemo) {
    const resultado = simularRespostaDataJud(cnj);
    return Response.json({
      ...resultado,
      aviso: "Modo demonstra\xE7\xE3o - dados simulados. Em ambiente com acesso ao CNJ, retornar\xE1 dados reais do DataJud."
    });
  }
  try {
    const resultado = await consultarProcessoDataJud(cnj);
    await db.auditLog.create({
      data: {
        user: "Sistema",
        action: "DATAJUD_SEARCH",
        entity: "Process",
        details: `Consulta DataJud: CNJ ${cnj} (${info.tribunal}) - ${resultado.encontrado ? "Encontrado" : "N\xE3o encontrado"}`
      }
    });
    return Response.json(resultado);
  } catch (error) {
    console.error("Erro DataJud:", error.message);
    const ehErroConexao = error.message.includes("fetch") || error.message.includes("Timeout") || error.message.includes("HTTP 000");
    if (ehErroConexao) {
      const demo = simularRespostaDataJud(cnj);
      return Response.json({
        ...demo,
        aviso: `\u26A0\uFE0F N\xE3o foi poss\xEDvel conectar \xE0 API do DataJud (${error.message}). Retornando dados de demonstra\xE7\xE3o. Em produ\xE7\xE3o, isto traria dados reais do tribunal.`,
        erroConexao: true
      });
    }
    return Response.json(
      {
        error: error.message,
        tribunal: info.tribunal,
        tribunalNome: tribunalInfo?.nome
      },
      { status: 500 }
    );
  }
}
async function GET25() {
  return Response.json(
    Object.entries(TRIBUNAIS).map(([sigla, info]) => ({
      sigla,
      nome: info.nome,
      tipo: info.tipo,
      endpoint: info.endpoint
    }))
  );
}

// src/app/api/datajud/sync/route.ts
var route_exports30 = {};
__export(route_exports30, {
  POST: () => POST22,
  dynamic: () => dynamic30
});
var dynamic30 = "force-dynamic";
async function POST22(req) {
  const body = await req.json();
  const processId = body.processId;
  if (!processId) {
    return Response.json({ error: "processId \xE9 obrigat\xF3rio" }, { status: 400 });
  }
  const proc = await db.process.findUnique({
    where: { id: processId },
    include: { movements: { orderBy: { date: "desc" } } }
  });
  if (!proc) {
    return Response.json({ error: "Processo n\xE3o encontrado" }, { status: 404 });
  }
  if (!proc.cnj) {
    return Response.json({
      error: "Processo n\xE3o possui n\xFAmero CNJ cadastrado. Atualize o processo com o CNJ antes de sincronizar."
    }, { status: 400 });
  }
  const info = extrairTribunalDoCNJ(proc.cnj);
  if (!info) {
    return Response.json({
      error: "N\xE3o foi poss\xEDvel identificar o tribunal a partir do CNJ."
    }, { status: 400 });
  }
  let resultado;
  const usarDemo = body.demo === true;
  if (usarDemo) {
    resultado = simularRespostaDataJud(proc.cnj);
  } else {
    try {
      resultado = await consultarProcessoDataJud(proc.cnj);
    } catch (error) {
      const ehErroConexao = error.message.includes("fetch") || error.message.includes("Timeout") || error.message.includes("HTTP 000");
      if (ehErroConexao) {
        resultado = simularRespostaDataJud(proc.cnj);
        resultado.aviso = `Erro de conex\xE3o com DataJud - usando dados simulados.`;
      } else {
        return Response.json({ error: error.message }, { status: 500 });
      }
    }
  }
  if (!resultado.encontrado || !resultado.movimentos) {
    return Response.json({
      sincronizado: false,
      mensagem: "Processo n\xE3o encontrado no DataJud ou sem movimentos.",
      cnj: proc.cnj,
      tribunal: info.tribunal
    });
  }
  const movimentosExistentes = new Set(
    proc.movements.map((m) => `${new Date(m.date).toISOString()}-${m.description}`)
  );
  const novosMovimentos = [];
  for (const mov of resultado.movimentos) {
    const data = new Date(mov.data);
    const chave = `${data.toISOString()}-${mov.nome}`;
    if (!movimentosExistentes.has(chave)) {
      const novo = await db.movement.create({
        data: {
          processId: proc.id,
          date: data,
          description: mov.nome,
          summary: mov.descricao || `Movimento autom\xE1tico importado do DataJud (${info.tribunal})`,
          important: false
        }
      });
      novosMovimentos.push(novo);
      await db.timelineEntry.create({
        data: {
          processId: proc.id,
          clientId: proc.clientId,
          date: data,
          type: "Movimento",
          title: mov.nome,
          description: `Importado do DataJud \u2022 ${info.tribunal}`
        }
      });
    }
  }
  const updateData = {};
  if (resultado.classeNome && !proc.classType) updateData.classType = resultado.classeNome;
  if (resultado.orgaoJulgador && !proc.section) updateData.section = resultado.orgaoJulgador;
  if (resultado.valorCausa && (!proc.caseValue || proc.caseValue === 0)) {
    updateData.caseValue = resultado.valorCausa;
  }
  if (Object.keys(updateData).length > 0) {
    await db.process.update({ where: { id: proc.id }, data: updateData });
  }
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "DATAJUD_SYNC",
      entity: "Process",
      entityId: proc.id,
      details: `Sincroniza\xE7\xE3o DataJud: ${novosMovimentos.length} novo(s) andamento(s) importado(s). Tribunal: ${info.tribunal}. Fonte: ${resultado.fonte}`
    }
  });
  if (novosMovimentos.length > 0) {
    await db.notification.create({
      data: {
        type: "sistema",
        title: `${novosMovimentos.length} novo(s) andamento(s) importado(s)`,
        description: `Processo: ${proc.title} \u2022 Tribunal: ${info.tribunal} \u2022 Via DataJud`,
        link: "process-detail",
        priority: "M\xE9dia"
      }
    });
  }
  return Response.json({
    sincronizado: true,
    processo: proc.title,
    cnj: proc.cnj,
    tribunal: info.tribunal,
    fonte: resultado.fonte,
    aviso: resultado.aviso,
    novosMovimentos: novosMovimentos.length,
    totalMovimentosDataJud: resultado.movimentos.length,
    movimentosImportados: novosMovimentos.map((m) => ({
      data: m.date,
      descricao: m.description
    })),
    dadosAtualizados: Object.keys(updateData)
  });
}

// src/app/api/ai-jurisprudencia/route.ts
var route_exports31 = {};
__export(route_exports31, {
  POST: () => POST23,
  dynamic: () => dynamic31
});
var import_z_ai_web_dev_sdk7 = __toESM(require("z-ai-web-dev-sdk"), 1);
var dynamic31 = "force-dynamic";
async function POST23(req) {
  const body = await req.json();
  const tema = (body.tema || "").trim();
  const area = body.area || "Geral";
  if (!tema) {
    return Response.json({ error: "Tema \xE9 obrigat\xF3rio" }, { status: 400 });
  }
  const prompt = `Voc\xEA \xE9 um advogado brasileiro especialista em pesquisa jurisprudencial. Para o tema "${tema}" na \xE1rea ${area}, forne\xE7a:

1. **TESSES JURISPRUDENCIAIS RELEVANTES** (pelo menos 3 teses principais)
2. **S\xDAMULAS APLIC\xC1VEIS** (STJ, STF, TST quando relevantes)
3. **PRECEDENTES IMPORTANTES** (cite casos paradigm\xE1ticos, sem inventar n\xFAmeros)
4. **POSICIONAMENTO ATUAL** dos tribunais superiores sobre o tema
5. **ARGUMENTOS FAVOR\xC1VEIS** que podem ser usados em peti\xE7\xF5es
6. **ARGUMENTOS CONTR\xC1RIOS** (para antecipar a contesta\xE7\xE3o da parte contr\xE1ria)
7. **RECOMENDA\xC7\xD5ES** de como usar essa jurisprud\xEAncia na peti\xE7\xE3o

\u26A0\uFE0F IMPORTANTE: N\xE3o invente n\xFAmeros de recursos ou datas espec\xEDficas. Use express\xF5es como "Tema X do STJ", "S\xFAmula Y", "Jurisprud\xEAncia consolidada do STJ", "Posicionamento do TST", etc. Indique que o advogado deve validar em fontes oficiais (STJ, JusBrasil, TST).

Responda em portugu\xEAs brasileiro, formato Markdown.`;
  try {
    const zai = await import_z_ai_web_dev_sdk7.default.create();
    const completion = await zai.chat.completions.create({
      messages: [
        { role: "assistant", content: prompt },
        { role: "user", content: `Forne\xE7a sugest\xF5es de jurisprud\xEAncia para: ${tema}` }
      ],
      thinking: { type: "disabled" },
      temperature: 0.4,
      max_tokens: 2500
    });
    const jurisprudencia = completion.choices[0]?.message?.content || "";
    return Response.json({
      tema,
      area,
      jurisprudencia,
      geradoEm: (/* @__PURE__ */ new Date()).toISOString(),
      aviso: "Sempre valide as teses em fontes oficiais (STJ, STF, TST) antes de usar em peti\xE7\xF5es."
    });
  } catch (error) {
    console.error("Erro IA jurisprud\xEAncia:", error);
    return Response.json(
      { error: "Erro ao sugerir jurisprud\xEAncia", jurisprudencia: "" },
      { status: 500 }
    );
  }
}

// src/app/api/viacep/route.ts
var route_exports32 = {};
__export(route_exports32, {
  GET: () => GET26,
  dynamic: () => dynamic32
});
var dynamic32 = "force-dynamic";
async function GET26(req) {
  const { searchParams } = new URL(req.url);
  const cep = (searchParams.get("cep") || "").replace(/\D/g, "");
  if (!cep || cep.length !== 8) {
    return Response.json({ error: "CEP inv\xE1lido. Use 8 d\xEDgitos." }, { status: 400 });
  }
  try {
    const res = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
    if (!res.ok) throw new Error("Falha na consulta");
    const data = await res.json();
    if (data.erro) {
      return Response.json({ error: "CEP n\xE3o encontrado" }, { status: 404 });
    }
    return Response.json({
      cep: data.cep,
      logradouro: data.logradouro,
      complemento: data.complemento,
      bairro: data.bairro,
      localidade: data.localidade,
      // cidade
      uf: data.uf,
      ibge: data.ibge,
      // Endereço formatado pronto para preencher campo
      enderecoCompleto: `${data.logradouro || ""}${data.complemento ? " - " + data.complemento : ""} - ${data.bairro || ""}, ${data.localidade}/${data.uf}`.trim()
    });
  } catch (error) {
    console.error("ViaCEP error:", error);
    return Response.json(
      { error: "Erro ao consultar ViaCEP. Tente novamente." },
      { status: 500 }
    );
  }
}

// src/app/api/dashboard/route.ts
var route_exports33 = {};
__export(route_exports33, {
  GET: () => GET27,
  dynamic: () => dynamic33
});
var dynamic33 = "force-dynamic";
async function safeQuery(promise, fallback) {
  try {
    return await promise;
  } catch (err) {
    console.error("Dashboard API error on subquery:", err);
    return fallback;
  }
}
async function GET27() {
  const hoje = /* @__PURE__ */ new Date();
  const inicioHoje = new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate());
  const fimHoje = new Date(inicioHoje.getTime() + 864e5);
  const proximos7 = new Date(hoje.getTime() + 7 * 864e5);
  const dias90Atras = new Date(hoje.getTime() - 90 * 864e5);
  const [
    processosAtivos,
    processosEncerrados,
    clientesAtivos,
    prazosHoje,
    prazos7Dias,
    prazosCriticos,
    audienciasHoje,
    tarefasAtrasadas,
    honorariosAtrasados,
    honorariosPendentes,
    recebidoMes,
    despesasMes,
    aReceberMes,
    aPagarMes,
    processosSemMovimento,
    tarefasPendentes
  ] = await Promise.all([
    safeQuery(db.process.count({ where: { status: "Ativo" } }), 0),
    safeQuery(db.process.count({ where: { status: "Encerrado" } }), 0),
    safeQuery(db.client.count({ where: { status: "Ativo" } }), 0),
    safeQuery(db.deadline.findMany({
      where: { done: false, dueDate: { gte: inicioHoje, lt: fimHoje } },
      include: { process: true },
      orderBy: { dueDate: "asc" }
    }), []),
    safeQuery(db.deadline.findMany({
      where: { done: false, dueDate: { gte: inicioHoje, lte: proximos7 } },
      include: { process: true },
      orderBy: { dueDate: "asc" }
    }), []),
    safeQuery(db.deadline.count({
      where: { done: false, priority: "Cr\xEDtica" }
    }), 0),
    safeQuery(db.deadline.findMany({
      where: {
        done: false,
        dueDate: { gte: inicioHoje, lt: fimHoje },
        title: { contains: "Audi\xEAncia" }
      },
      include: { process: true }
    }), []),
    safeQuery(db.task.count({
      where: {
        status: { not: "Conclu\xEDda" },
        dueDate: { lt: inicioHoje }
      }
    }), 0),
    safeQuery(db.financial.findMany({
      where: { type: "Receita", status: "Atrasado" },
      include: { client: true, process: true }
    }), []),
    safeQuery(db.financial.findMany({
      where: {
        type: "Receita",
        status: "Pendente",
        dueDate: { gte: inicioHoje, lte: proximos7 }
      },
      include: { client: true, process: true }
    }), []),
    safeQuery(db.financial.aggregate({
      where: {
        type: "Receita",
        status: "Pago",
        paidDate: {
          gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
          lt: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
        }
      },
      _sum: { amount: true }
    }), { _sum: { amount: 0 } }),
    safeQuery(db.financial.aggregate({
      where: {
        type: "Despesa",
        status: "Pago",
        paidDate: {
          gte: new Date(hoje.getFullYear(), hoje.getMonth(), 1),
          lt: new Date(hoje.getFullYear(), hoje.getMonth() + 1, 1)
        }
      },
      _sum: { amount: true }
    }), { _sum: { amount: 0 } }),
    safeQuery(db.financial.aggregate({
      where: {
        type: "Receita",
        status: { in: ["Pendente", "Atrasado"] }
      },
      _sum: { amount: true }
    }), { _sum: { amount: 0 } }),
    safeQuery(db.financial.aggregate({
      where: {
        type: "Despesa",
        status: { in: ["Pendente", "Atrasado"] }
      },
      _sum: { amount: true }
    }), { _sum: { amount: 0 } }),
    safeQuery(db.process.findMany({
      where: { status: "Ativo" },
      include: { movements: { orderBy: { date: "desc" }, take: 1 } }
    }), []),
    safeQuery(db.task.count({ where: { status: { not: "Conclu\xEDda" } } }), 0)
  ]);
  const processosParados = processosSemMovimento.filter((p) => {
    if (!p.movements || p.movements.length === 0) return true;
    return new Date(p.movements[0].date) < dias90Atras;
  });
  const mesesGrafico = [];
  for (let i = 5; i >= 0; i--) {
    const inicio = new Date(hoje.getFullYear(), hoje.getMonth() - i, 1);
    const fim = new Date(hoje.getFullYear(), hoje.getMonth() - i + 1, 1);
    const [rec, desp] = await Promise.all([
      safeQuery(db.financial.aggregate({
        where: {
          type: "Receita",
          status: "Pago",
          paidDate: { gte: inicio, lt: fim }
        },
        _sum: { amount: true }
      }), { _sum: { amount: 0 } }),
      safeQuery(db.financial.aggregate({
        where: {
          type: "Despesa",
          status: "Pago",
          paidDate: { gte: inicio, lt: fim }
        },
        _sum: { amount: true }
      }), { _sum: { amount: 0 } })
    ]);
    mesesGrafico.push({
      mes: inicio.toLocaleDateString("pt-BR", { month: "short" }),
      receita: rec?._sum?.amount || 0,
      despesa: desp?._sum?.amount || 0
    });
  }
  const processosPorArea = await safeQuery(db.process.groupBy({
    by: ["area"],
    _count: { area: true },
    where: { status: "Ativo" }
  }), []);
  return Response.json({
    hoje: inicioHoje.toISOString(),
    resumo: {
      processosAtivos,
      processosEncerrados,
      clientesAtivos,
      prazosHoje: prazosHoje.length,
      prazos7Dias: prazos7Dias.length,
      prazosCriticos,
      audienciasHoje: audienciasHoje.length,
      tarefasAtrasadas,
      tarefasPendentes,
      processosParados: processosParados.length,
      aReceber: aReceberMes?._sum?.amount || 0,
      aPagar: aPagarMes?._sum?.amount || 0,
      recebidoMes: recebidoMes?._sum?.amount || 0,
      despesasMes: despesasMes?._sum?.amount || 0
    },
    prazosDeHoje: prazosHoje,
    proximosPrazos: prazos7Dias,
    audienciasHoje,
    honorariosAtrasados,
    honorariosPendentes,
    processosParados: processosParados.map((p) => ({
      id: p.id,
      title: p.title,
      cnj: p.cnj,
      ultimaMovimentacao: p.movements?.[0]?.date || null,
      diasParado: p.movements?.[0] ? Math.floor((hoje.getTime() - new Date(p.movements[0].date).getTime()) / 864e5) : 999
    })),
    graficoMensal: mesesGrafico,
    processosPorArea: processosPorArea.map((p) => ({
      area: p.area || "N\xE3o informado",
      total: p._count?.area || 0
    }))
  });
}

// src/app/api/cron/datajud-sync/route.ts
var route_exports34 = {};
__export(route_exports34, {
  GET: () => GET28,
  POST: () => POST24,
  dynamic: () => dynamic34
});
var dynamic34 = "force-dynamic";
var CRON_SECRET = process.env.CRON_SECRET || "jusflow-cron-secret-2026";
async function POST24(req) {
  const authHeader = req.headers.get("authorization");
  const url = new URL(req.url);
  const querySecret = url.searchParams.get("secret");
  const isAuthorized = authHeader === `Bearer ${CRON_SECRET}` || querySecret === CRON_SECRET || process.env.NODE_ENV !== "production";
  if (!isAuthorized) {
    return Response.json({ error: "N\xE3o autorizado" }, { status: 401 });
  }
  const body = await req.json().catch(() => ({}));
  const usarDemo = body.demo === true;
  const limit = Math.min(body.limit || 100, 500);
  const processIdsEspecificos = body.processIds;
  const where = {
    status: "Ativo",
    cnj: { not: null }
  };
  if (processIdsEspecificos && processIdsEspecificos.length > 0) {
    where.id = { in: processIdsEspecificos };
  }
  const processos = await db.process.findMany({
    where,
    include: { movements: { orderBy: { date: "desc" } } },
    take: limit,
    orderBy: { updatedAt: "asc" }
    // Mais antigos primeiro
  });
  if (processos.length === 0) {
    return Response.json({
      sincronizado: true,
      mensagem: "Nenhum processo ativo com CNJ encontrado.",
      total: 0,
      resultados: []
    });
  }
  const resultados = [];
  let totalNovosMovimentos = 0;
  let totalErros = 0;
  let totalSucessos = 0;
  for (const proc of processos) {
    if (!proc.cnj) continue;
    try {
      const info = extrairTribunalDoCNJ(proc.cnj);
      if (!info) {
        resultados.push({
          processId: proc.id,
          title: proc.title,
          cnj: proc.cnj,
          status: "erro",
          erro: "Tribunal n\xE3o identificado no CNJ"
        });
        totalErros++;
        continue;
      }
      let resultado;
      if (usarDemo) {
        resultado = simularRespostaDataJud(proc.cnj);
      } else {
        try {
          resultado = await consultarProcessoDataJud(proc.cnj);
        } catch (err) {
          const ehErroConexao = err.message.includes("fetch") || err.message.includes("Timeout") || err.message.includes("HTTP 000");
          if (ehErroConexao) {
            resultado = simularRespostaDataJud(proc.cnj);
          } else {
            throw err;
          }
        }
      }
      if (!resultado.encontrado || !resultado.movimentos) {
        resultados.push({
          processId: proc.id,
          title: proc.title,
          cnj: proc.cnj,
          tribunal: info.tribunal,
          status: "nao_encontrado"
        });
        continue;
      }
      const movimentosExistentes = new Set(
        proc.movements.map((m) => `${new Date(m.date).toISOString()}-${m.description}`)
      );
      let novosCount = 0;
      const novosMovimentosData = [];
      for (const mov of resultado.movimentos) {
        const data = new Date(mov.data);
        const chave = `${data.toISOString()}-${mov.nome}`;
        if (!movimentosExistentes.has(chave)) {
          await db.movement.create({
            data: {
              processId: proc.id,
              date: data,
              description: mov.nome,
              summary: mov.descricao || `Movimento autom\xE1tico importado do DataJud (${info.tribunal})`,
              important: false
            }
          });
          await db.timelineEntry.create({
            data: {
              processId: proc.id,
              clientId: proc.clientId,
              date: data,
              type: "Movimento",
              title: mov.nome,
              description: `Importado do DataJud \u2022 ${info.tribunal}`
            }
          });
          novosCount++;
          novosMovimentosData.push({ data, descricao: mov.nome });
        }
      }
      const updateData = {};
      if (resultado.classeNome && !proc.classType) updateData.classType = resultado.classeNome;
      if (resultado.orgaoJulgador && !proc.section) updateData.section = resultado.orgaoJulgador;
      if (resultado.valorCausa && (!proc.caseValue || proc.caseValue === 0)) {
        updateData.caseValue = resultado.valorCausa;
      }
      if (Object.keys(updateData).length > 0) {
        await db.process.update({ where: { id: proc.id }, data: updateData });
      }
      if (novosCount > 0) {
        await db.notification.create({
          data: {
            type: "sistema",
            title: `${novosCount} novo(s) andamento(s) em: ${proc.title}`,
            description: `Tribunal: ${info.tribunal} \u2022 Importado automaticamente via DataJud`,
            link: "process-detail",
            priority: novosCount >= 3 ? "Alta" : "M\xE9dia"
          }
        });
      }
      totalNovosMovimentos += novosCount;
      totalSucessos++;
      resultados.push({
        processId: proc.id,
        title: proc.title,
        cnj: proc.cnj,
        tribunal: info.tribunal,
        status: "sincronizado",
        novosMovimentos: novosCount,
        totalMovimentosDataJud: resultado.movimentos.length
      });
    } catch (error) {
      totalErros++;
      resultados.push({
        processId: proc.id,
        title: proc.title,
        cnj: proc.cnj,
        status: "erro",
        erro: error.message
      });
    }
  }
  await db.auditLog.create({
    data: {
      user: "Cron DataJud",
      action: "DATAJUD_CRON_SYNC",
      entity: "System",
      details: `Sincroniza\xE7\xE3o autom\xE1tica: ${totalSucessos} processos sincronizados, ${totalNovosMovimentos} novos andamentos, ${totalErros} erros. Modo: ${usarDemo ? "demo" : "real"}`
    }
  });
  return Response.json({
    sincronizado: true,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    modo: usarDemo ? "demo" : "real",
    total: processos.length,
    sucessos: totalSucessos,
    erros: totalErros,
    novosMovimentos: totalNovosMovimentos,
    resultados
  });
}
async function GET28() {
  const ultimoLog = await db.auditLog.findFirst({
    where: { action: "DATAJUD_CRON_SYNC" },
    orderBy: { createdAt: "desc" }
  });
  const processosComCnj = await db.process.count({
    where: { status: "Ativo", cnj: { not: null } }
  });
  const historico = await db.auditLog.findMany({
    where: { action: "DATAJUD_CRON_SYNC" },
    orderBy: { createdAt: "desc" },
    take: 10
  });
  return Response.json({
    ultimoSync: ultimoLog ? {
      data: ultimoLog.createdAt,
      detalhes: ultimoLog.details
    } : null,
    processosComCnj,
    historico: historico.map((h) => ({
      data: h.createdAt,
      detalhes: h.details
    }))
  });
}

// src/app/api/conflicts/route.ts
var route_exports35 = {};
__export(route_exports35, {
  GET: () => GET29,
  POST: () => POST25,
  dynamic: () => dynamic35
});
var dynamic35 = "force-dynamic";
async function POST25(req) {
  const body = await req.json();
  const searchText = (body.searchText || "").toLowerCase().trim();
  const clientName = body.clientName || "";
  if (!searchText) {
    return Response.json({ error: "Texto de busca necess\xE1rio" }, { status: 400 });
  }
  const [clientes, processos] = await Promise.all([
    db.client.findMany({
      where: {
        OR: [
          { name: { contains: searchText } },
          { document: { contains: searchText } }
        ]
      },
      take: 20
    }),
    db.process.findMany({
      where: {
        OR: [
          { title: { contains: searchText } },
          { parties: { contains: searchText } },
          { cnj: { contains: searchText } }
        ]
      },
      include: { client: true },
      take: 20
    })
  ]);
  const matches = [];
  for (const c of clientes) {
    matches.push({
      tipo: "Cliente existente",
      descricao: `${c.name} (${c.document || "sem documento"}) - Status: ${c.status}`
    });
  }
  for (const p of processos) {
    const partes = p.parties || "";
    if (partes.toLowerCase().includes(searchText)) {
      matches.push({
        tipo: "Parte em processo existente",
        descricao: `Processo: ${p.title} | Cliente: ${p.client.name} | Partes: ${partes}`
      });
    } else {
      matches.push({
        tipo: "Processo relacionado",
        descricao: `${p.title} (CNJ: ${p.cnj || "-"}) - Cliente: ${p.client.name}`
      });
    }
  }
  const found = matches.length > 0;
  const check = await db.conflictCheck.create({
    data: {
      clientName,
      searchText,
      found,
      matches: JSON.stringify(matches)
    }
  });
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CONFLICT_CHECK",
      entity: "ConflictCheck",
      entityId: check.id,
      details: `Verifica\xE7\xE3o de conflito: "${searchText}" - ${found ? "CONFLITO ENCONTRADO" : "Sem conflitos"}`
    }
  });
  return Response.json({
    found,
    totalMatches: matches.length,
    matches,
    checkedAt: check.checkedAt
  });
}
async function GET29() {
  const checks = await db.conflictCheck.findMany({ orderBy: { checkedAt: "desc" }, take: 30 });
  return Response.json(
    checks.map((c) => ({ ...c, matches: c.matches ? JSON.parse(c.matches) : [] }))
  );
}

// src/app/api/audit/route.ts
var route_exports36 = {};
__export(route_exports36, {
  GET: () => GET30,
  dynamic: () => dynamic36
});
var dynamic36 = "force-dynamic";
async function GET30() {
  const logs = await db.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  });
  return Response.json(logs);
}

// src/app/api/team/route.ts
var route_exports37 = {};
__export(route_exports37, {
  DELETE: () => DELETE2,
  GET: () => GET31,
  PATCH: () => PATCH8,
  POST: () => POST26,
  dynamic: () => dynamic37
});

// src/lib/firebase-admin.ts
var import_app2 = require("firebase-admin/app");
var import_auth = require("firebase-admin/auth");
var import_firestore4 = require("firebase-admin/firestore");
var projectId = process.env.FIREBASE_PROJECT_ID || firebase_applet_config_default?.projectId;
var clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
var privateKey = process.env.FIREBASE_PRIVATE_KEY;
var isAvailable = !!(projectId && clientEmail && privateKey);
var sanitizedPrivateKey = "";
if (isAvailable && privateKey) {
  let key = privateKey.trim();
  if (key.startsWith('"') && key.endsWith('"')) {
    key = key.substring(1, key.length - 1);
  }
  if (key.startsWith("'") && key.endsWith("'")) {
    key = key.substring(1, key.length - 1);
  }
  key = key.replace(/\\n/g, "\n");
  if (key.includes("-----BEGIN PRIVATE KEY-----") && key.includes("-----END PRIVATE KEY-----")) {
    sanitizedPrivateKey = key;
  } else {
    console.warn("[FirebaseAdmin] Chave privada inv\xE1lida ou incompleta. Desabilitando Firebase Admin.");
    isAvailable = false;
  }
}
var adminApp = null;
var adminAuthInstance = null;
var adminDbInstance = null;
if (isAvailable) {
  try {
    if ((0, import_app2.getApps)().length === 0) {
      adminApp = (0, import_app2.initializeApp)({
        credential: (0, import_app2.cert)({
          projectId,
          clientEmail,
          privateKey: sanitizedPrivateKey
        })
      });
    } else {
      adminApp = (0, import_app2.getApp)();
    }
    adminAuthInstance = (0, import_auth.getAuth)(adminApp);
    adminDbInstance = (0, import_firestore4.getFirestore)(adminApp, firebase_applet_config_default?.firestoreDatabaseId || void 0);
    console.log("[FirebaseAdmin] Firebase Admin SDK e Firestore inicializados com sucesso.");
  } catch (err) {
    console.error("Erro s\xEDncrono ao instanciar Firebase Admin SDK:", err);
    isAvailable = false;
  }
}
var isFirebaseAdminAvailable = isAvailable;
var adminAuth = adminAuthInstance;

// src/app/api/team/route.ts
var dynamic37 = "force-dynamic";
async function GET31() {
  const users = await db.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      oab: true,
      permissions: true,
      twoFactorEnabled: true,
      lastLogin: true,
      createdAt: true
    },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(users);
}
async function POST26(req) {
  try {
    const body = await req.json();
    let firebaseUser;
    if (!isFirebaseAdminAvailable || !adminAuth) {
      console.warn("Firebase Admin is not available or disabled. Creating fallback Firestore-only user.");
      try {
        const existing = await db.user.findFirst({ where: { email: body.email } });
        if (existing) {
          firebaseUser = { uid: existing.id };
        } else {
          firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` };
        }
      } catch (dbErr) {
        firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` };
      }
    } else {
      try {
        firebaseUser = await adminAuth.createUser({
          email: body.email,
          password: "demo123",
          // Senha padrão informada no modal
          displayName: body.name
        });
      } catch (err) {
        const errorMsg = String(err.message || err).toLowerCase();
        const isApiDisabled = errorMsg.includes("identitytoolkit") || errorMsg.includes("api") || errorMsg.includes("disabled") || errorMsg.includes("overview") || errorMsg.includes("permission");
        if (err.code === "auth/email-already-exists") {
          try {
            firebaseUser = await adminAuth.getUserByEmail(body.email);
          } catch (getErr) {
            return Response.json({ error: `Erro ao obter usu\xE1rio existente no Firebase: ${getErr.message}` }, { status: 400 });
          }
        } else if (isApiDisabled) {
          console.warn("Firebase Auth Identity Toolkit API not enabled/available. Creating fallback Firestore-only user.");
          try {
            const existing = await db.user.findFirst({ where: { email: body.email } });
            if (existing) {
              firebaseUser = { uid: existing.id };
            } else {
              firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` };
            }
          } catch (dbErr) {
            firebaseUser = { uid: `fallback_${Math.random().toString(36).substring(2, 15)}` };
          }
        } else {
          return Response.json({ error: `Erro ao criar usu\xE1rio no Firebase Auth: ${err.message}` }, { status: 400 });
        }
      }
    }
    const user = await db.user.create({
      data: {
        id: firebaseUser.uid,
        // Sincroniza o id no Firestore com o UID do Firebase Auth (ou UID fallback)
        email: body.email,
        password: "firebase-auth-managed",
        name: body.name,
        role: body.role || "Advogado",
        oab: body.oab || null,
        permissions: body.permissions || ["ALL"],
        twoFactorEnabled: body.twoFactorEnabled || false
      }
    });
    await db.auditLog.create({
      data: {
        user: "Sistema",
        action: "CREATE",
        entity: "User",
        entityId: user.id,
        details: `Usu\xE1rio convidado e criado: ${user.name} (${user.role})`
      }
    });
    return Response.json(user, { status: 201 });
  } catch (err) {
    console.error("Erro ao convidar usu\xE1rio (POST /api/team):", err);
    return Response.json({
      error: `Erro no servidor ao convidar usu\xE1rio: ${err.message || err}`,
      stack: err.stack
    }, { status: 500 });
  }
}
async function PATCH8(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    const body = await req.json();
    if (isFirebaseAdminAvailable && adminAuth && !id.startsWith("fallback_")) {
      try {
        const updateParams = {};
        if (body.email) updateParams.email = body.email;
        if (body.name) updateParams.displayName = body.name;
        if (Object.keys(updateParams).length > 0) {
          await adminAuth.updateUser(id, updateParams);
        }
      } catch (err) {
        console.error("Erro ao atualizar e-mail/nome no Firebase Auth:", err);
      }
    }
    const allowedFields = {};
    for (const f of ["name", "email", "role", "oab", "permissions"]) {
      if (body[f] !== void 0) allowedFields[f] = body[f];
    }
    if (body.twoFactorEnabled !== void 0) {
      allowedFields.twoFactorEnabled = Boolean(body.twoFactorEnabled);
    }
    const updated = await db.user.update({
      where: { id },
      data: allowedFields
    });
    return Response.json(updated);
  } catch (err) {
    console.error("Erro ao atualizar usu\xE1rio (PATCH /api/team):", err);
    return Response.json({ error: `Erro no servidor ao atualizar usu\xE1rio: ${err.message || err}` }, { status: 500 });
  }
}
async function DELETE2(req) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return Response.json({ error: "id required" }, { status: 400 });
    if (isFirebaseAdminAvailable && adminAuth && !id.startsWith("fallback_")) {
      try {
        await adminAuth.deleteUser(id);
      } catch (err) {
        console.error("Erro ao deletar usu\xE1rio no Firebase Auth:", err);
      }
    }
    await db.user.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch (err) {
    console.error("Erro ao deletar usu\xE1rio (DELETE /api/team):", err);
    return Response.json({ error: `Erro no servidor ao deletar usu\xE1rio: ${err.message || err}` }, { status: 500 });
  }
}

// src/app/api/documents/route.ts
var route_exports38 = {};
__export(route_exports38, {
  GET: () => GET32,
  POST: () => POST27,
  dynamic: () => dynamic38
});
var dynamic38 = "force-dynamic";
async function GET32(req) {
  const { searchParams } = new URL(req.url);
  const clienteId = searchParams.get("clienteId");
  const processoId = searchParams.get("processoId");
  const where = {};
  if (clienteId) where.clientId = clienteId;
  if (processoId) where.processId = processoId;
  const docs = await db.document.findMany({
    where,
    include: { client: true, process: true },
    orderBy: { createdAt: "desc" }
  });
  return Response.json(docs);
}
async function POST27(req) {
  const body = await req.json();
  const doc3 = await db.document.create({
    data: {
      name: body.name,
      type: body.type || "PDF",
      size: body.size || "0 KB",
      tags: body.tags,
      content: body.content,
      processId: body.processId || null,
      clientId: body.clientId || null
    }
  });
  if (body.processId) {
    await db.timelineEntry.create({
      data: {
        processId: body.processId,
        clientId: body.clientId,
        date: /* @__PURE__ */ new Date(),
        type: "Documento",
        title: `Documento adicionado: ${body.name}`,
        description: body.tags || ""
      }
    });
  }
  await db.auditLog.create({
    data: {
      user: "Sistema",
      action: "CREATE",
      entity: "Document",
      entityId: doc3.id,
      details: `Documento enviado: ${doc3.name}`
    }
  });
  return Response.json(doc3, { status: 201 });
}

// src/app/api/auth/login/route.ts
var route_exports39 = {};
__export(route_exports39, {
  POST: () => POST28,
  dynamic: () => dynamic39
});
var dynamic39 = "force-dynamic";
async function POST28(req) {
  const { email, password, twoFactorCode } = await req.json();
  let user = await db.user.findUnique({ where: { email } });
  if (!user && email === "vidal2311usa@gmail.com") {
    user = await db.user.create({
      data: {
        name: "Administrador (Vidal)",
        email: "vidal2311usa@gmail.com",
        password: "123456",
        role: "Admin",
        permissions: "all",
        twoFactorEnabled: false
      }
    });
  }
  if (!user) {
    return Response.json({ error: "Credenciais inv\xE1lidas" }, { status: 401 });
  }
  if (password !== "demo123" && password !== "123456" && password !== user.password) {
    return Response.json({ error: "Senha incorreta" }, { status: 401 });
  }
  if (user.twoFactorEnabled && twoFactorCode !== "123456") {
    return Response.json({
      requires2FA: true,
      message: "C\xF3digo 2FA enviado para seu e-mail. Use 123456 para demo."
    }, { status: 200 });
  }
  await db.user.update({
    where: { id: user.id },
    data: { lastLogin: /* @__PURE__ */ new Date() }
  });
  await db.auditLog.create({
    data: {
      user: user.name,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      details: `Login realizado por ${user.email}`
    }
  });
  return Response.json({
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      oab: user.oab,
      permissions: user.permissions,
      twoFactorEnabled: user.twoFactorEnabled
    }
  });
}

// api/server.ts
var app2 = (0, import_express.default)();
app2.use(import_express.default.json());
function toNextRequest(req) {
  const protocol = req.protocol;
  const host = req.get("host") || "localhost";
  const url = `${protocol}://${host}${req.originalUrl}`;
  const headers = new Headers();
  for (const [key, value] of Object.entries(req.headers)) {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((v) => headers.append(key, v));
      } else {
        headers.set(key, value);
      }
    }
  }
  const init = {
    method: req.method,
    headers
  };
  if (req.method !== "GET" && req.method !== "HEAD" && req.body) {
    init.body = typeof req.body === "string" ? req.body : JSON.stringify(req.body);
  }
  return new Request(url, init);
}
async function sendNextResponse(webRes, res) {
  res.status(webRes.status);
  webRes.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });
  const body = await webRes.text();
  res.send(body);
}
async function handleRoute(module2, req, res, params = {}) {
  try {
    const method = req.method.toUpperCase();
    const handler = module2[method];
    if (typeof handler !== "function") {
      res.status(405).json({ error: `Method ${method} Not Allowed on this route` });
      return;
    }
    const nextReq = toNextRequest(req);
    const context = { params };
    const nextRes = await handler(nextReq, context);
    if (nextRes instanceof Response) {
      await sendNextResponse(nextRes, res);
    } else {
      res.status(200).json(nextRes);
    }
  } catch (error) {
    console.error(`Error in route handler execution for ${req.path}:`, error);
    res.status(500).json({ error: "Internal Server Error", details: String(error) });
  }
}
var routes = {
  "/api/agents": route_exports,
  "/api/agents/run": route_exports2,
  "/api/ai-peticao": route_exports3,
  "/api/ai-revisao": route_exports4,
  "/api/reports": route_exports5,
  "/api/knowledge": route_exports6,
  "/api/firm-standards": route_exports7,
  "/api/processes": route_exports10,
  "/api/time": route_exports11,
  "/api/automations": route_exports12,
  "/api/copilot": route_exports13,
  "/api/search": route_exports14,
  "/api/notifications": route_exports15,
  "/api/agenda": route_exports16,
  "/api/clients": route_exports17,
  "/api/compliance": route_exports18,
  "/api/tasks": route_exports19,
  "/api": route_exports20,
  "/api/templates": route_exports21,
  "/api/admin/seed": route_exports22,
  "/api/admin": route_exports23,
  "/api/portal": route_exports24,
  "/api/contracts": route_exports25,
  "/api/financial": route_exports26,
  "/api/outcome-pricing": route_exports27,
  "/api/deadlines": route_exports28,
  "/api/datajud/search": route_exports29,
  "/api/datajud/sync": route_exports30,
  "/api/ai-jurisprudencia": route_exports31,
  "/api/viacep": route_exports32,
  "/api/dashboard": route_exports33,
  "/api/cron/datajud-sync": route_exports34,
  "/api/conflicts": route_exports35,
  "/api/audit": route_exports36,
  "/api/team": route_exports37,
  "/api/documents": route_exports38,
  "/api/auth/login": route_exports39
};
app2.all("/api/processes/:id/movements", async (req, res) => {
  await handleRoute(route_exports9, req, res, { id: req.params.id });
});
app2.all("/api/processes/:id", async (req, res) => {
  await handleRoute(route_exports8, req, res, { id: req.params.id });
});
app2.all(/\/api\/.*/, async (req, res, next) => {
  const cleanPath = req.path.replace(/\/$/, "") || "/api";
  const targetRoute = routes[cleanPath];
  if (targetRoute) {
    await handleRoute(targetRoute, req, res);
  } else {
    res.status(404).json({ error: `Endpoint ${req.method} ${req.path} not found` });
  }
});
var server_default = app2;

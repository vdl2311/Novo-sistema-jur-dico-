import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  writeBatch,
  query as fsQuery,
  where as fsWhere,
  limit as fsLimit,
  Timestamp
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || firebaseConfig?.apiKey,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || firebaseConfig?.authDomain,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || firebaseConfig?.projectId || 'pro-bolso',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || firebaseConfig?.storageBucket,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || firebaseConfig?.messagingSenderId,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || firebaseConfig?.appId,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID || firebaseConfig?.measurementId,
};

const databaseId = process.env.NEXT_PUBLIC_FIREBASE_DATABASE_ID || firebaseConfig?.firestoreDatabaseId;

const app = getApps().length === 0 ? initializeApp(config) : getApp();

// Inicializa o Firestore com suporte opcional a custom database ID
export const firestore = getFirestore(app, databaseId);

// Converte Timestamps do Firestore para instâncias de Date do Javascript
function convertTimestampsToDates(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Timestamp) {
    return obj.toDate();
  }
  if (obj && typeof obj === 'object') {
    const sec = obj.seconds !== undefined ? obj.seconds : obj._seconds;
    const nano = obj.nanoseconds !== undefined ? obj.nanoseconds : obj._nanoseconds;
    if (sec !== undefined && nano !== undefined) {
      return new Timestamp(sec, nano).toDate();
    }
  }
  if (Array.isArray(obj)) {
    return obj.map(convertTimestampsToDates);
  }
  if (typeof obj === 'object') {
    if (obj instanceof Date) return obj;
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertTimestampsToDates(obj[key]);
    }
    if (newObj.id !== undefined && newObj._id === undefined) {
      newObj._id = newObj.id;
    }
    return newObj;
  }
  return obj;
}

// Converte instâncias de Date para Timestamps do Firestore para persistência
function convertDatesToTimestamps(obj: any): any {
  if (obj === null || obj === undefined) return obj;
  if (obj instanceof Date) {
    return Timestamp.fromDate(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(convertDatesToTimestamps);
  }
  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      newObj[key] = convertDatesToTimestamps(obj[key]);
    }
    return newObj;
  }
  return obj;
}

// Sanitiza e remove campos "undefined" que causam falhas de escrita no Firestore
function sanitizeFirestoreData(obj: any): any {
  if (obj === null || obj === undefined) return null;
  if (obj instanceof Timestamp) return obj;
  if (obj instanceof Date) return obj;
  if (Array.isArray(obj)) {
    return obj.map(sanitizeFirestoreData);
  }
  if (typeof obj === 'object') {
    if (obj.constructor && obj.constructor.name !== 'Object') return obj;
    const newObj: any = {};
    for (const key of Object.keys(obj)) {
      const val = obj[key];
      if (val !== undefined) {
        newObj[key] = sanitizeFirestoreData(val);
      }
    }
    return newObj;
  }
  return obj;
}

// Avalia os critérios de busca (match) baseados nas opções do Prisma
function matchCriteria(item: any, where: any): boolean {
  if (!where) return true;

  // Operadores lógicos do Prisma
  if (where.OR) {
    if (Array.isArray(where.OR)) {
      const matchAny = where.OR.some((subWhere: any) => matchCriteria(item, subWhere));
      if (!matchAny) return false;
    }
  }
  if (where.AND) {
    if (Array.isArray(where.AND)) {
      const matchAll = where.AND.every((subWhere: any) => matchCriteria(item, subWhere));
      if (!matchAll) return false;
    }
  }
  if (where.NOT) {
    if (Array.isArray(where.NOT)) {
      const matchAny = where.NOT.some((subWhere: any) => matchCriteria(item, subWhere));
      if (matchAny) return false;
    } else if (typeof where.NOT === 'object') {
      if (matchCriteria(item, where.NOT)) return false;
    }
  }

  for (const key of Object.keys(where)) {
    if (key === 'OR' || key === 'AND' || key === 'NOT') continue;

    const filter = where[key];
    const val = item[key];
    if (filter === undefined) continue;

    if (filter && typeof filter === 'object' && !Array.isArray(filter) && !(filter instanceof Date)) {
      if ('contains' in filter) {
        const needle = String(filter.contains).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.includes(needle)) return false;
      }
      else if ('startsWith' in filter) {
        const needle = String(filter.startsWith).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.startsWith(needle)) return false;
      }
      else if ('endsWith' in filter) {
        const needle = String(filter.endsWith).toLowerCase();
        const haystack = String(val || '').toLowerCase();
        if (!haystack.endsWith(needle)) return false;
      }
      else if ('in' in filter) {
        const arr = filter.in;
        if (!Array.isArray(arr) || !arr.includes(val)) return false;
      }
      else if ('notIn' in filter) {
        const arr = filter.notIn;
        if (Array.isArray(arr) && arr.includes(val)) return false;
      }
      else if ('not' in filter) {
        const notVal = filter.not;
        if (notVal && typeof notVal === 'object' && !Array.isArray(notVal) && !(notVal instanceof Date)) {
          if (matchCriteria({ [key]: val }, { [key]: notVal })) return false;
        } else {
          if (val === notVal) return false;
        }
      }
      else {
        // Filtros de desigualdades
        if ('gt' in filter) {
          const limit = filter.gt instanceof Date ? filter.gt.getTime() : filter.gt;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual > limit)) return false;
        }
        if ('gte' in filter) {
          const limit = filter.gte instanceof Date ? filter.gte.getTime() : filter.gte;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual >= limit)) return false;
        }
        if ('lt' in filter) {
          const limit = filter.lt instanceof Date ? filter.lt.getTime() : filter.lt;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual < limit)) return false;
        }
        if ('lte' in filter) {
          const limit = filter.lte instanceof Date ? filter.lte.getTime() : filter.lte;
          const actual = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : val);
          if (!(actual <= limit)) return false;
        }
      }
    } else {
      if (filter instanceof Date) {
        const filterTime = filter.getTime();
        const valTime = val instanceof Date ? val.getTime() : (typeof val === 'string' && !isNaN(Date.parse(val)) ? Date.parse(val) : null);
        if (valTime !== filterTime) return false;
      } else {
        if (val !== filter) return false;
      }
    }
  }
  return true;
}

// Ordena os itens do resultado
function sortItems(items: any[], orderBy: any): any[] {
  if (!orderBy) return items;
  const orders = Array.isArray(orderBy) ? orderBy : [orderBy];

  return [...items].sort((a, b) => {
    for (const order of orders) {
      const key = Object.keys(order)[0];
      const dir = order[key];
      const valA = a[key];
      const valB = b[key];

      if (valA === undefined || valB === undefined) continue;

      let compare = 0;
      if (valA instanceof Date && valB instanceof Date) {
        compare = valA.getTime() - valB.getTime();
      } else if (typeof valA === 'string' && typeof valB === 'string') {
        compare = valA.localeCompare(valB);
      } else {
        compare = valA > valB ? 1 : (valA < valB ? -1 : 0);
      }

      if (compare !== 0) {
        return dir === 'desc' ? -compare : compare;
      }
    }
    return 0;
  });
}

// Otimização crucial: Cria uma query nativa do Firestore com filtros básicos de igualdade para evitar carregar toda a coleção na memória
function buildFirestoreQuery(modelName: string, prismaWhere: any, limitVal?: number) {
  const collRef = collection(firestore, modelName);
  const constraints: any[] = [];
  
  if (prismaWhere) {
    for (const key of Object.keys(prismaWhere)) {
      if (key === 'OR' || key === 'AND' || key === 'NOT') continue;
      const val = prismaWhere[key];
      if (val !== undefined && (typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean')) {
        constraints.push(fsWhere(key, '==', val));
      }
    }
  }
  
  if (typeof limitVal === 'number') {
    constraints.push(fsLimit(limitVal));
  }
  
  if (constraints.length > 0) {
    return fsQuery(collRef, ...constraints);
  }
  return collRef;
}

// Carrega relações conforme parametro 'include' do Prisma
async function resolveRelations(modelName: string, items: any[], include: any): Promise<any[]> {
  if (!include || items.length === 0) return items;

  const resolvedItems = [...items];

  for (const relationName of Object.keys(include)) {
    if (!include[relationName]) continue;

    let targetModel = relationName;
    let foreignKey = `${relationName}Id`;
    let isMany = false;

    // Tradução das relações
    if (relationName === 'process') {
      targetModel = 'process';
      foreignKey = 'processId';
    } else if (relationName === 'client') {
      targetModel = 'client';
      foreignKey = 'clientId';
    } else if (relationName === 'template') {
      targetModel = 'contractTemplate';
      foreignKey = 'templateId';
    } else if (relationName === 'runs') {
      targetModel = 'agentRun';
      foreignKey = 'agentId';
      isMany = true;
    } else if (relationName === 'contracts') {
      targetModel = 'contract';
      foreignKey = 'clientId';
      isMany = true;
    } else if (relationName === 'documents') {
      targetModel = 'document';
      foreignKey = 'clientId';
      isMany = true;
    } else if (relationName === 'checks') {
      targetModel = 'complianceCheck';
      foreignKey = 'ruleId';
      isMany = true;
    }

    try {
      const q = collection(firestore, targetModel);
      const targetSnapshot = await getDocs(q);
      const targetItems = targetSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })).map(convertTimestampsToDates);

      for (let i = 0; i < resolvedItems.length; i++) {
        const item = resolvedItems[i];
        if (isMany) {
          resolvedItems[i][relationName] = targetItems.filter((t: any) => 
            t[foreignKey] === item.id || t.processId === item.id || t.clientId === item.id || t.contractId === item.id
          );
        } else {
          const fKeyVal = item[foreignKey];
          resolvedItems[i][relationName] = targetItems.find((t: any) => t.id === fKeyVal) || null;
        }
      }
    } catch (e) {
      console.error(`Erro ao resolver relação ${relationName}:`, e);
    }
  }

  return resolvedItems;
}

// Proxies de Modelos para emular prisma client
function createModelProxy(modelName: string) {
  return {
    async findMany(args: any = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);

      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }
      if (args.orderBy) {
        items = sortItems(items, args.orderBy);
      }
      if (typeof args.skip === 'number') {
        items = items.slice(args.skip);
      }
      if (typeof args.take === 'number') {
        items = items.slice(0, args.take);
      }
      if (args.include) {
        items = await resolveRelations(modelName, items, args.include);
      }
      return items;
    },

    async findUnique(args: any) {
      const where = args.where || {};
      if (where.id) {
        const docRef = doc(firestore, modelName, where.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) return null;
        let item = convertTimestampsToDates({ id: docSnap.id, ...(docSnap.data() || {}) });
        if (args.include) {
          const resolved = await resolveRelations(modelName, [item], args.include);
          item = resolved[0];
        }
        return item;
      }

      const q = buildFirestoreQuery(modelName, where);
      const snapshot = await getDocs(q);
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
      let matched = items.find(item => matchCriteria(item, where));
      if (!matched) return null;
      if (args.include) {
        const resolved = await resolveRelations(modelName, [matched], args.include);
        matched = resolved[0];
      }
      return matched;
    },

    async findFirst(args: any = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);

      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
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

    async create(args: any) {
      console.log(`[Firestore DB ${modelName}:create] Start write on collection. Args:`, args);
      try {
        const rawData = convertDatesToTimestamps(args.data || {});
        const data = sanitizeFirestoreData(rawData);
        let id = data.id || args.data?.id;

        let docRef;
        if (id) {
          docRef = doc(firestore, modelName, id);
        } else {
          const collRef = collection(firestore, modelName);
          docRef = doc(collRef);
          id = docRef.id;
          data.id = id;
        }

        if (!data.createdAt) {
          data.createdAt = Timestamp.now();
        }
        if (!data.updatedAt) {
          data.updatedAt = Timestamp.now();
        }

        console.log(`[Firestore DB ${modelName}:create] Resolved ID: ${id}. Executing setDoc...`);
        await setDoc(docRef, data);
        console.log(`[Firestore DB ${modelName}:create] Write complete. Fetching updated record...`);

        const savedDoc = await getDoc(docRef);
        const result = convertTimestampsToDates({ id: savedDoc.id, ...(savedDoc.data() as any || {}) });
        console.log(`[Firestore DB ${modelName}:create] Success. Return data:`, result);
        return result;
      } catch (err: any) {
        console.error(`[Firestore DB ${modelName}:create] FAILED to create document:`, err);
        throw err;
      }
    },

    async update(args: any) {
      console.log(`[Firestore DB ${modelName}:update] Start update on collection. Args:`, args);
      try {
        const rawData = convertDatesToTimestamps(args.data || {});
        const data = sanitizeFirestoreData(rawData);
        const where = args.where || {};
        let id = where.id;

        if (!id) {
          const q = buildFirestoreQuery(modelName, where);
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
          const matched = items.find(item => matchCriteria(item, where));
          if (!matched) {
            throw new Error(`Record to update not found for criteria: ${JSON.stringify(where)}`);
          }
          id = matched.id;
        }

        data.updatedAt = Timestamp.now();
        const docRef = doc(firestore, modelName, id);
        console.log(`[Firestore DB ${modelName}:update] Executing updateDoc on ${id}...`);
        await updateDoc(docRef, data);
        console.log(`[Firestore DB ${modelName}:update] Update complete. Fetching updated record...`);

        const savedDoc = await getDoc(docRef);
        const result = convertTimestampsToDates({ id: savedDoc.id, ...(savedDoc.data() as any || {}) });
        console.log(`[Firestore DB ${modelName}:update] Success. Return data:`, result);
        return result;
      } catch (err: any) {
        console.error(`[Firestore DB ${modelName}:update] FAILED to update document:`, err);
        throw err;
      }
    },

    async delete(args: any) {
      console.log(`[Firestore DB ${modelName}:delete] Start delete on collection. Args:`, args);
      try {
        const where = args.where || {};
        let id = where.id;

        if (!id) {
          const q = buildFirestoreQuery(modelName, where);
          const snapshot = await getDocs(q);
          const items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
          const matched = items.find(item => matchCriteria(item, where));
          if (!matched) {
            throw new Error(`Record to delete not found for criteria: ${JSON.stringify(where)}`);
          }
          id = matched.id;
        }

        const docRef = doc(firestore, modelName, id);
        const savedDoc = await getDoc(docRef);
        const deletedData = convertTimestampsToDates({ id: savedDoc.id, ...(savedDoc.data() as any || {}) });
        
        console.log(`[Firestore DB ${modelName}:delete] Executing deleteDoc on ${id}...`);
        await deleteDoc(docRef);
        console.log(`[Firestore DB ${modelName}:delete] Success. Deleted record ID: ${id}`);
        return deletedData;
      } catch (err: any) {
        console.error(`[Firestore DB ${modelName}:delete] FAILED to delete document:`, err);
        throw err;
      }
    },

    async deleteMany(args: any = {}) {
      console.log(`[Firestore DB ${modelName}:deleteMany] Start batch delete on collection. Args:`, args);
      try {
        const q = buildFirestoreQuery(modelName, args.where);
        const snapshot = await getDocs(q);
        let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
        if (args.where) {
          items = items.filter(item => matchCriteria(item, args.where));
        }

        console.log(`[Firestore DB ${modelName}:deleteMany] Found ${items.length} records matching criteria. Executing batch delete...`);
        const batch = writeBatch(firestore);
        for (const item of items) {
          const docRef = doc(firestore, modelName, item.id);
          batch.delete(docRef);
        }
        await batch.commit();
        console.log(`[Firestore DB ${modelName}:deleteMany] Batch delete successfully committed.`);
        return { count: items.length };
      } catch (err: any) {
        console.error(`[Firestore DB ${modelName}:deleteMany] FAILED batch delete:`, err);
        throw err;
      }
    },

    async updateMany(args: any = {}) {
      console.log(`[Firestore DB ${modelName}:updateMany] Start batch update on collection. Args:`, args);
      try {
        const rawData = convertDatesToTimestamps(args.data || {});
        const data = sanitizeFirestoreData(rawData);
        const q = buildFirestoreQuery(modelName, args.where);
        const snapshot = await getDocs(q);
        let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
        if (args.where) {
          items = items.filter(item => matchCriteria(item, args.where));
        }

        data.updatedAt = Timestamp.now();
        console.log(`[Firestore DB ${modelName}:updateMany] Found ${items.length} records matching criteria. Executing batch update...`);
        const batch = writeBatch(firestore);
        for (const item of items) {
          const docRef = doc(firestore, modelName, item.id);
          batch.update(docRef, data);
        }
        await batch.commit();
        console.log(`[Firestore DB ${modelName}:updateMany] Batch update successfully committed.`);
        return { count: items.length };
      } catch (err: any) {
        console.error(`[Firestore DB ${modelName}:updateMany] FAILED batch update:`, err);
        throw err;
      }
    },

    async count(args: any = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }
      return items.length;
    },

    async aggregate(args: any = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      const result: any = {};
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

    async groupBy(args: any = {}) {
      const q = buildFirestoreQuery(modelName, args.where);
      const snapshot = await getDocs(q);
      let items = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() || {}) })).map(convertTimestampsToDates);
      if (args.where) {
        items = items.filter(item => matchCriteria(item, args.where));
      }

      const byKeys = args.by || [];
      const groups: { [key: string]: any[] } = {};

      for (const item of items) {
        const groupKey = byKeys.map((k: string) => String(item[k] || '')).join('|');
        if (!groups[groupKey]) groups[groupKey] = [];
        groups[groupKey].push(item);
      }

      const resultList = [];
      for (const gKey of Object.keys(groups)) {
        const groupItems = groups[gKey];
        const firstItem = groupItems[0];
        const groupResult: any = {};
        for (const k of byKeys) {
          groupResult[k] = firstItem[k];
        }

        if (args._count) {
          groupResult._count = {};
          for (const k of Object.keys(args._count)) {
            if (k === '_all') {
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

export const db = new Proxy({}, {
  get(target, modelName: string) {
    if (modelName === '$transaction') {
      return async (promises: Promise<any>[]) => {
        return Promise.all(promises);
      };
    }
    if (modelName === '$connect' || modelName === '$disconnect') {
      return async () => {};
    }
    return createModelProxy(modelName);
  }
}) as any;

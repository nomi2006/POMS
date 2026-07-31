import {
    collection,
    query,
    where,
    getDocs,
    deleteDoc,
    doc
} from "firebase/firestore";

import { db } from "config/firebase";


export const deleteUserByUid = async (uid) => {
    try {
        const q = query(
            collection(db, "users"),
            where("uid", "==", uid)
        );

        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            throw new Error("User document not found");
        }

        const deletePromises = snapshot.docs.map((document) =>
            deleteDoc(doc(db, "users", document.id))
        );

        await Promise.all(deletePromises);

        return true;

    } catch (error) {
        console.error("Delete user error:", error);
        throw error;
    }
};
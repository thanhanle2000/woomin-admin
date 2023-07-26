import React from 'react';

const HomePage = () => {
    // const admin = require('firebase-admin');
    // const serviceAccount = require('../../../key/dragon-service-2e8bf-firebase-adminsdk-kuyog-a7e0e73273.json');

    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount),
    // });

    // const firestore = admin.firestore();

    // async function getTotalFirestoreUsage() {
    //     try {
    //         const collections = await firestore.listCollections();

    //         let totalSize = 0;
    //         for (const collectionRef of collections) {
    //             const documents = await collectionRef.listDocuments();
    //             for (const docRef of documents) {
    //                 const documentSnapshot = await docRef.get();
    //                 totalSize += JSON.stringify(documentSnapshot.data()).length;
    //             }
    //         }

    //         const totalSizeInKB = totalSize / 1024;
    //         console.log(`Tổng Dung Lượng Firestore: ${totalSizeInKB} KB`);
    //         return totalSizeInKB;
    //     } catch (error) {
    //         console.error('Lỗi khi lấy dữ liệu Firestore:', error);
    //         return null;
    //     }
    // }

    // useEffect(() => {
    //     getTotalFirestoreUsage();
    // }, [])

    return (
        <div className='page'>
            DashLoad
        </div>
    )
}

export default HomePage

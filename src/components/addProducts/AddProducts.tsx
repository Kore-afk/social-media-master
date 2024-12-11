import React, { useState } from 'react';
import { storage, db, auth } from '../../firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { collection, addDoc } from 'firebase/firestore';

const AddProducts: React.FC = () => {
  const [productName, setProductName] = useState<string>('');
  const [productPrice, setProductPrice] = useState<number>(0);
  const [productDescription, setProductDescription] = useState<string>('');
  const [productImg, setProductImg] = useState<File | null>(null);
  const [error, setError] = useState<string>('');

  const types = ['image/png', 'image/jpeg'];

  const productImgHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let selectedFile = e.target.files ? e.target.files[0] : null;
    if (selectedFile && types.includes(selectedFile.type)) {
      setProductImg(selectedFile);
      setError('');
    } else {
      setProductImg(null);
      setError('Please select a valid image type (jpg or png)');
    }
  };

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (productImg) {
      const storageRef = ref(storage, `product-images/${productImg.name}`);
      const uploadTask = uploadBytesResumable(storageRef, productImg);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log(progress);
        },
        (err) => setError(err.message),
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          try {
            const user = auth.currentUser;
            if (user) {
              await addDoc(collection(db, 'Products'), {
                ProductName: productName,
                ProductPrice: Number(productPrice),
                ProductDescription: productDescription,
                ProductImg: url,
                UserName: user.displayName,
                UserId: user.uid,
              });
              setProductName('');
              setProductPrice(0);
              setProductDescription('');
              setProductImg(null);
              setError('');
              (document.getElementById('file') as HTMLInputElement).value = '';
            } else {
              setError('User not authenticated');
            }
          } catch (err) {
            setError((err as Error).message);
          }
        }
      );
    }
  };

  return (
    <div className="container">
      <br />
      <h2>ADD PRODUCTS</h2>
      <hr />
      <form autoComplete="off" className="form-group" onSubmit={addProduct}>
        <label htmlFor="product-name">Product Name</label>
        <input
          type="text"
          className="form-control"
          required
          onChange={(e) => setProductName(e.target.value)}
          value={productName}
        />
        <br />
        <label htmlFor="product-price">Product Price</label>
        <input
          type="number"
          className="form-control"
          required
          onChange={(e) => setProductPrice(Number(e.target.value))}
          value={productPrice}
        />
        <br />
        <label htmlFor="product-description">Product Description</label>
        <textarea
          className="form-control"
          required
          onChange={(e) => setProductDescription(e.target.value)}
          value={productDescription}
        />
        <br />
        <label htmlFor="product-img">Product Image</label>
        <input type="file" className="form-control" id="file" required onChange={productImgHandler} />
        <br />
        <button type="submit" className="btn btn-success btn-md mybtn">
          ADD
        </button>
      </form>
      {error && <span className="error-msg">{error}</span>}
    </div>
  );
};

export default AddProducts;
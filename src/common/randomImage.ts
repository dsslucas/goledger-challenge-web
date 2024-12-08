const images = require.context('../assets/img', true);
const imageList = images.keys().map(image => images(image));

export const randomImage: any = () => {
    const randomImage: any = imageList[Math.floor(Math.random() * imageList.length)];

    return randomImage;
}
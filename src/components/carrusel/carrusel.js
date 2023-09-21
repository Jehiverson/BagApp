import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import Imagenes from "../../assets/images/imagenes";

export const ImageCarousel = () => {
    const containerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
    };

    const imageStyle = {
        objectFit: 'cover',
        objectPosition: 'center',
        width: '100%',
        height: '350px',
        marginTop: '-140px',
        marginBottom: '140px',
    };

    const responsiveContainerStyle = {
        maxWidth: '100%',
        margin: '0 auto',
    };

    const responsiveImageStyle = {
        ...imageStyle,
        height: '250px',
        marginTop: '-100px',
        marginBottom: '100px',
    };

    return (
        <Carousel style={containerStyle} autoPlay infiniteLoop interval={5000}>
            <div>
                <div style={imageStyle}>
                    <img src={Imagenes.Boda} alt="Imagen de Boda" />
                </div>
            </div>
            <div>
                <div style={imageStyle}>
                    <img src={Imagenes.Concierto} alt="Imagen de Concierto" />
                </div>
            </div>
            <div>
                <div style={imageStyle}>
                    <img src={Imagenes.DJ} alt="Imagen de DJ" />
                </div>
            </div>
            <div>
                <div style={imageStyle}>
                    <img src={Imagenes.Media} alt="Imagen de Media Fest" />
                </div>
            </div>
            <div>
                <div style={imageStyle}>
                    <img src={Imagenes.Cena} alt="Imagen de Cena" style={{marginBottom: "25px"}} />
                </div>
            </div>
        </Carousel>
    );
};

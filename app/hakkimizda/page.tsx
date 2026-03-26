"use client";

import React from 'react';
import '../../styles/hakkimizda.css';

const About = () => {
  return (
    <section className="about-container">
      <div className="about-content">
        
      
        <div className="about-images-wrapper">
          <img 
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085" 
            alt="Elmenes Coffee Sanatı" 
            className="about-img first-img"
          />
          <img 
            src="hakkiimizdagorsel.png" 
            alt="Elmenes Coffee Kavurma" 
            className="about-img second-img"
          />
        </div>

       
        <div className="text-wrapper">
          
         
          <div className="about-text-content">
            <h4 className="subtitle">HİKAYEMİZ</h4>
            <div className="divider"></div>
            <h2 className="brand-title">Elmenes Coffee</h2>
            
            
            <p className="description">
              Elmenes Coffee olarak yolculuğumuz, sadece bir fincan kahve sunma isteğiyle değil, 
              kahvenin birleştirici gücüne ve sunduğu eşsiz deneyime olan tutkumuzla başladı. 
              Bizim için kahve; topraktan fincana uzanan emek dolu bir hikâye ve bir sanattır.
            </p>

            <div className="features-grid">
              <div className="feature-item">
                <h5>Nitelikli Çekirdek</h5>
                <p>Dünyanın en seçkin kahve kuşaklarından gelen %100 Arabica çekirdekleri.</p>
              </div>
              <div className="feature-item">
                <h5>Ustalıkla Kavurma</h5>
                <p>Her çekirdeğin kendi karakterini ortaya çıkaran özel kavurma teknikleri.</p>
              </div>
            </div>

            <p className="tagline">"Kahvenin En Samimi Hali"</p>
          </div>

       
          <div className="amacimiz-konteyner">
            <div className="amacimiz-baslik">
              <h2>Amacımız</h2>
              <div className="amacimiz-cizgi"></div>
            </div>
            
            <div className="amacimiz-kartlar">
              <div className="amac-kart">
                <h3>En İyi Deneyim</h3>
                <p>Misafirlerimize her fincanda en kaliteli ve tutarlı kahve deneyimini sunmak.</p>
              </div>
              <div className="amac-kart">
                <h3>Sürdürülebilirlik</h3>
                <p>Kahve çiftçilerinden fincana kadar adil ve çevre dostu bir süreç işletmek.</p>
              </div>
              <div className="amac-kart">
                <h3>Kültür Yayılımı</h3>
                <p>"Kahve, insanları bir araya getiren en eski köprüdür. Elmenes Coffee olarak amacımız, sadece kaliteli içecekler sunmak değil; sanatın, sohbetin ve nitelikli bilginin harmanlandığı yaşayan bir kahve komünitesi oluşturmak. Bilgimizi paylaştıkça çoğalıyoruz."</p>
              </div>

              <div className="amac-kart">
    <h3>Duyusal Bir Kaçış</h3>
    <p>Elmenes Coffee sadece bir mola yeri değil, şehrin gürültüsünden uzaklaştığınız bir sığınaktır. Doğru öğütme derecesi, ideal su sıcaklığı ve huzurlu bir atmosferle beş duyunuzu birden dinlendirmeyi amaçlıyoruz.</p>
</div>
            </div>
          </div>

        </div>
      </div> 
    </section>
  );
};

export default About;
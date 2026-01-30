import React from 'react'
import { Container } from 'react-bootstrap';
import { FaCheck } from "react-icons/fa";
import joinusgroup from "../assets/images/OBJECTS (1).png"
const JoinUsGuys = () => {
  return (
    <div className='HeroJoinUs'>
        <Container>
            <img className='joinusgroup' src={joinusgroup} alt="joinusgroup" />
                    <h3>
            Why you will join our team
        </h3>
        <p>
            Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat felis. Vestibulum non consectetur tortor. Morbi at orci vehicula, vehicula mi ut, vestibulum odio. 
        </p>

        <div className='BigBox'>
            <div data-aos="fade-up"
     data-aos-duration="1000" className='contentBox'>
                <div>
                    <FaCheck />
                </div>
                <p>
                    Ut justo ligula, vehicula sed egestas vel.
                </p>
                <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat felis. Vestibulum non consectetur tortor. Morbi at orci vehicula, vehicula mi ut, vestibulum odio. 
                </span>
            </div>
                                  <div  data-aos="fade-up"
     data-aos-duration="2000" className='contentBox contentBoxxx'>

            </div>
            
                      <div  data-aos="fade-up"
     data-aos-duration="2000" className='contentBox'>
                <div>
                    <FaCheck />
                </div>
                <p>
                   Aenean vitae leo leo praesent ullamcorper ac.
                </p>
                <span>
                   Aenean vitae leo leo. Praesent ullamcorper ac libero et mattis. Aenean vel erat at neque viverra feugiat. 
                </span>
            </div>
                      <div data-aos="fade-up"
     data-aos-duration="3000" className='contentBox'>
                <div>
                    <FaCheck />
                </div>
                <p>
                    Ut justo ligula, vehicula sed egestas vel.
                </p>
                <span>
                    Quisque leo leo, suscipit sed arcu sit amet, iaculis feugiat felis. Vestibulum non consectetur tortor. Morbi at orci vehicula, vehicula mi ut, vestibulum odio. 
                </span>
            </div>
        </div>
        </Container>
    </div>
  )
}

export default JoinUsGuys
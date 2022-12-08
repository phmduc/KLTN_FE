import Header from "../../components/Header/Header.js";
import Footer from "../../components/Footer/Footer.js";
import Chat from "../../components/Chat/Chat.js";
import { Fragment } from "react";
function MainLayout({ children }) {
  return (
    <Fragment>
      <Header />
      <div className="wrapper">
        <div
          class="modal fade"
          id="infoModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="infoModalTitle"
          aria-hidden="true"
        >
          <div class="modal-dialog modal-dialog-centered" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLongTitle">
                  Thông tin cá nhân
                </h5>
                <button
                  type="button"
                  class="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">...</div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
        {children}
      </div>
      <Footer />
    </Fragment>
  );
}

export default MainLayout;

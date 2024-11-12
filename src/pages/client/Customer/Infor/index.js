import React from "react";
import Layout from "../../../../components/client/Customer/Layout";
import { useState, useEffect } from "react";
import styles from "./index.module.css";
import classNames from "classnames/bind";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserAlt } from "@fortawesome/free-solid-svg-icons";
import { ToastContainer, toast } from "react-toastify";

const cx = classNames.bind(styles);

function Infor() {
  const [fullName, setFullName] = useState("");
  const [formData, setFormData] = useState({
    fullName: "",
    dob: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const token = localStorage.getItem("authToken");
        if (!token) {
          console.error("Token is missing");
          return;
        }

        const response = await fetch("http://localhost:8081/api/v1/user/info", {
          method: "GET",
          headers: {
            accept: "*/*",
            Authorization: "Bearer " + token,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setFullName(data.fullName);
          setFormData({
            fullName: data.fullName,
            dob: data.dob,
            phone: data.phone,
          });
        } else {
          toast.error("Lỗi khi lấy thông tin");
        }
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchUserInfo();
  }, []);

  // Hàm xử lý thay đổi giá trị form
  const handleChange = (e) => {
    console.log(e);
    const { name, value } = e.target;
    if (name === "dob") {
      const formattedValue = new Date(value).toISOString().split("T")[0];
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Hàm xử lý submit form và bắn API POST
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        console.error("Token is missing");
        return;
      }

      console.log(JSON.stringify(formData));

      const response = await fetch(
        "http://localhost:8081/api/v1/user/update-info",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
          body: JSON.stringify(formData),
        }
      );

      if (response.ok) {
        toast.success("Cập nhật thông tin thành công");
      } else {
        toast.error("Lỗi khi cập nhật thông tin");
      }
    } catch (error) {
      toast.error("Lỗi khi cập nhật thông tin");
      console.error("Error:", error);
    }
  };

  return (
    <Layout fullName={fullName}>
      <ToastContainer />
      <div className={cx("box-form-customer")}>
        <p className={cx("title-form-customer")}>Edit Infor</p>
        <div className={cx("box-handle-form-customer")}>
          <FontAwesomeIcon
            size="7x"
            icon={faUserAlt}
            style={{ color: "#ccc", padding: "30px" }}
          />
          <form onSubmit={handleSubmit} className={cx("form-customer")}>
            <div className={cx("input-form-customer")}>
              <label>Full Name:</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
            </div>
            <div className={cx("input-form-customer")}>
              <label>Date of Birth:</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>
            <div className={cx("input-form-customer")}>
              <label>Phone:</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            <div className={cx("box-btn-customer")}>
              <button type="submit">Save</button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
}

export default Infor;
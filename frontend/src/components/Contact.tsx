const Contact = () => {
  return (
    <div className="max-w-md mx-auto p-4 pt-32">
      <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
      <p className="text-gray-700 mb-4">
        If you have any questions, feedback, or concerns, please feel free to
        contact us using the information below:
      </p>
      <div className="mb-4">
        <strong>Email:</strong>{" "}
        <a href="mailto:info@example.com" className="text-blue-500">
          info@example.com
        </a>
      </div>
      <div className="mb-4">
        <strong>Phone:</strong>{" "}
        <span className="text-blue-500">+1 (123) 456-7890</span>
      </div>
      <div className="mb-4">
        <strong>Address:</strong> 123 Main Street, City, Country
      </div>
    </div>
  );
};

export default Contact;

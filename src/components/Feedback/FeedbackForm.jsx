import React, { useState, useMemo } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { FaStar } from "react-icons/fa";
import { toast } from "react-hot-toast";

const FeedbackForm = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const stars = useMemo(() => [...Array(5)], []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a rating!");

    setLoading(true);

    const feedbackPromise = axiosInstance.post(API_PATHS.FEEDBACK.SUBMIT, {
      rating,
      comment,
    });

    toast.promise(feedbackPromise, {
      loading: "Sending your thoughts...",
      success: () => {
        setRating(0);
        setComment("");
        setLoading(false);
        return <b>Feedback sent! Thank you.</b>;
      },
      error: () => {
        setLoading(false);
        return <b>Could not send feedback.</b>;
      },
    });
  };

  return (
    <div className="relative bg-white p-2 md:p-0 w-full transition-all duration-500">
      <div className="relative z-10">
        <header className="text-center mb-10">
          {/* ✅ Updated Heading */}
          <h3 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight uppercase">
            Rate Us
          </h3>

          <p className="text-sm md:text-base font-medium text-slate-500 mt-2">
            Kan app i hman hian i lung a awi em? Feedback min lo pe ve rawh le.
          </p>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Rating Engine */}
          <div className="flex flex-col items-center">
            <div className="flex gap-3">
              {stars.map((_, i) => {
                const val = i + 1;
                const active = val <= (hover || rating);
                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setRating(val)}
                    onMouseEnter={() => setHover(val)}
                    onMouseLeave={() => setHover(0)}
                    className="relative transition-transform duration-200 hover:scale-110 active:scale-90 focus:outline-none"
                    aria-label={`Rate ${val} stars`}
                  >
                    <FaStar
                      className={`transition-colors duration-300 ${
                        active ? "text-yellow-400" : "text-slate-200"
                      }`}
                      size={40}
                    />
                  </button>
                );
              })}
            </div>

            <div className="h-6 mt-4">
              {rating > 0 && (
                <span className="text-xs font-bold uppercase tracking-widest text-primary animate-bounce">
                  {["Poor", "Fair", "Good", "Great", "Amazing!"][rating - 1]}
                </span>
              )}
            </div>
          </div>

          <div className="relative">
            <textarea
              className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl p-4 text-base focus:bg-white focus:border-primary focus:outline-none transition-all duration-300 placeholder:text-slate-400 resize-none"
              placeholder="I ngaihdan lo ziak rawh..."
              rows="4"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-4 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-opacity-90 shadow-lg shadow-primary/20 active:scale-[0.98] transition-all duration-300 disabled:opacity-50"
          >
            {loading ? "Processing..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FeedbackForm;

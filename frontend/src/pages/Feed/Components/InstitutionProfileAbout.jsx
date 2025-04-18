import React from "react";
import NotFound from "@/components/NotFound";

/**
 * The `InstitutionProfileAbout` component in JavaScript React renders institution profile details with
 * a placeholder text if no data is provided.
 * @returns The `InstitutionProfileAbout` component is being returned, which displays details about the
 * Islamic University of Science and Technology (IUST) in Jammu & Kashmir. The component includes a
 * title "Details" displayed in a larger font size and bold style, followed by the content passed
 * through the `data` prop or a placeholder text if no data is provided.
 */
const InstitutionProfileAbout = ({ data }) => {
  const placeholder =
    "The Islamic University of Science and Technology (IUST), Awantipora, J&K has been established through an Act No. XVIII of 2005 dated: 7th November 2005 passed by J&K State Legislature and notified by the State Government, through Jammu & Kashmir Government Gazette dated: 11-11-2005. While the university started functioning in November, 2005 the teaching programme was started in July 2006. The Chancellor of the University is the Lieuteutant Governor of Union Territory of Jammu & Kashmir and the executive authority of the University is its Executive Council with the Vice Chancellors of University of Jammu, University of Kashmir and Baba Ghulam Shah Badshah University as members. The University is accredited by NAAC with Grade ‘B’ and is recognized by University Grants Commission (UGC) under Section 2(f) and Section 12(b) of UGC Act. The Technical and nursing programmes offered by the University are approved by All India Council for Technical Education (AICTE) and Indian Nursing Council (INC). The University has the membership of Association of Indian Universities (AIU). The University came into existence with a mandate to advance and disseminate knowledge, wisdom and understanding amongst all segments of the society within and outside the State. It is also charged with creating an environment for learning, teaching and research in the sciences, technology, humanities and social sciences and that is in keeping with the highest standards of scholarship and higher education. People belonging to all sections of society are entitled to avail the facilities and opportunities offered by the University and there is no distinction on the basis of class, caste, creed, colour or religion";
  return (
    <div>
      <div className="text-xl font-bold">Details</div>
      <div>
        {data ?? (
          <NotFound
            message={"Details for this Institution are not available"}
          />
        )}
      </div>
    </div>
  );
};

export default InstitutionProfileAbout;

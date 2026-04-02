import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "./RepoDetails.css";
import TechStackChart from "../TechStackChart/TechStackChart";
import { SparklesIcon, ClockIcon, ChevronDown, Star } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "../../authContext";

// A simple Badge component for displaying status
function Badge({ children, variant = "default", className = "" }) {
  const variants = {
    default: "bg-gray-700 text-gray-200 border-gray-600",
    primary: "bg-blue-500 text-white border-blue-600",
    success: "bg-green-500 text-white border-green-600",
    destructive: "bg-red-500 text-white border-red-600",
    secondary: "bg-pink-400 text-white border-pink-600",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold border ${
        variants[variant] || variants.default
      } ${className}`}
    >
      {children}
    </span>
  );
}

// The interactive FileCard component with glass effect
const FileCard = ({ file, isExpanded, onToggle }) => {
  const cardRef = useRef(null);
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    };
    card.addEventListener("mousemove", handleMouseMove);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);
  const statusVariant = (status) => {
    switch (status) {
      case "approved": return "success";
      case "changes_requested": return "destructive";
      case "AI Reviewed": return "primary";
      case "commented": return "secondary";
      default: return "default";
    }
  };
  const formatDate = (dateStr) => new Date(dateStr).toLocaleDateString();
  return (
    <div ref={cardRef} className={`file-card-interactive ${isExpanded ? "expanded" : ""}`}>
      <div className="card-content">
        <div className="file-header">
          <span className="file-name">{file.filename}</span>
          {file.reviews && file.reviews.length > 0 && (
            <button onClick={onToggle} className="review-toggle-btn">
              Check out AI Review
              <ChevronDown className={`chevron-icon ${isExpanded ? "rotated" : ""}`} />
            </button>
          )}
        </div>
        <div className="review-details-container">
          <div className="review-details-content">
            {file.reviews && file.reviews.length > 0 ? (
              file.reviews.map((review, idx) => (
                <div key={idx} className="review-card-inner">
                  <header className="review-header">
                    <Badge variant={statusVariant(review.status)} className="flex items-center gap-2">
                      <SparklesIcon className="h-4 w-4" />
                      {review.status}
                    </Badge>
                    <div className="review-date">
                      <ClockIcon className="h-4 w-4" />
                      {formatDate(review.createdAt)}
                    </div>
                  </header>
                  <div className="review-body">
                    {review.comments.split(/[\n•-]+/).filter(Boolean).map((point, i) => (
                      <p key={i} className="review-point">{point.trim()}</p>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <p className="no-ai-review">No AI reviews available for this file.</p>
            )}
            <div className="file-actions">
              <a
                href={file.signedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn view-btn"
              >
                View File
              </a>
              <a
                href={file.downloadUrl}
                download={file.filename}
                className="btn download-btn"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Background Effect Component
const BackgroundLines = ({ svgOptions }) => {
  const pathVariants = {
    initial: { strokeDashoffset: 800, strokeDasharray: "50 800" },
    animate: {
      strokeDashoffset: 0,
      strokeDasharray: "20 800",
      opacity: [0, 1, 1, 0],
    },
  };
   const paths = [
      "M720 450C720 450 742.459 440.315 755.249 425.626C768.039 410.937 778.88 418.741 789.478 401.499C800.076 384.258 817.06 389.269 826.741 380.436C836.423 371.603 851.957 364.826 863.182 356.242C874.408 347.657 877.993 342.678 898.867 333.214C919.741 323.75 923.618 319.88 934.875 310.177C946.133 300.474 960.784 300.837 970.584 287.701C980.384 274.564 993.538 273.334 1004.85 263.087C1016.15 252.84 1026.42 250.801 1038.22 242.1C1050.02 233.399 1065.19 230.418 1074.63 215.721C1084.07 201.024 1085.49 209.128 1112.65 194.884C1139.8 180.64 1132.49 178.205 1146.43 170.636C1160.37 163.066 1168.97 158.613 1181.46 147.982C1193.95 137.35 1191.16 131.382 1217.55 125.645C1243.93 119.907 1234.19 118.899 1254.53 100.846C1274.86 82.7922 1275.12 92.8914 1290.37 76.09C1305.62 59.2886 1313.91 62.1868 1323.19 56.7536C1332.48 51.3204 1347.93 42.8082 1361.95 32.1468C1375.96 21.4855 1374.06 25.168 1397.08 10.1863C1420.09 -4.79534 1421.41 -3.16992 1431.52 -15.0078",
      "M720 450C720 450 741.044 435.759 753.062 410.636C765.079 385.514 770.541 386.148 782.73 370.489C794.918 354.83 799.378 353.188 811.338 332.597C823.298 312.005 825.578 306.419 843.707 295.493C861.837 284.568 856.194 273.248 877.376 256.48C898.558 239.713 887.536 227.843 909.648 214.958C931.759 202.073 925.133 188.092 941.063 177.621C956.994 167.151 952.171 154.663 971.197 135.041C990.222 115.418 990.785 109.375 999.488 96.1291C1008.19 82.8827 1011.4 82.2181 1032.65 61.8861C1053.9 41.5541 1045.74 48.0281 1064.01 19.5798C1082.29 -8.86844 1077.21 -3.89415 1093.7 -19.66C1110.18 -35.4258 1105.91 -46.1146 1127.68 -60.2834C1149.46 -74.4523 1144.37 -72.1024 1154.18 -97.6802C1163.99 -123.258 1165.6 -111.332 1186.21 -135.809C1206.81 -160.285 1203.29 -160.861 1220.31 -177.633C1237.33 -194.406 1236.97 -204.408 1250.42 -214.196",
      "M720 450C720 450 712.336 437.768 690.248 407.156C668.161 376.544 672.543 394.253 665.951 365.784C659.358 337.316 647.903 347.461 636.929 323.197C625.956 298.933 626.831 303.639 609.939 281.01C593.048 258.381 598.7 255.282 582.342 242.504C565.985 229.726 566.053 217.66 559.169 197.116C552.284 176.572 549.348 171.846 529.347 156.529C509.345 141.211 522.053 134.054 505.192 115.653C488.33 97.2527 482.671 82.5627 473.599 70.7833C464.527 59.0039 464.784 50.2169 447 32.0721C429.215 13.9272 436.29 0.858563 423.534 -12.6868C410.777 -26.2322 407.424 -44.0808 394.364 -56.4916C381.303 -68.9024 373.709 -72.6804 365.591 -96.1992C357.473 -119.718 358.364 -111.509 338.222 -136.495C318.08 -161.481 322.797 -149.499 315.32 -181.761C307.843 -214.023 294.563 -202.561 285.795 -223.25C277.026 -243.94 275.199 -244.055 258.602 -263.871",
      "M720 450C720 450 738.983 448.651 790.209 446.852C841.436 445.052 816.31 441.421 861.866 437.296C907.422 433.172 886.273 437.037 930.656 436.651C975.04 436.264 951.399 432.343 1001.57 425.74C1051.73 419.138 1020.72 425.208 1072.85 424.127C1124.97 423.047 1114.39 420.097 1140.02 414.426C1165.65 408.754 1173.1 412.143 1214.55 411.063C1256.01 409.983 1242.78 406.182 1285.56 401.536C1328.35 396.889 1304.66 400.796 1354.41 399.573C1404.16 398.35 1381.34 394.315 1428.34 389.376C1475.35 384.438 1445.96 386.509 1497.93 385.313C1549.9 384.117 1534.63 382.499 1567.23 381.48",
      "M720 450C720 450 696.366 458.841 682.407 472.967C668.448 487.093 673.23 487.471 647.919 492.882C622.608 498.293 636.85 499.899 609.016 512.944C581.182 525.989 596.778 528.494 571.937 533.778C547.095 539.062 551.762 548.656 536.862 556.816C521.962 564.975 515.626 563.279 497.589 575.159C479.552 587.04 484.343 590.435 461.111 598.728C437.879 607.021 442.512 605.226 423.603 618.397C404.694 631.569 402.411 629.541 390.805 641.555C379.2 653.568 369.754 658.175 353.238 663.929C336.722 669.683 330.161 674.689 312.831 684.116C295.5 693.543 288.711 698.815 278.229 704.041C267.747 709.267 258.395 712.506 240.378 726.65C222.361 740.795 230.097 738.379 203.447 745.613C176.797 752.847 193.747 752.523 166.401 767.148C139.056 781.774 151.342 783.641 130.156 791.074C108.97 798.507 116.461 802.688 96.0974 808.817C75.7334 814.946 83.8553 819.505 59.4513 830.576C35.0473 841.648 48.2548 847.874 21.8337 853.886C-4.58739 859.898 10.5966 869.102 -16.396 874.524",
      "M719.974 450C719.974 450 765.293 459.346 789.305 476.402C813.318 493.459 825.526 487.104 865.093 495.586C904.659 504.068 908.361 510.231 943.918 523.51C979.475 536.789 963.13 535.277 1009.79 547.428C1056.45 559.579 1062.34 555.797 1089.82 568.96C1117.31 582.124 1133.96 582.816 1159.12 592.861C1184.28 602.906 1182.84 603.359 1233.48 614.514C1284.12 625.67 1254.63 632.207 1306.33 644.465C1358.04 656.723 1359.27 656.568 1378.67 670.21C1398.07 683.852 1406.16 676.466 1456.34 692.827C1506.51 709.188 1497.73 708.471 1527.54 715.212",
      "M720 450C720 450 727.941 430.821 734.406 379.251C740.87 327.681 742.857 359.402 757.864 309.798C772.871 260.194 761.947 271.093 772.992 244.308C784.036 217.524 777.105 200.533 786.808 175.699C796.511 150.864 797.141 144.333 808.694 107.307C820.247 70.2821 812.404 88.4169 819.202 37.1016C826 -14.2137 829.525 -0.990829 839.341 -30.3874C849.157 -59.784 844.404 -61.5924 855.042 -98.7516C865.68 -135.911 862.018 -144.559 876.924 -167.488C891.83 -190.418 886.075 -213.535 892.87 -237.945C899.664 -262.355 903.01 -255.031 909.701 -305.588C916.393 -356.144 917.232 -330.612 925.531 -374.777",
      "M720 450C720 450 722.468 499.363 726.104 520.449C729.739 541.535 730.644 550.025 738.836 589.07C747.028 628.115 743.766 639.319 746.146 659.812C748.526 680.306 754.006 693.598 757.006 732.469C760.007 771.34 760.322 765.244 763.893 805.195C767.465 845.146 769.92 822.227 773.398 868.469C776.875 914.71 776.207 901.365 778.233 940.19C780.259 979.015 782.53 990.477 787.977 1010.39C793.424 1030.3 791.788 1060.01 797.243 1082.24C802.698 1104.47 801.758 1130.29 808.181 1149.64C814.604 1168.99 813.135 1171.5 818.026 1225.28C822.918 1279.06 820.269 1267.92 822.905 1293.75",
      "M720 450C720 450 737.033 492.46 757.251 515.772C777.468 539.084 768.146 548.687 785.517 570.846C802.887 593.005 814.782 609.698 824.589 634.112C834.395 658.525 838.791 656.702 855.55 695.611C872.31 734.519 875.197 724.854 890.204 764.253C905.21 803.653 899.844 790.872 919.927 820.763C940.01 850.654 939.071 862.583 954.382 886.946C969.693 911.309 968.683 909.254 993.997 945.221C1019.31 981.187 1006.67 964.436 1023.49 1007.61C1040.32 1050.79 1046.15 1038.25 1059.01 1073.05C1071.88 1107.86 1081.39 1096.19 1089.45 1131.96C1097.51 1167.73 1106.52 1162.12 1125.77 1196.89",
      "M720 450C720 450 687.302 455.326 670.489 467.898C653.676 480.47 653.159 476.959 626.58 485.127C600.002 493.295 599.626 495.362 577.94 503.841C556.254 512.319 556.35 507.426 533.958 517.44C511.566 527.454 505.82 526.441 486.464 539.172C467.108 551.904 461.312 546.36 439.357 553.508C417.402 560.657 406.993 567.736 389.393 572.603C371.794 577.47 371.139 583.76 344.54 587.931C317.941 592.102 327.375 593.682 299.411 607.275C271.447 620.868 283.617 615.022 249.868 622.622C216.119 630.223 227.07 630.86 203.77 638.635C180.47 646.41 168.948 652.487 156.407 657.28C143.866 662.073 132.426 669.534 110.894 675.555C89.3615 681.575 90.3234 680.232 61.1669 689.897C32.0105 699.562 34.3696 702.021 15.9011 709.789C-2.56738 717.558 2.38861 719.841 -29.9494 729.462C-62.2873 739.083 -52.5552 738.225 -77.4307 744.286",
      "M720 450C720 450 743.97 465.061 754.884 490.648C765.798 516.235 781.032 501.34 791.376 525.115C801.72 548.889 808.417 538.333 829.306 564.807C850.195 591.281 852.336 582.531 865.086 601.843C877.835 621.155 874.512 621.773 902.383 643.857C930.255 665.94 921.885 655.976 938.025 681.74C954.164 707.505 959.384 709.719 977.273 720.525C995.162 731.33 994.233 731.096 1015.92 757.676C1037.61 784.257 1025.74 768.848 1047.82 795.343C1069.91 821.837 1065.95 815.45 1085.93 834.73C1105.91 854.009 1110.53 848.089 1124.97 869.759C1139.4 891.428 1140.57 881.585 1158.53 911.499C1176.5 941.414 1184.96 933.829 1194.53 948.792C1204.09 963.755 1221.35 973.711 1232.08 986.224C1242.8 998.738 1257.34 1015.61 1269.99 1026.53C1282.63 1037.45 1293.81 1040.91 1307.21 1064.56",
      "M718.24 412.717 716.359 397.31C714.478 381.902 713.988 362.237 710.785 344.829C707.582 327.42 708.407 322.274 701.686 292.106C694.965 261.937 699.926 270.857 694.84 240.765C689.753 210.674 693.055 217.076 689.674 184.902C686.293 152.728 686.041 149.091 682.676 133.657C679.311 118.223 682.23 106.005 681.826 80.8297C681.423 55.6545 677.891 60.196 675.66 30.0226C673.429 -0.150848 672.665 -7.94842 668.592 -26.771C664.52 -45.5935 664.724 -43.0755 661.034 -78.7766C657.343 -114.478 658.509 -103.181 653.867 -133.45C649.226 -163.719 650.748 -150.38 647.052 -182.682C643.357 -214.984 646.125 -214.921 645.216 -238.402C644.307 -261.883 640.872 -253.4 637.237 -291.706C633.602 -330.012 634.146 -309.868 630.717 -343.769C627.288 -377.669 628.008 -370.682 626.514 -394.844",
      "M720 450C720 450 711.433 430.82 707.745 409.428C704.056 388.035 704.937 381.711 697.503 370.916C690.069 360.121 691.274 359.999 685.371 334.109C679.469 308.22 677.496 323.883 671.24 294.303C664.984 264.724 667.608 284.849 662.065 258.116C656.522 231.383 656.357 229.024 647.442 216.172C638.527 203.319 640.134 192.925 635.555 178.727C630.976 164.529 630.575 150.179 624.994 139.987C619.413 129.794 615.849 112.779 612.251 103.074C608.654 93.3696 606.942 85.6729 603.041 63.0758C599.14 40.4787 595.242 36.9267 589.533 23.8967C583.823 10.8666 581.18 -2.12401 576.96 -14.8333C572.739 -27.5425 572.696 -37.7703 568.334 -51.3441C563.972 -64.9179 562.14 -67.2124 556.992 -93.299C551.844 -119.386 550.685 -109.743 544.056 -129.801C537.428 -149.859 534.97 -151.977 531.034 -170.076C527.099 -188.175 522.979 -185.119 519.996 -207.061C517.012 -229.004 511.045 -224.126 507.478 -247.077C503.912 -270.029 501.417 -271.033 495.534 -287C489.651 -302.968 491.488 -300.977 484.68 -326.317C477.872 -351.657 476.704 -348.494 472.792 -363.258",
      "M720 450C720 450 723.524 466.673 728.513 497.319C733.503 527.964 731.894 519.823 740.001 542.706C748.108 565.589 744.225 560.598 748.996 588.365C753.766 616.131 756.585 602.096 761.881 636.194C767.178 670.293 768.155 649.089 771.853 679.845C775.551 710.6 775.965 703.738 781.753 724.555C787.54 745.372 787.248 758.418 791.422 773.79C795.596 789.162 798.173 807.631 804.056 819.914C809.938 832.197 806.864 843.07 811.518 865.275C816.171 887.48 816.551 892.1 822.737 912.643C828.922 933.185 830.255 942.089 833.153 956.603C836.052 971.117 839.475 969.242 846.83 1003.98C854.185 1038.71 850.193 1028.86 854.119 1048.67C858.045 1068.48 857.963 1074.39 863.202 1094.94C868.44 1115.49 867.891 1108.03 874.497 1138.67C881.102 1169.31 880.502 1170.72 887.307 1186.56C894.111 1202.4 890.388 1209.75 896.507 1231.25C902.627 1252.76 902.54 1245.39 906.742 1279.23",
      "M720 450C720 450 698.654 436.893 669.785 424.902C640.916 412.91 634.741 410.601 615.568 402.586C596.396 394.571 594.829 395.346 568.66 378.206C542.492 361.067 547.454 359.714 514.087 348.978C480.721 338.242 479.79 334.731 467.646 329.846C455.502 324.96 448.63 312.156 416.039 303.755C383.448 295.354 391.682 293.73 365.021 280.975C338.36 268.219 328.715 267.114 309.809 252.575C290.903 238.036 277.185 246.984 259.529 230.958C241.873 214.931 240.502 224.403 211.912 206.241C183.323 188.078 193.288 190.89 157.03 181.714C120.772 172.538 127.621 170.109 108.253 154.714C88.8857 139.319 75.4927 138.974 56.9647 132.314C38.4366 125.654 33.8997 118.704 4.77584 106.7C-24.348 94.6959 -19.1326 90.266 -46.165 81.9082",
      "M720 450C720 450 711.596 475.85 701.025 516.114C690.455 556.378 697.124 559.466 689.441 579.079C681.758 598.693 679.099 597.524 675.382 642.732C671.665 687.94 663.4 677.024 657.844 700.179C652.288 723.333 651.086 724.914 636.904 764.536C622.723 804.158 631.218 802.853 625.414 827.056C619.611 851.259 613.734 856.28 605.94 892.262C598.146 928.244 595.403 924.314 588.884 957.785C582.364 991.255 583.079 991.176 575.561 1022.63C568.044 1054.08 566.807 1058.45 558.142 1084.32C549.476 1110.2 553.961 1129.13 542.367 1149.25C530.772 1169.37 538.268 1180.37 530.338 1207.27C522.407 1234.17 520.826 1245.53 512.156 1274.2",
      "M720 450C720 450 730.571 424.312 761.424 411.44C792.277 398.569 772.385 393.283 804.069 377.232C835.752 361.182 829.975 361.373 848.987 342.782C867.999 324.192 877.583 330.096 890.892 303.897C904.201 277.698 910.277 282.253 937.396 264.293C964.514 246.333 949.357 246.834 978.7 230.438C1008.04 214.042 990.424 217.952 1021.51 193.853C1052.6 169.753 1054.28 184.725 1065.97 158.075C1077.65 131.425 1087.76 139.068 1111.12 120.345C1134.49 101.622 1124.9 104.858 1151.67 86.3162C1178.43 67.7741 1167.09 66.2676 1197.53 47.2606C1227.96 28.2536 1225.78 23.2186 1239.27 12.9649C1252.76 2.7112 1269.32 -9.47929 1282.88 -28.5587C1296.44 -47.6381 1305.81 -41.3853 1323.82 -62.7027C1341.83 -84.0202 1340.32 -82.3794 1368.98 -98.9326",
    ];
const colors = [
  "#ffff00", // Bright Yellow
  "#ffd700", // Gold
  "#ffa500", // Orange
  "#ff4500", // Orange-Red
  "#ff0000", // Bright Red
  "#ffff00", // Bright Yellow
  "#ffd700", // Gold
  "#ffa500", // Orange
  "#ff4500", // Orange-Red
  "#ff0000", // Bright Red
  "#ffff00", // Bright Yellow
  "#ffd700", // Gold
  "#ffa500", // Orange
  "#ff4500", // Orange-Red
  "#ff0000", // Bright Red
  "#ffff00", // Bright Yellow
  "#ffd700", // Gold
  "#ffa500", // Orange
  "#ff4500", // Orange-Red
  "#ff0000", // Bright Red
  "#ffff00", // Bright Yellow
];
  return (
    <motion.svg
      viewBox="0 0 1440 900"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="background-svg-effect" // Use this new class for styling
    >
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          stroke={colors[idx % colors.length]} // Use modulo to prevent errors
          strokeWidth="2.3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.floor(Math.random() * 10),
            repeatDelay: Math.floor(Math.random() * 10 + 2),
          }}
          key={`path-first-${idx}`}
        />
      ))}
      {paths.map((path, idx) => (
        <motion.path
          d={path}
          stroke={colors[idx % colors.length]} // Use modulo to prevent errors
          strokeWidth="2.3"
          strokeLinecap="round"
          variants={pathVariants}
          initial="initial"
          animate="animate"
          transition={{
            duration: svgOptions?.duration || 10,
            ease: "linear",
            repeat: Infinity,
            repeatType: "loop",
            delay: Math.floor(Math.random() * 10),
            repeatDelay: Math.floor(Math.random() * 10 + 2),
          }}
          key={`path-second-${idx}`}
        />
      ))}
    </motion.svg>
  );
};


// Main RepoDetails Component
const RepoDetails = () => {
  const { id } = useParams();
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedFileId, setExpandedFileId] = useState(null);
  
  const { currentUser } = useAuth();
  const [isStarred, setIsStarred] = useState(false);
  const [togglingStar, setTogglingStar] = useState(false);

  useEffect(() => {
    const fetchRepo = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/repo/${id}`);
        if (!res.ok) throw new Error("Failed to fetch repository");
        const data = await res.json();
        setRepo(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setRepo(null);
      } finally {
        setLoading(false);
      }
    };
    fetchRepo();
  }, [id]);

  useEffect(() => {
    const checkStarStatus = async () => {
      if (!currentUser?._id || !repo) return;
      try {
        const res = await fetch(`http://localhost:3000/userProfile/${currentUser._id}`);
        if (res.ok) {
          const userData = await res.json();
          // starRepos is populated, so it contains objects with _id
          const hasStarred = userData.starRepos?.some(r => r._id === id || r === id);
          setIsStarred(!!hasStarred);
        }
      } catch (err) {
        console.error("Error checking star status", err);
      }
    };
    checkStarStatus();
  }, [repo, currentUser, id]);

  const handleStarToggle = async () => {
    if (!currentUser?._id) return alert("Please log in to star repositories!");
    setTogglingStar(true);
    try {
      const res = await fetch(`http://localhost:3000/userProfile/${currentUser._id}/star`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoId: id })
      });
      if (res.ok) {
        setIsStarred(!isStarred);
      } else {
        alert("Failed to toggle star.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setTogglingStar(false);
    }
  };

  const handleToggleReview = (fileId) => {
    setExpandedFileId(expandedFileId === fileId ? null : fileId);
  };

  if (loading) return <div className="loading">Loading repository details...</div>;
  if (error) return <div className="error">Error: {error}</div>;
  if (!repo) return <div className="error">Repository not found.</div>;

  return (
    <div className="repo-details-container">
      <BackgroundLines />

      <div className="repo-details-wrapper">
        <h2 className="files-heading">Repository Files</h2>
        <div className="page-content-wrapper">
          <div className="repo-files-section">
            {repo.content && repo.content.length > 0 ? (
              <div className="files-grid">
                {repo.content.map((file) => (
                  <FileCard
                    key={file._id || file.filename}
                    file={file}
                    isExpanded={expandedFileId === (file._id || file.filename)}
                    onToggle={() => handleToggleReview(file._id || file.filename)}
                  />
                ))}
              </div>
            ) : (
              <p className="no-files">No files found in this repository.</p>
            )}
          </div>
          <div className="repo-info-card">
            <div className="repo-title-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <h2 className="repo-title" style={{ margin: 0 }}>{repo.name}</h2>
              <button 
                onClick={handleStarToggle} 
                className="star-toggle-btn"
                disabled={togglingStar}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ffc107', display: 'flex', alignItems: 'center', gap: '5px' }}
              >
                <Star size={24} fill={isStarred ? "#ffc107" : "none"} stroke="#ffc107" />
                <span style={{ fontSize: '14px', fontWeight: 'bold' }}>{isStarred ? "Starred" : "Star"}</span>
              </button>
            </div>
            <p className="repo-description">{repo.description}</p>
            <p className="repo-owner">
              Created by: <strong>{repo.owner?.username || "Unknown"}</strong>
            </p>
            <div className="tech-chart-details-container">
              <TechStackChart
                repos={repo.files ? [{ files: repo.files }] : []}
                title="Tech Distribution"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;
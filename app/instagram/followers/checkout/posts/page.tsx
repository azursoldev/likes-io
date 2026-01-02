"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Header from "../../../../components/Header";
import Footer from "../../../../components/Footer";

function PostsSelectionRedirect() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    // Redirect to final page immediately as followers don't need post selection
    const params = new URLSearchParams(searchParams.toString());
    router.replace(`/instagram/followers/checkout/final?${params.toString()}`);
  }, [searchParams, router]);

  return (
    <>
      <Header />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ 
          width: '40px', 
          height: '40px', 
          border: '3px solid #f3f3f3', 
          borderTop: '3px solid #6366f1', 
          borderRadius: '50%', 
          animation: 'spin 1s linear infinite' 
        }}></div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
      <Footer />
    </>
  );
}

export default function PostsSelectionPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PostsSelectionRedirect />
    </Suspense>
  );
}

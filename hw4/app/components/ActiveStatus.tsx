'use client';

import useActiveChannel from "../hooks/useActiveChannel";

function ActiveStatus() {
  useActiveChannel();

  return null;
}
 
export default ActiveStatus;
import bcrypt from "bcrypt";

const password = "Admin@123";

const run = async () => {
  const hash = await bcrypt.hash(password, 10);
  console.log("HASH:", hash);
};

run();

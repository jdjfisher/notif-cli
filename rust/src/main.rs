use structopt::StructOpt;

extern crate reqwest;

#[derive(StructOpt)]
struct Cli {
    /// The path to the file to read
    #[structopt(parse(from_os_str))]
    path: std::path::PathBuf,
}

// #[derive(Debug, Serialize, Deserialize)]
// struct MyConfig {
//     name: String,
//     comfy: bool,
//     foo: i64,
// }

const APP_NAME: &str = "notif";
const API_URL: &str = "https://localhost:8000";

fn main() {
    let args = Cli::from_args();
    // let config: MyConfig = confy::load(APP_NAME)?;
}
